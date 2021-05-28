//
//  DebugMetrics.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-27.
//

#import "DebugMetrics.h"
#import "MetricsService.h"

@implementation DebugMetrics

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(publishDebugMetric, stepNumber:(double)stepNumber message:(NSString *)message withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  if (stepNumber == 8.0) {
    [[MetricsService sharedInstance] publishMetric:ScheduledCheckSuccessfulToday bridge:_bridge];
  }
  
  resolve(nil);
}

RCT_REMAP_METHOD(publishNativeActiveUserMetric, withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  [[MetricsService sharedInstance] publishMetric:ActiveUser bridge:_bridge];
  
  resolve(nil);
}

@end
