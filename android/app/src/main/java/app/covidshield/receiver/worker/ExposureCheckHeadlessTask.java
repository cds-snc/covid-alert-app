package app.covidshield.receiver.worker;

import android.content.Context;
import android.os.Handler;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.jstasks.HeadlessJsTaskContext;
import com.facebook.react.jstasks.HeadlessJsTaskEventListener;
import com.facebook.react.common.LifecycleState;

import app.covidshield.services.metrics.MetricsService;

/**
 * Created by chris on 2018-01-17 for https://github.com/cds-snc/react-native-background-fetch
 *
 * Copied and modified into COVID Alert to allow a unique taskId passed into HeadlessJsTaskConfig().
 */

public class ExposureCheckHeadlessTask implements HeadlessJsTaskEventListener {
    private static Handler mHandler = new Handler();
    private ReactNativeHost mReactNativeHost;
    private HeadlessJsTaskContext mActiveTaskContext;

    public ExposureCheckHeadlessTask(Context context, String taskId) {
        MetricsService.publishDebugMetric(3.3, context);
        try {
            ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();
        } catch (AssertionError | ClassCastException e) {
            MetricsService.publishDebugMetric(100, context, e.getMessage());
            // Log.e(BackgroundFetch.TAG, "Failed to fetch ReactApplication.  Task ignored.");
            return;  // <-- Do nothing.  Just return
        }
        WritableMap clientEvent = new WritableNativeMap();
        clientEvent.putString("taskId", taskId);
        HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(taskId, clientEvent, 30000);
        MetricsService.publishDebugMetric(3.4, context);
        startTask(config);
    }

    public void finish() {
        if (mActiveTaskContext != null) {
            mActiveTaskContext.removeTaskEventListener(this);
        }
    }

    @Override
    public void onHeadlessJsTaskStart(int taskId) {
        // Log.d(BackgroundFetch.TAG, "onHeadlessJsTaskStart: " + taskId);
    }

    @Override
    public void onHeadlessJsTaskFinish(int taskId) {
        // Log.d(BackgroundFetch.TAG, "onHeadlessJsTaskFinish: " + taskId);
        mActiveTaskContext.removeTaskEventListener(this);
    }

    /**
     * Start a task. This method handles starting a new React instance if required.
     *
     * Has to be called on the UI thread.
     *
     * @param taskConfig describes what task to start and the parameters to pass to it
     */
    protected void startTask(final HeadlessJsTaskConfig taskConfig) {
        UiThreadUtil.assertOnUiThread();
        final ReactInstanceManager reactInstanceManager = mReactNativeHost.getReactInstanceManager();
        ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
        if (reactContext == null) {
            reactInstanceManager.addReactInstanceEventListener(new ReactInstanceManager.ReactInstanceEventListener() {
                @Override
                public void onReactContextInitialized(final ReactContext reactContext) {
                    // Hack to fix unknown problem executing asynchronous BackgroundTask when ReactContext is created *first time*.  Fixed by adding short delay before #invokeStartTask
                    MetricsService.publishDebugMetric(3.5, reactContext);
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            MetricsService.publishDebugMetric(3.6, reactContext);
                            invokeStartTask(reactContext, taskConfig);
                        }
                    }, 500);
                    reactInstanceManager.removeReactInstanceEventListener(this);
                }
            });
            if (!reactInstanceManager.hasStartedCreatingInitialContext()) {
                reactInstanceManager.createReactContextInBackground();
            }
        } else {
            MetricsService.publishDebugMetric(3.8, reactContext);
            invokeStartTask(reactContext, taskConfig);
        }
    }

    private void invokeStartTask(ReactContext reactContext, final HeadlessJsTaskConfig taskConfig) {
        if (reactContext.getLifecycleState() == LifecycleState.RESUMED) {
            MetricsService.publishDebugMetric(3.9, reactContext);
            return;
        }
        final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
        headlessJsTaskContext.addTaskEventListener(this);
        mActiveTaskContext = headlessJsTaskContext;
        try {
            MetricsService.publishDebugMetric(3.10, reactContext);
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    MetricsService.publishDebugMetric(3.11, reactContext);
                    try {
                        int taskId = headlessJsTaskContext.startTask(taskConfig);
                    } catch (IllegalStateException exception) {
                        MetricsService.publishDebugMetric(104, reactContext);
                        // Log.e(BackgroundFetch.TAG, "Headless task attempted to run in the foreground.  Task ignored.");
                        return;  // <-- Do nothing.  Just return
                    }
                }
            });
        } catch (IllegalStateException exception) {
            MetricsService.publishDebugMetric(105, reactContext, exception.getMessage());
            // Log.e(BackgroundFetch.TAG, "Headless task attempted to run in the foreground.  Task ignored.");
            return;  // <-- Do nothing.  Just return
        }

    }
}
