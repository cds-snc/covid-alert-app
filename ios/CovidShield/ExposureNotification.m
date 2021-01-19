//
//  ExposureNotification.m
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-03.
//

#import "ExposureNotification.h"

#import "ENActivityHandling.h"

#import <React/RCTConvert.h>
#import <TSBackgroundFetch/TSBackgroundFetch.h>

@interface ExposureNotification ()
@property (nonatomic) NSMutableArray *reportedSummaries;
@end

@implementation ExposureNotification
@synthesize reportedSummaries;

- (instancetype)init {
  if (self =  [super init]) {
    self.reportedSummaries = NSMutableArray.new;
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup {
  return YES;
}

- (void)invalidate
{
  [self.enManager invalidate];
  self.enManager = nil;
}

+ (ExposureNotificationSupportType) exposureNotificationSupportType {
  if (@available(iOS 13.5, *)) {
    return ENSupportTypeVersion13dot5AndLater;
  } else if (NSClassFromString(@"ENManager") != nil) { // This check is specific to iOS 12.5
    return ENSupportTypeVersion12dot5;
  } else {
    return ENSupportTypeUnsupported;
  }
}

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(isExposureNotificationsFrameworkSupported, isExposureNotificationsFrameworkSupportedWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if ([ExposureNotification exposureNotificationSupportType] == ENSupportTypeUnsupported) {
    reject(@"API_NOT_AVAILABLE", @"Exposure Notifications Framework is not supported", nil);
  } else {
    resolve(nil);
  }
}

RCT_REMAP_METHOD(activate, activateWithCompletionHandler:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.enManager) {
    resolve(nil);
    return;
  };

  self.enManager = [ENManager new];
  
  if ([ExposureNotification exposureNotificationSupportType] == ENSupportTypeVersion12dot5) {
    [self.enManager setLaunchActivityHandler:^() {
      TSBackgroundFetch *fetchManager = [TSBackgroundFetch sharedInstance];
      [fetchManager performFetchWithCompletionHandler:^void(UIBackgroundFetchResult r) {}
                                     applicationState:UIApplicationStateBackground];
    }];
  }

  [self.enManager activateWithCompletionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      resolve(nil);
    }
  }];
}

RCT_REMAP_METHOD(start, startWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.enManager setExposureNotificationEnabled:YES completionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      resolve(nil);
    }
  }];
}

RCT_REMAP_METHOD(stop, stopWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.enManager setExposureNotificationEnabled:NO completionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      resolve(nil);
    }
  }];
}

RCT_REMAP_METHOD(getStatus, getStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  // TODO: return a more meaningful status for 'ENStatusPaused' when it's known how to pause the EN framework.

  // Checking the authorizationStatus will check the "Share Exposure Information" toggle in 13.7+
  if (ENManager.authorizationStatus != ENAuthorizationStatusAuthorized) {
    resolve (@"unauthorized");
    return;
  }
  switch (self.enManager.exposureNotificationStatus) {
    case ENStatusActive: resolve(@"active");
      break;
    case ENStatusDisabled: resolve(@"disabled");
      break;
    case ENStatusBluetoothOff: resolve(@"bluetooth_off");
      break;
    case ENStatusRestricted: resolve(@"restricted");
      break;
    case ENStatusPaused:
    case ENStatusUnknown:
    default:
      resolve(@"unknown");
      break;
  }
}

RCT_REMAP_METHOD(getTemporaryExposureKeyHistory, getTemporaryExposureKeyHistoryWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (ENManager.authorizationStatus != ENAuthorizationStatusAuthorized) {
    reject(@"API_NOT_ENABLED", [NSString stringWithFormat:@"Exposure Notification not authorized: %ld", ENManager.authorizationStatus], nil);
    return;
  }
  [self.enManager getDiagnosisKeysWithCompletionHandler:^(NSArray<ENTemporaryExposureKey *> * _Nullable keys, NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      NSMutableArray *serialziedKeys = [NSMutableArray new];
      for (ENTemporaryExposureKey *key in keys) {
        [serialziedKeys addObject:@{
          @"keyData": [key.keyData base64EncodedStringWithOptions:0],
          @"rollingStartIntervalNumber": @(key.rollingStartNumber),
          @"rollingPeriod": @(key.rollingPeriod),
          @"transmissionRiskLevel": @(key.transmissionRiskLevel)
        }];
      }
      resolve(serialziedKeys);
    }
  }];
}

NSArray *map(NSArray* array, id (^transform)(id value)) {
  NSMutableArray *acc = [NSMutableArray new];
  for (id value in array) {
    [acc addObject:transform(value)];
  }
  return acc.copy;
}

