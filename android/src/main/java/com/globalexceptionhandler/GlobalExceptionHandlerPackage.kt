package com.globalexceptionhandler

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class GlobalExceptionHandlerPackage : BaseReactPackage() {
	override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
		return if (name == GlobalExceptionHandlerModule.NAME) {
			GlobalExceptionHandlerModule(reactContext)
		} else {
			null
		}
	}

	override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
		return ReactModuleInfoProvider {
			val moduleInfos: MutableMap<String, ReactModuleInfo> = HashMap()
			val isTurboModule: Boolean = BuildConfig.IS_NEW_ARCHITECTURE_ENABLED
			moduleInfos[GlobalExceptionHandlerModule.NAME] = ReactModuleInfo(
				GlobalExceptionHandlerModule.NAME,
				GlobalExceptionHandlerModule.NAME,
				canOverrideExistingModule = false,  // canOverrideExistingModule
				needsEagerInit = false,  // needsEagerInit
				hasConstants = false,  // hasConstants
				isCxxModule = false,  // isCxxModule
				isTurboModule = isTurboModule,
			)
			moduleInfos
		}
	}
}
