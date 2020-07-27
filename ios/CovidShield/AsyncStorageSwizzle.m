#import "AsyncStorageSwizzle.h"
#import <objc/runtime.h>

static id writeManifestHook(id, SEL, id*);
static id writeEntryHook(id, SEL, id, BOOL*);
static IMP _origWriteManifest;
static IMP _origWriteEntry;

@implementation AsyncStorageSwizzle {
  BOOL _configured;
}
+ (instancetype)sharedInstance {
  static AsyncStorageSwizzle *me = nil;
  static dispatch_once_t token;
  dispatch_once(&token, ^{
      me = [[AsyncStorageSwizzle alloc] init];
    });
  return me;
}

+ (BOOL)configure {
  return [[AsyncStorageSwizzle sharedInstance] isConfigured];
}

- (BOOL)isConfigured {
  return _configured;
}

- (instancetype)init {
  if(self = [super init]) {
    SEL writeManifest = @selector(_writeManifest:);
    SEL writeEntry = @selector(_writeEntry:changedManifest:);
    Class storageClass = objc_getClass("RNCAsyncStorage");
    if(!storageClass) return nil;

    _origWriteManifest = class_replaceMethod(storageClass,
                                             writeManifest,
                                             (IMP)writeManifestHook,
                                             "@@:^@");
    _origWriteEntry = class_replaceMethod(storageClass,
                                          writeEntry,
                                          (IMP)writeEntryHook,
                                          "@@:@^B");
    _configured = YES;
  }
  return self;
}

- (void)setFlagOnDocuments {
  NSFileManager *fm = [[NSFileManager alloc] init];
  NSURL *docsURL = [[fm URLsForDirectory: NSApplicationSupportDirectory
                              inDomains: NSUserDomainMask]
                     firstObject];
  if(!docsURL) return;
  
  NSDirectoryEnumerator *en = [fm enumeratorAtURL: docsURL
                                  includingPropertiesForKeys:
                                    @[ NSURLIsDirectoryKey,
                                       NSURLIsExcludedFromBackupKey ]
                                          options: 0
                                     errorHandler: nil];
  for(NSURL *fileURL in en) {
    NSNumber *isDirectory = nil;
    NSNumber *isExcludedFromBackup = nil;
    NSError *err = nil;
    [fileURL getResourceValue: &isDirectory forKey:NSURLIsDirectoryKey
                        error: nil];
    [fileURL getResourceValue: &isExcludedFromBackup
                       forKey: NSURLIsExcludedFromBackupKey
                        error: nil];
    if(![isDirectory boolValue] && ![isExcludedFromBackup boolValue]){
      if(![fm setAttributes: @{ NSURLIsExcludedFromBackupKey: @YES }
      ofItemAtPath: fileURL.path error: &err]) {
        #if DEBUG
        NSLog(@"error: %@", err);
        #endif
      }
    }
  }                                                     
}
@end

static id writeManifestHook(id asyncStorage, SEL selector,
                             id* arg0Passthrough) {
  id rv = 
    ((id (*)(id, SEL, id*))*_origWriteManifest)(asyncStorage, selector,
                                               arg0Passthrough);
  [[AsyncStorageSwizzle sharedInstance] setFlagOnDocuments];
  return rv;
}

static id writeEntryHook(id asyncStorage, SEL selector,
                          id arg0Passthrough, BOOL *arg1Passthrough) {
  id rv = 
  ((id (*)(id, SEL, id, BOOL*))*_origWriteEntry)(asyncStorage, selector,
                                                arg0Passthrough,
                                                arg1Passthrough);
  [[AsyncStorageSwizzle sharedInstance] setFlagOnDocuments];

  return rv;
}
