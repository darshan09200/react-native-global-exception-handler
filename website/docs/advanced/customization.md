---
id: customization
sidebar_position: 10
title: Customization
description: How to customize native error screens and behavior on iOS and Android, including custom activities, handlers, and best practices.
keywords:
    - customization
    - native
    - error screen
    - android
    - ios
---

Learn how to customize the native error screens and behavior on both iOS and Android platforms.

## Custom Native Error Screen (Android)

Android provides multiple ways to customize the error screen that appears when a native exception occurs.

### Method 1: Custom Exception Handler Interface

Create a custom handler by implementing the `NativeExceptionHandlerIfc` interface:

```kotlin
// In your MainApplication.kt
import com.globalexceptionhandler.GlobalExceptionHandlerModule
import com.globalexceptionhandler.NativeExceptionHandlerIfc

class MainApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()
        
        // Set custom native exception handler
        GlobalExceptionHandlerModule.setNativeExceptionHandler(
            object : NativeExceptionHandlerIfc {
                override fun handleNativeException(
                    thread: Thread,
                    throwable: Throwable,
                    originalHandler: Thread.UncaughtExceptionHandler?
                ) {
                    // Custom handling logic
                    // - Send to analytics
                    // - Show custom UI
                    // - Clean up resources
                    
                    // Log the error
                    Log.e("CustomHandler", "Native exception occurred", throwable)
                    
                    // Optionally call original handler
                    originalHandler?.uncaughtException(thread, throwable)
                }
            }
        )
    }
}
```

### Method 2: Custom Error Activity

Replace the default error screen with your own Activity:

**Step 1:** Create your custom error activity:

```kotlin
// CustomErrorActivity.kt
import android.app.Activity
import android.os.Bundle
import android.widget.Button
import android.widget.TextView

class CustomErrorActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_custom_error)
        
        // Get error message from intent
        val errorMessage = intent.getStringExtra("error")
        
        findViewById<TextView>(R.id.errorText).text = errorMessage
        
        findViewById<Button>(R.id.restartButton).setOnClickListener {
            // Restart app logic
            val intent = packageManager.getLaunchIntentForPackage(packageName)
            intent?.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
            startActivity(intent)
            finish()
        }
    }
}
```

**Step 2:** Create layout file `res/layout/activity_custom_error.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp">
    
    <TextView
        android:id="@+id/errorText"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:textSize="16sp"
        android:layout_marginBottom="24dp"/>
    
    <Button
        android:id="@+id/restartButton"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Restart App"/>
</LinearLayout>
```

**Step 3:** Register the custom activity in `MainApplication.kt`:

```kotlin
import com.globalexceptionhandler.GlobalExceptionHandlerModule

class MainApplication : Application(), ReactApplication {
    override fun onCreate() {
        super.onCreate()
        
        GlobalExceptionHandlerModule.replaceErrorScreenActivityClass(
            CustomErrorActivity::class.java
        )
    }
}
```

**Step 4:** Add activity to `AndroidManifest.xml`:

```xml
<activity
    android:name=".CustomErrorActivity"
    android:exported="false"
    android:theme="@style/Theme.AppCompat" />
```

## Custom Native Error Screen (iOS)

For iOS, customize the error handler in your `AppDelegate.m` or `AppDelegate.mm`:

### Basic Custom Alert

```objc
#import "GlobalExceptionHandler.h"

- (BOOL)application:(UIApplication *)application 
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    // Your existing setup...
    
    // Custom native exception handler
    [GlobalExceptionHandler replaceNativeExceptionHandlerBlock:^(
        NSException *exception, 
        NSString *readeableException
    ) {
        // Create custom alert
        UIAlertController* alert = [UIAlertController
            alertControllerWithTitle:@"App Error"
            message:[NSString stringWithFormat:
                @"An unexpected error occurred.\n\n%@", 
                readeableException
            ]
            preferredStyle:UIAlertControllerStyleAlert];
        
        // Add action
        UIAlertAction* closeAction = [UIAlertAction
            actionWithTitle:@"Close App"
            style:UIAlertActionStyleDestructive
            handler:^(UIAlertAction * action) {
                [GlobalExceptionHandler releaseExceptionHold];
            }];
        
        [alert addAction:closeAction];
        
        // Present the alert
        [self.window.rootViewController 
            presentViewController:alert 
            animated:YES 
            completion:nil];
        
        // Auto-close after 4 seconds
        [NSTimer scheduledTimerWithTimeInterval:4.0
            target:[GlobalExceptionHandler class]
            selector:@selector(releaseExceptionHold)
            userInfo:nil
            repeats:NO];
    }];
    
    return YES;
}
```

