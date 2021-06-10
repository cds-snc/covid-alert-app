//
//  MetricsJsonSerializer.m
//  CovidShield
//
//  Created by Clement Janin on 2021-04-28.
//

#import "MetricsJsonSerializer.h"

@interface MetricsJsonSerializer ()

@property (strong, nonatomic) NSString *appVersion;
@property (strong, nonatomic) NSString *osVersion;

@end

@implementation MetricsJsonSerializer

- (instancetype)initWithAppVersion:(NSString *)appVersion osVersion:(NSString *)osVersion
{
  self = [super init];
  if (self) {
    self.appVersion = appVersion;
    self.osVersion = osVersion;
  }
  return self;
}

- (NSData *)serializeToJsonWithTimestamp:(NSNumber *)timestamp metric:(Metric *)metric
{
  NSDictionary *payloadJsonStructure = @{
    @"identifier": metric.identifier,
    @"region": metric.region,
    @"timestamp": metric.timestamp,
    @"debug": @"clement"
  };
  
  NSDictionary *mainJsonStructure = @{
    @"metricstimestamp": timestamp,
    @"appversion": self.appVersion,
    @"appos": @"ios",
    @"osversion": self.osVersion,
    @"manufacturer": @"Apple",
    @"model": @"unavailable",
    @"androidReleaseVersion": @"unavailable",
    @"payload": @[payloadJsonStructure]
  };
  
  return [NSJSONSerialization dataWithJSONObject:mainJsonStructure options:kNilOptions error:nil];
}

@end
