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
