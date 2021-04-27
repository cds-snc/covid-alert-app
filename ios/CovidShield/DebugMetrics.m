//
//  DebugMetrics.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-27.
//

#import "DebugMetrics.h"

@implementation DebugMetrics

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(publishDebugMetric, stepNumber:(double)stepNumber message:(NSString *)message withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  resolve(nil);
}

@end
