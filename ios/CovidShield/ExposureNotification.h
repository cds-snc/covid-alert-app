//
//  ExposureNotification.h
//  CovidShield
//
//  Created by Sergey Gavrilyuk on 2020-05-03.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <ExposureNotification/ExposureNotification.h>

typedef enum ExposureNotificationSupportType {
  ENSupportTypeVersion12dot5,
  ENSupportTypeVersion13dot5AndLater,
  ENSupportTypeUnsupported
} ExposureNotificationSupportType;

NS_ASSUME_NONNULL_BEGIN

@interface ExposureNotification : NSObject<RCTBridgeModule>

@property (nonatomic, nullable, strong) ENManager *enManager;

+ (ExposureNotificationSupportType) exposureNotificationSupportType;

@end

NS_ASSUME_NONNULL_END
