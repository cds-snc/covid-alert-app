# Pull notifications specification

Just jotting down some ideas around a possible JSON format for a "Pull Notifications" solution. The idea is that with traditional Push Notifications, a Device ID and other device meta information is shared with a third-party service, which raises privacy concerns.

To alleviate those concerns, this concept uses Background Fetch as a polling mechanism to check a server for notifications which can be provided in a JSON format. There is a local SQLite database that keeps track of read receitps to prevent duplicate notifications.

## Files

- [Local Receipts SQL](receipts.sql)
- [JSON Schema](schema.json)
- [Sample JSON](index.json)

## Notes

- The JSON file could be stored on an S3 bucket or even Github
- Probably best to not store historical messages, ie we should trim the json of expired notifications when publishing new ones
- The mobile app should have a local storage mechanism to track receipts using the unique id of the message (sqlite)
- Can provide target_region for display (Province codes, CA for all)
- Can optionally provide a target_version for app version-specific display (ie, update available!)
