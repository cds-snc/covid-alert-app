//
//  ENActivityHandling.m
//  CovidShield
//
//  Created by  Clement Janin on 2020-12-16.
//

#import "ENActivityHandling.h"

@implementation ENManager (ENActivityHandling)

- (void)setLaunchActivityHandler:(ENActivityHandler)activityHandler {
    [self setValue:activityHandler forKey:@"activityHandler"];
}

@end
