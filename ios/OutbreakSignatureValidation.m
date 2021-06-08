//
//  OutbreakSignatureValidation.m
//  CovidShield
//
//  Created by Clement Janin on 2021-06-08.
//

#import "OutbreakSignatureValidation.h"

@implementation OutbreakSignatureValidation

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(isSignatureValid, packageMessage:(NSString *)packageMessage packageSignature:(NSString *)packageSignature withResolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
  @try {
    NSData *binaryPublicKey = [[NSData alloc] initWithBase64EncodedString:PM_OUTBREAK_PUBLIC_KEY options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *binaryMessage = [[NSData alloc] initWithBase64EncodedString:packageMessage options:NSDataBase64DecodingIgnoreUnknownCharacters];
    NSData *binarySignature = [[NSData alloc] initWithBase64EncodedString:packageSignature options:NSDataBase64DecodingIgnoreUnknownCharacters];
    
    NSDictionary* options = @{
      (id)kSecAttrKeyType: (id)kSecAttrKeyTypeECSECPrimeRandom,
      (id)kSecAttrKeyClass: (id)kSecAttrKeyClassPublic
    };
    
    //https://developer.apple.com/forums/thread/104464?answerId=317042022#317042022
    //https://stackoverflow.com/questions/63076554/problem-using-p256-signing-publickey-on-ios/63203635#63203635
    NSData *last65BytesOfBinaryPublicKey = [binaryPublicKey subdataWithRange:NSMakeRange(26, 65)];
    
    SecKeyRef publicKey = SecKeyCreateWithData((__bridge CFDataRef)last65BytesOfBinaryPublicKey, (__bridge CFDictionaryRef)options, nil);
    
    SecKeyAlgorithm algorithm = kSecKeyAlgorithmECDSASignatureMessageX962SHA256;
    
    BOOL canVerify = SecKeyIsAlgorithmSupported(publicKey, kSecKeyOperationTypeVerify, algorithm);
    
    BOOL isValid = NO;
    
    if (canVerify) {
      isValid = SecKeyVerifySignature(publicKey, algorithm, (__bridge CFDataRef)binaryMessage, (__bridge CFDataRef)binarySignature, nil);
    }
    
    resolve(@(isValid));
  } @catch (NSException *exception) {
    resolve(@(NO));
  }
}

@end