### Custom Error View Controller

```objc
// ErrorViewController.h
@interface ErrorViewController : UIViewController
@property (nonatomic, strong) NSString *errorMessage;
@end

// ErrorViewController.m
@implementation ErrorViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    self.view.backgroundColor = [UIColor whiteColor];
    
    // Add UI elements
    UILabel *titleLabel = [[UILabel alloc] initWithFrame:
        CGRectMake(20, 100, self.view.bounds.size.width - 40, 40)];
    titleLabel.text = @"An Error Occurred";
    titleLabel.textAlignment = NSTextAlignmentCenter;
    titleLabel.font = [UIFont boldSystemFontOfSize:24];
    [self.view addSubview:titleLabel];
    
    UILabel *messageLabel = [[UILabel alloc] initWithFrame:
        CGRectMake(20, 160, self.view.bounds.size.width - 40, 200)];
    messageLabel.text = self.errorMessage;
    messageLabel.numberOfLines = 0;
    messageLabel.textAlignment = NSTextAlignmentCenter;
    [self.view addSubview:messageLabel];
    
    UIButton *closeButton = [UIButton buttonWithType:UIButtonTypeSystem];
    closeButton.frame = CGRectMake(
        (self.view.bounds.size.width - 200) / 2, 
        400, 
        200, 
        44
    );
    [closeButton setTitle:@"Close App" forState:UIControlStateNormal];
    [closeButton addTarget:self 
        action:@selector(closeApp) 
        forControlEvents:UIControlEventTouchUpInside];
    [self.view addSubview:closeButton];
}

- (void)closeApp {
    [GlobalExceptionHandler releaseExceptionHold];
}

@end

// In AppDelegate.m
[GlobalExceptionHandler replaceNativeExceptionHandlerBlock:^(
    NSException *exception, 
    NSString *readeableException
) {
    ErrorViewController *errorVC = [[ErrorViewController alloc] init];
    errorVC.errorMessage = readeableException;
    
    [self.window.rootViewController 
        presentViewController:errorVC 
        animated:YES 
        completion:nil];
}];
```

## Platform Considerations

### iOS Limitations

- Cannot restart app programmatically after native crash
- UI becomes unstable during native exceptions
- Must call `releaseExceptionHold()` to close the app
- Best practice: Show informative message and let user restart

### Android Capabilities

- Can restart app after native crash
- More stable during native exceptions
- Built-in restart functionality available
- More customization options

## Best Practices

### Keep It Simple

Error handlers run in an unstable state. Keep your custom UI simple:

- Avoid complex animations
- Minimize network calls
- Use basic UI components
- Provide clear messaging

### Test Thoroughly

Test your custom error screens with different crash scenarios:

```js
import { simulateNativeCrash, CrashType } from 'react-native-global-exception-handler';

// Test different crash types
simulateNativeCrash(CrashType.array_bounds);
simulateNativeCrash(CrashType.memory_access);
```

### Provide User Actions

Always give users a way forward:

- "Restart App" button (Android)
- "Close App" button (iOS)
- Contact support option
- Clear error description

## Example: Branded Error Screen

Create a consistent error experience that matches your app's branding:

```kotlin
// Android branded error screen
class BrandedErrorActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Use your app's theme and styling
        setTheme(R.style.AppTheme)
        
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(48, 48, 48, 48)
            setBackgroundColor(getColor(R.color.brandBackground))
        }
        
        // Brand logo
        ImageView(this).apply {
            setImageResource(R.drawable.ic_app_logo)
            layoutParams = LinearLayout.LayoutParams(200, 200)
            layout.addView(this)
        }
        
        // Error message
        TextView(this).apply {
            text = "Something went wrong"
            textSize = 20f
            setTextColor(getColor(R.color.brandPrimary))
            setPadding(0, 32, 0, 16)
            layout.addView(this)
        }
        
        // Restart button
        Button(this).apply {
            text = "Restart App"
            setOnClickListener { restartApp() }
            layout.addView(this)
        }
        
        setContentView(layout)
    }
    
    private fun restartApp() {
        val intent = packageManager.getLaunchIntentForPackage(packageName)
        intent?.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        startActivity(intent)
        finish()
    }
}
```
