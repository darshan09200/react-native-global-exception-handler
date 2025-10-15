#import <Foundation/Foundation.h>
#import <atomic>
#include <execinfo.h>

#if RCT_NEW_ARCH_ENABLED
  #import <GlobalExceptionHandlerSpec/GlobalExceptionHandlerSpec.h>
  
  @interface GlobalExceptionHandler : NSObject <NativeGlobalExceptionHandlerSpec>
  @end

#else
  #import <React/RCTBridgeModule.h>
  
  @interface GlobalExceptionHandler : NSObject <RCTBridgeModule>
  @end

#endif

// Exception handling function declarations
void HandleException(NSException *exception);
void SignalHandler(int signal);
