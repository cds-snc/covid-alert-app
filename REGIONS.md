# Editing regional content

Update the regional content:

- src/locale/translations/regional/en.json
- src/locale/translations/regional/fr.json

Run `generate-translations:regional` to create auto generate the region.json file `src/locale/translations/region.json`

The generated `region.json` file within the repo is used as a "fallback". The default content gets pulled from the server dynamically.

## Update "dynamic region" content from the server

### Staging

The content of the region.json (from the repo) should be copied to the [staging](https://github.com/cds-snc/covid-alert-exposure-configuration-staging/blob/master/exposure-configuration/region.json)

> Note: When copying remove the generated warning message

```
// remove
{"Warning":"THIS IS A GENERATED FILE - DO NOT EDIT")
```

### Production

Once tested on staging the same content needs to be moved to [production](https://github.com/cds-snc/covid-alert-exposure-configuration-production/blob/master/exposure-configuration/region.json)

# Testing changes to Regional config and EN config

## Testing region content

- Pull content from https://docs.google.com/document/d/1pgof04oFkjSqlBJ3shWnC2oO_2qxol-nr7C9BgJoFgE/edit

### Steps to test locally

- `brew cask install ngrok`
- `yarn global add json-server`
- `json-server --watch src/locale/translations/region.json`
- `ngrok http 3000`
- Add the following to your .env file and do a build: `REGION_JSON_URL=https://XXXXXXXXXX.ngrok.io/db`

## Testing EN Config changes

A similar process can be used to test changes to the EN config.

- make changes to `src/services/ExposureNotificationService/ExposureConfigurationDefault.json`
- commit and push your changes to a branch
- Add the following to your .env file and do a build: `EN_CONFIG_URL=https://raw.githubusercontent.com/cds-snc/covid-alert-app/YOUR_BRANCH_NAME/src/services/ExposureNotificationService/ExposureConfigurationDefault.json`
