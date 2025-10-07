package com.globalexceptionhandler

import android.app.Activity
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.View
import android.widget.Button
import android.widget.TextView
import androidx.core.view.isVisible
import kotlin.system.exitProcess

class DefaultErrorScreen : Activity() {

  companion object {
    private const val TAG = "RN_ERROR_HANDLER"

    fun doRestart(context: Context?) {
      try {
        context?.let { c ->
          val pm = c.packageManager
          pm?.let {
            val startActivity = it.getLaunchIntentForPackage(c.packageName)
            startActivity?.let { intent ->
              intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
              val pendingIntentId = 654311
              val pendingIntent = PendingIntent.getActivity(
                c,
                pendingIntentId,
                intent,
                PendingIntent.FLAG_CANCEL_CURRENT or PendingIntent.FLAG_IMMUTABLE
              )
              val alarmManager = c.getSystemService(ALARM_SERVICE) as AlarmManager
              alarmManager.set(AlarmManager.RTC, System.currentTimeMillis() + 100, pendingIntent)
              System.exit(0)
            } ?: throw Exception("Was not able to restart application, startActivity null")
          } ?: throw Exception("Was not able to restart application, PackageManager null")
        } ?: throw Exception("Was not able to restart application, Context null")
      } catch (ex: Exception) {
        Log.e(TAG, "Was not able to restart application", ex)
      }
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
      doRestart(applicationContext)
    }

    quitButton.setOnClickListener {
      exitProcess(0)
    }
  }
}
