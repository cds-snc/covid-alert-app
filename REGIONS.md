## Adding specific content

- Pull content from https://docs.google.com/document/d/1pgof04oFkjSqlBJ3shWnC2oO_2qxol-nr7C9BgJoFgE/edit

## Test locally

- brew cask install ngrok
- yarn global add json-server
- cd src/locale/translations
- json-server --watch region.json
- ngrok http 3000
- Update BackendService.ts -> getRegionContent (regionContentUrl)
  i.e. https://a6764c6fd6ce.ngrok.io/db
