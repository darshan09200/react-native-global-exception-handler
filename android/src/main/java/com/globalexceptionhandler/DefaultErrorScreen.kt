package com.globalexceptionhandler

import android.app.Activity
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.WindowInsetsController
import android.view.WindowManager
import android.widget.Button
import android.widget.TextView
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.isVisible
import kotlin.system.exitProcess

class DefaultErrorScreen : Activity() {

  companion object {
    private const val TAG = "RN_ERROR_HANDLER"

    fun doRestart(context: Context) {
      val app = context.applicationContext

      // Build the launcher intent for the *main* process
      val launch = app.packageManager.getLaunchIntentForPackage(app.packageName)?.apply {
        addFlags(
          Intent.FLAG_ACTIVITY_NEW_TASK or
            Intent.FLAG_ACTIVITY_CLEAR_TASK or
            Intent.FLAG_ACTIVITY_NO_ANIMATION
        )
      } ?: run {
        Log.e(TAG, "No launch intent for package")
        return
      }

      app.startActivity(launch)

      // IMPORTANT: kill the :crash process right away so it can’t interfere
      (context as? Activity)?.finishAndRemoveTask()
      android.os.Process.killProcess(android.os.Process.myPid())
      exitProcess(0)
    }
  }

  private lateinit var quitButton: Button
  private lateinit var relaunchButton: Button
  private lateinit var showDetailsButton: Button
  private lateinit var stackTraceView: TextView

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    var stackTraceString = "StackTrace unavailable"
    try {
      stackTraceString = intent.extras?.getString("stack_trace_string") ?: stackTraceString
    } catch (e: Exception) {
      Log.e(TAG, "Was not able to get StackTrace: ${e.message}")
    }

    setContentView(R.layout.default_error_screen)

    // Handle system UI and notch/cutout AFTER setContentView
    setupSystemUI()

    // Apply window insets to the root view
    val rootView = findViewById<View>(android.R.id.content)
    ViewCompat.setOnApplyWindowInsetsListener(rootView) { view, insets ->
      val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
      view.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
      insets
    }

    quitButton = findViewById(R.id.eh_quit_button)
    relaunchButton = findViewById(R.id.eh_restart_button)
    showDetailsButton = findViewById(R.id.eh_show_details_button)
    stackTraceView = findViewById(R.id.eh_stack_trace_text_view)

    stackTraceView.text = stackTraceString

    showDetailsButton.setOnClickListener {
      if (stackTraceView.isVisible) {
        stackTraceView.visibility = View.GONE
        showDetailsButton.text = getString(R.string.show_details)
      } else {
        stackTraceView.visibility = View.VISIBLE
        showDetailsButton.text = getString(R.string.hide_details)
      }
    }

    relaunchButton.setOnClickListener {
      // Use the more reliable makeRestartActivityTask approach
      Log.d(TAG, "Restart button clicked, attempting restart...")
      doRestart(this)
    }

    quitButton.setOnClickListener {
      exitProcess(0)
    }
  }

  private fun setupSystemUI() {
    try {
      // Handle edge-to-edge display to respect safe areas
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        window.setDecorFitsSystemWindows(false)
        // Set status bar content to dark (for light background)
        window.insetsController?.setSystemBarsAppearance(
          WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS,
          WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS
        )
      } else {
        @Suppress("DEPRECATION")
        window.decorView.systemUiVisibility = (
          View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            or View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR  // Dark icons on light status bar
          )
      }

      // Handle notch/cutout for API 28+ - allow content to extend into cutout areas
      // but our WindowInsetsListener will add proper padding
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        window.attributes.layoutInDisplayCutoutMode =
          WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
      }
    } catch (e: Exception) {
      Log.e(TAG, "Failed to setup system UI: ${e.message}")
      // Fallback: just ensure basic edge-to-edge support
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
          window.setDecorFitsSystemWindows(false)
        }
      } catch (fallbackException: Exception) {
        Log.e(TAG, "Fallback system UI setup also failed: ${fallbackException.message}")
      }
    }
  }
}
