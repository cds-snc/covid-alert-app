//
//  ExposureNotification.m
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-03.
//

#import "ExposureNotification.h"
#import <React/RCTConvert.h>



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

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(start, startWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (self.enManager) return;
  self.enManager = [ENManager new];

  [self.enManager activateWithCompletionHandler:^(NSError * _Nullable error) {
    if (error) {
      reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      [self.enManager setExposureNotificationEnabled:YES completionHandler:^(NSError * _Nullable error) {
        if (error) {
          reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
        } else {
          resolve(nil);
        }
      }];
    }
  }];
}

RCT_REMAP_METHOD(stop, stopWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [self.enManager setInvalidationHandler:^{
    resolve(nil);
  }];
  [self.enManager invalidate];
  self.enManager = nil;
}

RCT_REMAP_METHOD(getStatus, getStatusWithResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  switch (self.enManager.exposureNotificationStatus) {
    case ENStatusUnknown: resolve(@"unknown");
      break;
    case ENStatusActive: resolve(@"active");
      break;
    case ENStatusDisabled: resolve(@"disabled");
      break;
    case ENStatusBluetoothOff: resolve(@"bluetooth_off");
      break;
    case ENStatusRestricted: resolve(@"restricted");
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
      @"daysSinceLastExposure": @(summary.daysSinceLastExposure),
      @"matchedKeyCount": @(summary.matchedKeyCount),
      @"maximumRiskScore": @(summary.maximumRiskScore),
      @"_summaryIdx": idx
    });

  }];
}

RCT_REMAP_METHOD(getExposureInformation,getExposureInformationForSummary:(NSDictionary *)summaryDict withUserExplanation: (NSString *)userExplanation withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (summaryDict[@"_summaryIdx"] == nil) {
    reject(@"", @"Missing _summaryIdx", [NSError errorWithDomain:@"" code:0 userInfo:@{}]);
    return;
  }
  NSInteger summaryIdx = [summaryDict[@"_summaryIdx"] intValue];
  if (summaryIdx < 0 || summaryIdx >= self.reportedSummaries.count) {
    reject(@"", @"Invalid _summaryIdx", [NSError errorWithDomain:@"" code:0 userInfo:@{}]);
    return;
  }
  if (ENManager.authorizationStatus != ENAuthorizationStatusAuthorized) {
    reject(@"API_NOT_ENABLED", [NSString stringWithFormat:@"Exposure Notification not authorized: %ld", ENManager.authorizationStatus], nil);
    return;
  }
  ENExposureDetectionSummary *summary = self.reportedSummaries[summaryIdx];
  [self.enManager getExposureInfoFromSummary:summary
                             userExplanation:userExplanation
                           completionHandler:^(NSArray<ENExposureInfo *> * _Nullable exposures, NSError * _Nullable error) {
    if (error) {
       reject([NSString stringWithFormat:@"%ld", (long)error.code], error.localizedDescription ,error);
    } else {
      NSMutableArray *arr = [NSMutableArray new];
      for (ENExposureInfo *info in exposures) {
        [arr addObject:@{
          @"attenuationValue": @(info.attenuationValue),
          @"dateMillisSinceEpoch": @([info.date timeIntervalSince1970]),
          @"durationMinutes": @(info.duration),
          @"totalRiskScore": @(info.totalRiskScore),
          @"transmissionRiskLevel": @(info.transmissionRiskLevel)
        }];
      }
      resolve(arr);
    }

  }];
}
@end
