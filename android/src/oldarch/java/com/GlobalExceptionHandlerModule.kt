package com.globalexceptionhandler

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class GlobalExceptionHandlerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val globalExceptionHandler = GlobalExceptionHandlerImplementation(reactContext)

  companion object {
    const val NAME = GlobalExceptionHandlerImplementation.NAME
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  fun setHandlerForNativeException(
    options: ReadableMap,
    callback: Callback
  ) {
    globalExceptionHandler.setHandlerForNativeException(options, callback)
  }

  @ReactMethod
  fun simulateNativeCrash(crashType: String) {
    globalExceptionHandler.simulateNativeCrash(crashType)
  }

}
