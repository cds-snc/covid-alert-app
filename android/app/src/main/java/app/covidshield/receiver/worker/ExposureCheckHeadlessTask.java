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

import app.covidshield.services.metrics.FilteredMetricsService;
import app.covidshield.services.metrics.JavaFilteredMetricsService;

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
        FilteredMetricsService filteredMetricsService = FilteredMetricsService.Companion.getInstance(context);
        JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.3);
        try {
            ReactApplication reactApplication = ((ReactApplication) context.getApplicationContext());
            mReactNativeHost = reactApplication.getReactNativeHost();
        } catch (AssertionError | ClassCastException e) {
            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 100, e.getMessage());
            // Log.e(BackgroundFetch.TAG, "Failed to fetch ReactApplication.  Task ignored.");
            return;  // <-- Do nothing.  Just return
        }
        WritableMap clientEvent = new WritableNativeMap();
        clientEvent.putString("taskId", taskId);
        HeadlessJsTaskConfig config = new HeadlessJsTaskConfig(taskId, clientEvent, 30000);
        JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.4);
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
                    FilteredMetricsService filteredMetricsService = FilteredMetricsService.Companion.getInstance(reactContext);
                    // Hack to fix unknown problem executing asynchronous BackgroundTask when ReactContext is created *first time*.  Fixed by adding short delay before #invokeStartTask
                    JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.5);
                    mHandler.postDelayed(new Runnable() {
                        @Override
                        public void run() {
                            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.6);
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
            FilteredMetricsService filteredMetricsService = FilteredMetricsService.Companion.getInstance(reactContext);
            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.8);
            invokeStartTask(reactContext, taskConfig);
        }
    }

    private void invokeStartTask(ReactContext reactContext, final HeadlessJsTaskConfig taskConfig) {

        FilteredMetricsService filteredMetricsService = FilteredMetricsService.Companion.getInstance(reactContext);

        try {
            if (reactContext.getLifecycleState() == LifecycleState.RESUMED) {
                JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.9);
                return;
            }
        } catch (Exception exception) {
            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 109, exception.getMessage());
            return;
        }

        try {
            final HeadlessJsTaskContext headlessJsTaskContext = HeadlessJsTaskContext.getInstance(reactContext);
            headlessJsTaskContext.addTaskEventListener(this);
            mActiveTaskContext = headlessJsTaskContext;

            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.10);
            UiThreadUtil.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 3.11);
                    try {
                        int taskId = headlessJsTaskContext.startTask(taskConfig);
                    } catch (Exception exception) {
                        JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 104, exception.getMessage());
                        return;  // <-- Do nothing.  Just return
                    }
                }
            });
        } catch (Exception exception) {
            JavaFilteredMetricsService.addDebugMetric(filteredMetricsService, 105, exception.getMessage());
            return;  // <-- Do nothing.  Just return
        }

    }
}
