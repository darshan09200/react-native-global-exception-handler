#import <GlobalExceptionHandlerSpec/GlobalExceptionHandlerSpec.h>
#import <React/RCTBridgeModule.h>
#import <atomic>

@interface GlobalExceptionHandler : NSObject <NativeGlobalExceptionHandlerSpec>

@end

// Exception handling function declarations
void HandleException(NSException *exception);
void SignalHandler(int signal);

// Constants
extern NSString * const RNUncaughtExceptionHandlerSignalExceptionName;
extern NSString * const RNUncaughtExceptionHandlerSignalKey;
extern NSString * const RNUncaughtExceptionHandlerAddressesKey;
extern std::atomic<int32_t> RNUncaughtExceptionCount;
extern const int32_t RNUncaughtExceptionMaximum;
extern const NSInteger RNUncaughtExceptionHandlerSkipAddressCount;
extern const NSInteger RNUncaughtExceptionHandlerReportAddressCount;
