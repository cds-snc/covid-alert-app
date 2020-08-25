# Pull notifications specification

Just jotting down some ideas around a possible JSON format for a "Pull Notifications" solution.

## Files

- [Local Receipts SQL](receipts.sql)
- [JSON Schema](schema.json)
- [Sample JSON](index.json)

## Notes

- The JSON file could be stored on an S3 bucket or even Github
- Probably best to not store historical messages, ie we should trim the json of expired notifications when publishing new ones
- The mobile app should have a local storage mechanism to track receipts using the unique id of the message
- Can provide target_region for display (Province codes, CA for all)
- Can optionally provide a target_version for app version-specific display (ie, update available!)
