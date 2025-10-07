#import "GlobalExceptionHandler.h"
#import <React/RCTBridgeModule.h>
#import <execinfo.h>
#import <atomic>

// CONSTANTS
NSString * const RNUncaughtExceptionHandlerSignalExceptionName = @"RNUncaughtExceptionHandlerSignalExceptionName";
NSString * const RNUncaughtExceptionHandlerSignalKey = @"RNUncaughtExceptionHandlerSignalKey";
NSString * const RNUncaughtExceptionHandlerAddressesKey = @"RNUncaughtExceptionHandlerAddressesKey";
std::atomic<int32_t> RNUncaughtExceptionCount(0);
const int32_t RNUncaughtExceptionMaximum = 10;
const NSInteger RNUncaughtExceptionHandlerSkipAddressCount = 4;
const NSInteger RNUncaughtExceptionHandlerReportAddressCount = 5;

@implementation GlobalExceptionHandler

- (dispatch_queue_t)methodQueue
{
  return dispatch_get_main_queue();
}

// ======================
// VARIABLE DECLARATIONS
// ======================

//variable which is used to track till when to keep the app running on exception.
bool dismissApp = true;

//variable to hold the custom error handler passed while customizing native handler
void (^nativeErrorCallbackBlock)(NSException *exception, NSString *readableException);

// variable to hold the previously defined error handler
NSUncaughtExceptionHandler* previousNativeErrorCallbackBlock;

BOOL callPreviousNativeErrorCallbackBlock = false;

//variable to hold the js error handler when setting up the error handler in RN.
void (^jsErrorCallbackBlock)(NSException *exception, NSString *readableException);

//variable that holds the default native error handler
void (^defaultNativeErrorCallbackBlock)(NSException *exception, NSString *readableException) =
^(NSException *exception, NSString *readableException){
  
  UIAlertController* alert = [UIAlertController
                              alertControllerWithTitle:@"Unexpected error occured"
                              message:[NSString stringWithFormat:@"%@\n%@",
                                       @"Apologies..The app will close now \nPlease restart the app\n",
                                       readableException]
                              preferredStyle:UIAlertControllerStyleAlert];
  
  UIApplication* app = [UIApplication sharedApplication];
  UIViewController * rootViewController = app.delegate.window.rootViewController;
  [rootViewController presentViewController:alert animated:YES completion:nil];
  
  [NSTimer scheduledTimerWithTimeInterval:5.0
                                   target:[GlobalExceptionHandler class]
                                 selector:@selector(releaseExceptionHold)
                                 userInfo:nil
                                  repeats:NO];
};

// ====================================
// REACT NATIVE MODULE EXPOSED METHODS
// ====================================

// METHOD TO INITIALIZE THE EXCEPTION HANDLER AND SET THE JS CALLBACK BLOCK
- (void)setHandlerForNativeException:(BOOL)callPreviouslyDefinedHandler callback:(RCTResponseSenderBlock)callback
{
  jsErrorCallbackBlock = ^(NSException *exception, NSString *readableException){
    callback(@[readableException]);
  };
  
  previousNativeErrorCallbackBlock = NSGetUncaughtExceptionHandler();
  callPreviousNativeErrorCallbackBlock = callPreviouslyDefinedHandler;
  
  NSSetUncaughtExceptionHandler(&HandleException);
  signal(SIGABRT, SignalHandler);
  signal(SIGILL, SignalHandler);
  signal(SIGSEGV, SignalHandler);
  signal(SIGFPE, SignalHandler);
  signal(SIGBUS, SignalHandler);
  //signal(SIGPIPE, SignalHandler);
  //Removing SIGPIPE as per https://github.com/master-atul/react-native-exception-handler/issues/32
  NSLog(@"REGISTERED RN EXCEPTION HANDLER");
}


- (void)simulateNativeCrash:(NSString *)crashType {
  NSLog(@"SIMULATING CRASH TYPE: %@", crashType);
  
  // Use dispatch_async to ensure the crash happens outside the TurboModule call context
  // This allows our exception handler to catch it properly
  dispatch_async(dispatch_get_main_queue(), ^{
    [self performCrash:crashType];
  });
}

