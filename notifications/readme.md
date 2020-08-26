# Pull/Poll notifications proof-of-concept

With traditional Push Notifications, a Device ID and other device meta information is shared with a third-party service, which raises privacy concerns.

To alleviate those concerns, this concept uses Background Fetch as a polling mechanism to check a server for notifications which can be provided in a JSON format. Read receipts are tracked locally to prevent duplicate display. Messages can be scoped by App Version, Region, or Expiry date.

## Eligible messages

Eligible messages are determined on device by checking:

- expires_at > today
- target_regions includes selected_region
- installed_version satisfies target_version

## Multiple eligible messages

To prevent "notification fatigue" where a newly onboarded user might have multiple eligible messages for display, the app will determine display priority using the following logic:

- priority flag - display the message with highest priority
- if there are multiple messages with same priority, display oldest (posted_at) first
- remaining messages will not be displayed until a future check

## Read receipts

The mobile app will store read receipts in AsyncStorage keyed by message.id

## Files

- [JSON Schema](schema.json)
- [Sample JSON](index.json)

## Notes

- For POC, the JSON file could be stored in an S3 bucket or even Github
- Probably best to not store messages for long, ie we should trim the json of expired notifications when publishing new ones to limit bandwidth usage
- The mobile app should have a local storage mechanism to track receipts using the unique id of the message (sqlite)
- Can provide target_region for display (Province codes, CA for all)
  - Provided as an array to accommodate multiple regions
- Can optionally provide a target_version for app version-specific display (ie, update available!)
  - The version can use semver version comparators/ranges (ie, >, >=, <, etc...)
- Version and Region checks are run locally

## Other considerations

- Is there a way we can check for new notifications before downloading the full notifications feed to limit bandwidth usage? Maybe a modified header that can be stored locally after download?
