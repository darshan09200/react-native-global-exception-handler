package com.globalexceptionhandler

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = GlobalExceptionHandlerModule.NAME)
class GlobalExceptionHandlerModule(reactContext: ReactApplicationContext) :
  NativeGlobalExceptionHandlerSpec(reactContext) {

  private val globalExceptionHandler = GlobalExceptionHandlerImplementation(reactContext)

  companion object {
    const val NAME = GlobalExceptionHandlerImplementation.NAME
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun setHandlerForNativeException(
    options: ReadableMap,
    callback: Callback
  ) {
    globalExceptionHandler.setHandlerForNativeException(options, callback)
  }

  @ReactMethod
  override fun simulateNativeCrash(crashType: String) {
    globalExceptionHandler.simulateNativeCrash(crashType)
  }
}