- (void)performCrash:(NSString *)crashType {
  if ([crashType isEqualToString:@"nsexception"] || crashType == nil || [crashType length] == 0) {
    // Default: Standard NSException
    @throw [NSException exceptionWithName:NSGenericException
                                   reason:@"Simulated NSException for testing"
                                 userInfo:@{@"crashType": @"nsexception"}];
  }
  else if ([crashType isEqualToString:@"array_bounds"]) {
    // Array bounds exception (NSRangeException)
    NSArray *testArray = @[@"item1", @"item2"];
    id item = [testArray objectAtIndex:10]; // Out of bounds
    NSLog(@"This should never be reached: %@", item);
  }
  else if ([crashType isEqualToString:@"invalid_argument"]) {
    // Invalid argument exception
    @throw [NSException exceptionWithName:NSInvalidArgumentException
                                   reason:@"Simulated invalid argument exception"
                                 userInfo:@{@"crashType": @"invalid_argument"}];
  }
  else if ([crashType isEqualToString:@"memory_access"]) {
    // Memory access violation (will trigger SIGSEGV)
    int *p = NULL;
    *p = 42; // Segmentation fault
  }
  else if ([crashType isEqualToString:@"abort"]) {
    // Abort signal (SIGABRT)
    NSLog(@"TRIGGERING ABORT - SHOULD RAISE SIGABRT");
    abort();
  }
  else if ([crashType isEqualToString:@"sigill"]) {
    // Illegal instruction (SIGILL)
    NSLog(@"TRIGGERING ILLEGAL INSTRUCTION - SHOULD RAISE SIGILL");
    raise(SIGILL);
  }
  else if ([crashType isEqualToString:@"sigbus"]) {
    // Bus error (SIGBUS)
    NSLog(@"TRIGGERING BUS ERROR - SHOULD RAISE SIGBUS");
    raise(SIGBUS);
  }
  else if ([crashType isEqualToString:@"stack_overflow"]) {
    // Stack overflow (recursive call)
    [self simulateNativeCrash:@"stack_overflow"];
  }
  else if ([crashType isEqualToString:@"internal_inconsistency"]) {
    // Internal inconsistency exception
    @throw [NSException exceptionWithName:NSInternalInconsistencyException
                                   reason:@"Simulated internal inconsistency"
                                 userInfo:@{@"crashType": @"internal_inconsistency"}];
  }
  else if ([crashType isEqualToString:@"malloc_error"]) {
    // Memory allocation error
    @throw [NSException exceptionWithName:NSMallocException
                                   reason:@"Simulated memory allocation error"
                                 userInfo:@{@"crashType": @"malloc_error"}];
  }
  else {
    // Unknown crash type, default to generic exception
    @throw [NSException exceptionWithName:@"UnknownCrashType"
                                   reason:[NSString stringWithFormat:@"Unknown crash type: %@. Using default exception.", crashType]
                                 userInfo:@{@"crashType": crashType ?: @"unknown"}];
  }
}

// =====================================================
// METHODS TO CUSTOMIZE THE DEFAULT NATIVE ERROR HANDLER
// =====================================================

+ (void) replaceNativeExceptionHandlerBlock:(void (^)(NSException *exception, NSString *readableException))nativeCallbackBlock{
  NSLog(@"SET THE CALLBACK HANDLER NATTTIVEEE");
  nativeErrorCallbackBlock = nativeCallbackBlock;
}

+ (void) releaseExceptionHold {
  dismissApp = true;
  NSLog(@"RELEASING LOCKED RN EXCEPTION HANDLER");
}

// ================================================================
// ACTUAL CUSTOM HANDLER called by the EXCEPTION AND SIGNAL HANDLER
// WHICH KEEPS THE APP RUNNING ON EXCEPTION
// ================================================================

