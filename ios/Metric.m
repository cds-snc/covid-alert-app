//
//  Metric.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import "Metric.h"

@interface Metric ()

@property (strong, nonatomic) NSNumber *timestamp;
@property (strong, nonatomic) NSString *identifier;
@property (strong, nonatomic) NSString *region;

@end

@implementation Metric

- (instancetype)initWithTimestamp:(NSNumber *)timestamp identifier:(NSString *)identifier region:(NSString *)region
{
  self = [super init];
  if (self) {
    self.timestamp = timestamp;
    self.identifier = identifier;
    self.region = region;
  }
  return self;
}

@end