NSArray *mapIntValues(NSArray *arr) {
  return map(arr, ^NSNumber *(NSNumber *value) {
    return @([value intValue]);
  });
}

NSDictionary *getInfectiousness() {

  NSDictionary<NSNumber *, NSNumber *> *newDict = @{
    @-14: @1,
    @-13: @1,
    @-12: @1,
    @-11: @1,
    @-10: @1,
    @-9: @1,
    @-8: @1,
    @-7: @1,
    @-6: @1,
    @-5: @1,
    @-4: @1,
    @-3: @1,
    @-2: @1,
    @-1: @1,
    @0: @1,
    @1: @1,
    @2: @1,
    @3: @1,
    @4: @1,
    @5: @1,
    @6: @1,
    @7: @1,
    @8: @1,
    @9: @1,
    @10: @1,
    @11: @1,
    @12: @1,
    @13: @1,
    @14: @1,
  };
  return newDict.copy;
}

RCT_REMAP_METHOD(detectExposure, detectExposureWithConfiguration:(NSDictionary *)configDict diagnosisKeysURLs:(NSArray*)urls withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (ENManager.authorizationStatus != ENAuthorizationStatusAuthorized) {
    reject(@"API_NOT_ENABLED", [NSString stringWithFormat:@"Exposure Notification not authorized: %ld", ENManager.authorizationStatus], nil);
    return;
  }

  ENExposureConfiguration *configuration = [ENExposureConfiguration new];

  if (configDict[@"metadata"]) {
    configuration.metadata = configDict[@"metadata"];
  }

  if (configDict[@"minimumRiskScore"]) {
    configuration.minimumRiskScore = [configDict[@"minimumRiskScore"] intValue];
  }

  if (configDict[@"attenuationDurationThresholds"]) {
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.6) {
      configuration.attenuationDurationThresholds = mapIntValues(configDict[@"attenuationDurationThresholds"]);
    } else {
      configuration.metadata = @{@"attenuationDurationThresholds": mapIntValues(configDict[@"attenuationDurationThresholds"])};
    }
  }

  if (configDict[@"attenuationLevelValues"]) {
    configuration.attenuationLevelValues = mapIntValues(configDict[@"attenuationLevelValues"]);
  }

  if (configDict[@"attenuationWeight"]) {
    configuration.attenuationWeight = [configDict[@"attenuationWeight"] doubleValue];
  }
  if (configDict[@"daysSinceLastExposureLevelValues"]) {
    configuration.daysSinceLastExposureLevelValues = mapIntValues(configDict[@"daysSinceLastExposureLevelValues"]);
  }
  if (configDict[@"daysSinceLastExposureWeight"]) {
    configuration.daysSinceLastExposureWeight = [configDict[@"daysSinceLastExposureWeight"] doubleValue];
  }
  if (configDict[@"durationLevelValues"]) {
    configuration.durationLevelValues = mapIntValues(configDict[@"durationLevelValues"]);
  }
  if (configDict[@"durationWeight"]) {
    configuration.durationWeight = [configDict[@"durationWeight"] doubleValue];
  }
  if (configDict[@"transmissionRiskLevelValues"]) {
    configuration.transmissionRiskLevelValues = mapIntValues(configDict[@"transmissionRiskLevelValues"]);
  }
  if (configDict[@"transmissionRiskWeight"]) {
    configuration.transmissionRiskWeight = [configDict[@"transmissionRiskWeight"] doubleValue];
  }



  NSMutableArray *arr = [NSMutableArray new];
  for (NSString *urlStr in urls) {
    [arr addObject: [NSURL fileURLWithPath:urlStr]];
  }

  [self.enManager detectExposuresWithConfiguration:configuration
                                  diagnosisKeyURLs:arr
                                 completionHandler:^(ENExposureDetectionSummary * _Nullable summary, NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
      return;
    }
    NSNumber *idx = @(self.reportedSummaries.count);
    [self.reportedSummaries addObject:summary];
    resolve(@{
      @"attenuationDurations": summary.attenuationDurations,
      @"daysSinceLastExposure": @(summary.daysSinceLastExposure),
      @"matchedKeyCount": @(summary.matchedKeyCount),
      @"maximumRiskScore": @(summary.maximumRiskScore),
      @"_summaryIdx": idx
    });

  }];
}