- (void)handleException:(NSException *)exception
{
  NSString * readeableError = [NSString stringWithFormat:NSLocalizedString(@"%@\n%@", nil),
                               [exception reason],
                               [[exception userInfo] objectForKey:RNUncaughtExceptionHandlerAddressesKey]];
  dismissApp = false;
  if (callPreviousNativeErrorCallbackBlock && previousNativeErrorCallbackBlock) {
    previousNativeErrorCallbackBlock(exception);
  }
  
  if(nativeErrorCallbackBlock != nil){
    nativeErrorCallbackBlock(exception,readeableError);
  }else{
    defaultNativeErrorCallbackBlock(exception,readeableError);
  }
  jsErrorCallbackBlock(exception,readeableError);
  
  CFRunLoopRef runLoop = CFRunLoopGetCurrent();
  CFArrayRef allModes = CFRunLoopCopyAllModes(runLoop);
  while (!dismissApp)
  {
    long count = CFArrayGetCount(allModes);
    long i = 0;
    while(i < count){
      NSString *mode = (__bridge NSString *)CFArrayGetValueAtIndex(allModes, i);
      if(![mode isEqualToString:@"kCFRunLoopCommonModes"]){
        CFRunLoopRunInMode((CFStringRef)mode, 0.001, false);
      }
      i++;
    }
  }
  
  CFRelease(allModes);
  
  NSSetUncaughtExceptionHandler(NULL);
  signal(SIGABRT, SIG_DFL);
  signal(SIGILL, SIG_DFL);
  signal(SIGSEGV, SIG_DFL);
  signal(SIGFPE, SIG_DFL);
  signal(SIGBUS, SIG_DFL);
  signal(SIGPIPE, SIG_DFL);
  
  kill(getpid(), [[[exception userInfo] objectForKey:RNUncaughtExceptionHandlerSignalKey] intValue]);
}

// ====================================
// UTILITY METHOD TO GET THE BACKTRACE
// ====================================

+ (NSArray *)backtrace
{
  void* callstack[128];
  int frames = backtrace(callstack, 128);
  char **strs = backtrace_symbols(callstack, frames);
  
  int i;
  NSMutableArray *backtrace = [NSMutableArray arrayWithCapacity:frames];
  for (
       i = RNUncaughtExceptionHandlerSkipAddressCount;
       i < RNUncaughtExceptionHandlerSkipAddressCount +
       RNUncaughtExceptionHandlerReportAddressCount;
       i++)
  {
    [backtrace addObject:[NSString stringWithUTF8String:strs[i]]];
  }
  free(strs);
  
  return backtrace;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
(const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeGlobalExceptionHandlerSpecJSI>(params);
}

+ (NSString *)moduleName
{
  return @"GlobalExceptionHandler";
}

@end

// ============================================================================
// EXCEPTION AND SIGNAL HANDLERS to collect error and launch the custom handler
// ============================================================================

void HandleException(NSException *exception)
{
  NSLog(@"=== HANDLING NSEXCEPTION (not signal) ===");
  int32_t exceptionCount = std::atomic_fetch_add_explicit(&RNUncaughtExceptionCount, 1, std::memory_order_relaxed) + 1;
  if (exceptionCount > RNUncaughtExceptionMaximum)
  {
    return;
  }
  
  NSArray *callStack = [GlobalExceptionHandler backtrace];
  NSMutableDictionary *userInfo =
  [NSMutableDictionary dictionaryWithDictionary:[exception userInfo]];
  [userInfo
   setObject:callStack
   forKey:RNUncaughtExceptionHandlerAddressesKey];
  
  [[[GlobalExceptionHandler alloc] init]
   performSelectorOnMainThread:@selector(handleException:)
   withObject:
     [NSException
      exceptionWithName:[exception name]
      reason:[exception reason]
      userInfo:userInfo]
   waitUntilDone:YES];
}

void SignalHandler(int signal)
{
  NSLog(@"=== HANDLING SIGNAL %d ===", signal);
  int32_t exceptionCount = std::atomic_fetch_add_explicit(&RNUncaughtExceptionCount, 1, std::memory_order_relaxed) + 1;
  if (exceptionCount > RNUncaughtExceptionMaximum)
  {
    return;
  }
  
  NSMutableDictionary *userInfo =
  [NSMutableDictionary
   dictionaryWithObject:[NSNumber numberWithInt:signal]
   forKey:RNUncaughtExceptionHandlerSignalKey];
  
  NSArray *callStack = [GlobalExceptionHandler backtrace];
  [userInfo
   setObject:callStack
   forKey:RNUncaughtExceptionHandlerAddressesKey];
  
  [[[GlobalExceptionHandler alloc] init]
   performSelectorOnMainThread:@selector(handleException:)
   withObject:
     [NSException
      exceptionWithName:RNUncaughtExceptionHandlerSignalExceptionName
      reason:
        [NSString stringWithFormat:
         NSLocalizedString(@"Signal %d was raised.", nil),
         signal]
      userInfo:
        [NSDictionary
         dictionaryWithObject:[NSNumber numberWithInt:signal]
         forKey:RNUncaughtExceptionHandlerSignalKey]]
   waitUntilDone:YES];
}
