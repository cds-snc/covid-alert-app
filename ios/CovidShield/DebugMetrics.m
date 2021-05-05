//
//  DebugMetrics.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-27.
//

#import "DebugMetrics.h"
#import "MetricsService.h"

@implementation DebugMetrics

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(publishDebugMetric, stepNumber:(double)stepNumber message:(NSString *)message withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (stepNumber == 8.0) {
    [[MetricsService sharedInstance] publishScheduledCheckMetricWithType:End];
  }
  
  resolve(nil);
}

@end