RCT_REMAP_METHOD(detectExposureV2, detectExposureWithConfigurationV2:(NSDictionary *)configDict diagnosisKeysURLs:(NSArray*)urls withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  if (ENManager.authorizationStatus != ENAuthorizationStatusAuthorized) {
    reject(@"API_NOT_ENABLED", [NSString stringWithFormat:@"Exposure Notification not authorized: %ld", ENManager.authorizationStatus], nil);
    return;
  }

  ENExposureConfiguration *configuration = [ENExposureConfiguration new];

  if (configDict[@"metadata"]) {
    configuration.metadata = configDict[@"metadata"];
  }

  if (configDict[@"minimumRiskScore"]) {
    configuration.minimumRiskScore = [configDict[@"minimumRiskScore"] intValue];
  }

  if (configDict[@"attenuationDurationThresholds"]) {
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 13.6) {
      configuration.attenuationDurationThresholds = mapIntValues(configDict[@"attenuationDurationThresholds"]);
    } else {
      configuration.metadata = @{@"attenuationDurationThresholds": mapIntValues(configDict[@"attenuationDurationThresholds"])};
    }
  }

  if (configDict[@"attenuationLevelValues"]) {
    configuration.attenuationLevelValues = mapIntValues(configDict[@"attenuationLevelValues"]);
  }

  if (configDict[@"attenuationWeight"]) {
    configuration.attenuationWeight = [configDict[@"attenuationWeight"] doubleValue];
  }
  if (configDict[@"daysSinceLastExposureLevelValues"]) {
    configuration.daysSinceLastExposureLevelValues = mapIntValues(configDict[@"daysSinceLastExposureLevelValues"]);
  }
  if (configDict[@"daysSinceLastExposureWeight"]) {
    configuration.daysSinceLastExposureWeight = [configDict[@"daysSinceLastExposureWeight"] doubleValue];
  }
  if (configDict[@"durationLevelValues"]) {
    configuration.durationLevelValues = mapIntValues(configDict[@"durationLevelValues"]);
  }
  if (configDict[@"durationWeight"]) {
    configuration.durationWeight = [configDict[@"durationWeight"] doubleValue];
  }
  if (configDict[@"transmissionRiskLevelValues"]) {
    configuration.transmissionRiskLevelValues = mapIntValues(configDict[@"transmissionRiskLevelValues"]);
  }
  if (configDict[@"transmissionRiskWeight"]) {
    configuration.transmissionRiskWeight = [configDict[@"transmissionRiskWeight"] doubleValue];
  }

  if (@available(iOS 13.7, *)) {
    configuration.immediateDurationWeight = 100;
    configuration.nearDurationWeight = 100;
    configuration.mediumDurationWeight = 100;
    configuration.otherDurationWeight = 100;
    configuration.infectiousnessStandardWeight = 100;
    configuration.infectiousnessHighWeight = 100;
    configuration.reportTypeConfirmedTestWeight = 100;
    configuration.reportTypeConfirmedClinicalDiagnosisWeight = 100;
    configuration.reportTypeSelfReportedWeight = 100;
    configuration.reportTypeRecursiveWeight = 100;
    configuration.infectiousnessForDaysSinceOnsetOfSymptoms = getInfectiousness();
  }

  NSMutableArray *arr = [NSMutableArray new];
  for (NSString *urlStr in urls) {
    [arr addObject: [NSURL fileURLWithPath:urlStr]];
  }

  [self.enManager detectExposuresWithConfiguration:configuration
                                  diagnosisKeyURLs:arr
                                 completionHandler:^(ENExposureDetectionSummary * _Nullable summary, NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
      return;
    }
    NSNumber *idx = @(self.reportedSummaries.count);
    [self.reportedSummaries addObject:summary];
    
    if (@available(iOS 13.7, *)) {
      [self.enManager getExposureWindowsFromSummary:(ENExposureDetectionSummary *)summary completionHandler:^(NSArray<ENExposureWindow *> * _Nullable exposureWindows, NSError * _Nullable error) {
        if (error) {
          reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
        } else {
          NSMutableArray<NSDictionary *> *exWindow = [NSMutableArray new];
          for (ENExposureWindow *obj in exposureWindows) {
            NSMutableArray<NSDictionary *> *scanInstances = [NSMutableArray new];
            for (ENScanInstance *obj2 in obj.scanInstances) {
              [scanInstances addObject:@{
                @"minAttenuation": @(obj2.minimumAttenuation),
                @"typicalAttenuation": @(obj2.typicalAttenuation),
                @"secondsSinceLastScan": @(obj2.secondsSinceLastScan),
              }];
            }
            [exWindow addObject:@{
              @"infectiousness": @(obj.infectiousness),
              @"day": @(1000 * obj.date.timeIntervalSince1970),
              @"reportType": @(obj.diagnosisReportType),
              @"calibrationConfidence": @(obj.calibrationConfidence),
              @"scanInstances": scanInstances
            }];
          }
          resolve(exWindow);
        }
      }];
    } else {
      // Fallback on earlier versions
      reject(@"API_NOT_AVAILABLE", @"API Not Available. Requires iOS 13.7+", nil);
    }
    
  }];
  
}
@end
