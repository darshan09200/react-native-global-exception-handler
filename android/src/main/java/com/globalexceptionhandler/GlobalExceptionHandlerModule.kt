package com.globalexceptionhandler

import android.app.Activity
import android.content.Intent
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = GlobalExceptionHandlerModule.NAME)
class GlobalExceptionHandlerModule(reactContext: ReactApplicationContext) :
  NativeGlobalExceptionHandlerSpec(reactContext) {

  private var callbackHolder: Callback? = null
  private var originalHandler: Thread.UncaughtExceptionHandler? = null

  companion object {
    const val NAME = "GlobalExceptionHandler"
    private var errorIntentTargetClass: Class<*> = DefaultErrorScreen::class.java
    private var nativeExceptionHandler: NativeExceptionHandlerIfc? = null

    @JvmStatic
    fun replaceErrorScreenActivityClass(errorScreenActivityClass: Class<*>) {
      errorIntentTargetClass = errorScreenActivityClass
    }

    @JvmStatic
    fun setNativeExceptionHandler(handler: NativeExceptionHandlerIfc) {
      nativeExceptionHandler = handler
    }
  }

  override fun getName(): String {
    return NAME
  }

  @ReactMethod
  override fun setHandlerForNativeException(
    executeOriginalUncaughtExceptionHandler: Boolean,
    callback: Callback
  ) {
    setHandlerForNativeException(executeOriginalUncaughtExceptionHandler, true, callback)
  }

  @ReactMethod
  fun setHandlerForNativeException(
    executeOriginalUncaughtExceptionHandler: Boolean,
    forceToQuit: Boolean,
    callback: Callback
  ) {
    callbackHolder = callback
    originalHandler = Thread.getDefaultUncaughtExceptionHandler()

    Thread.setDefaultUncaughtExceptionHandler { thread, throwable ->
      val stackTraceString = Log.getStackTraceString(throwable)
      callbackHolder?.invoke(stackTraceString)

      if (nativeExceptionHandler != null) {
        nativeExceptionHandler!!.handleNativeException(thread, throwable, originalHandler)
      } else {
        val activity = getCurrentActivity()
        if (activity != null) {
          val intent = Intent().apply {
            setClass(activity, errorIntentTargetClass)
            putExtra("stack_trace_string", stackTraceString)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
          }

          activity.startActivity(intent)
          activity.finish()
        }

        if (executeOriginalUncaughtExceptionHandler && originalHandler != null) {
          originalHandler!!.uncaughtException(thread, throwable)
        }

        if (forceToQuit) {
          System.exit(0)
        }
      }
    }
  }

  @ReactMethod
  override fun simulateNativeCrash(crashType: String) {
    // Schedule crash on next loop iteration to avoid TurboModule context issues
    android.os.Handler(android.os.Looper.getMainLooper()).post {
      performCrash(crashType)
    }
  }

  private fun performCrash(crashType: String) {
    Log.d(NAME, "SIMULATING CRASH TYPE: $crashType")

    when (crashType) {
      "nsexception", "" -> {
        throw RuntimeException("Simulated RuntimeException for testing")
      }

      "array_bounds" -> {
        val testArray = arrayOf("item1", "item2")
        val item = testArray[10] // Out of bounds
        Log.d(NAME, "This should never be reached: $item")
      }

      "invalid_argument" -> {
        throw IllegalArgumentException("Simulated invalid argument exception")
      }

      "memory_access" -> {
        // Simulate memory access violation using native crash
        System.loadLibrary("nonexistent") // This will cause UnsatisfiedLinkError
      }

      "abort" -> {
        System.exit(-1)
      }

      "stack_overflow" -> {
        performCrash("stack_overflow") // Infinite recursion
      }

      "internal_inconsistency" -> {
        throw IllegalStateException("Simulated internal inconsistency")
      }

      "malloc_error" -> {
        throw OutOfMemoryError("Simulated memory allocation error")
      }

      "sigill", "sigbus" -> {
        // These are more specific to native code, simulate with RuntimeException
        throw RuntimeException("Simulated signal $crashType for testing")
      }

      else -> {
        throw RuntimeException("Unknown crash type: $crashType. Using default exception.")
      }
    }
  }
}
