package app.covidshield;

import android.app.Application;
import android.content.Context;

import androidx.work.Configuration;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import org.jetbrains.annotations.NotNull;

import java.lang.reflect.InvocationTargetException;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import org.unimodules.adapters.react.ModuleRegistryAdapter;
import org.unimodules.adapters.react.ReactModuleRegistryProvider;
import org.unimodules.core.interfaces.SingletonModule;

import app.covidshield.generated.BasePackageList;
import android.util.Log;



public class MainApplication extends Application implements ReactApplication {
    private final ReactModuleRegistryProvider mModuleRegistryProvider = new ReactModuleRegistryProvider(new BasePackageList().getPackageList(), null);
    public static Application instance;

    private final ReactNativeHost mReactNativeHost =
        new ReactNativeHost(this) {
            @Override
            public boolean getUseDeveloperSupport() {
                return BuildConfig.DEBUG;
            }

            @Override
            protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
                packages.add(new CustomPackage());
                // Add unimodules
                List<ReactPackage> unimodules = Arrays.<ReactPackage>asList(
                        new ModuleRegistryAdapter(mModuleRegistryProvider)
                );
                packages.addAll(unimodules);
                return packages;
            }

            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        instance = this;
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }
}
