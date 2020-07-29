[La version française suit.](#application-mobile-alerte-covid)

# COVID Alert Mobile App

![Lint + Typscript](https://github.com/cds-snc/covid-alert-app/workflows/CI/badge.svg)

Adapted from <https://github.com/CovidShield/mobile> ([upstream](https://github.com/cds-snc/covid-alert-app/blob/master/FORK.md))

This repository implements a React Native _client application_ for Apple/Google's [Exposure
Notification](https://www.apple.com/covid19/contacttracing) framework, informed by the [guidance provided by Canada's Privacy Commissioners](https://priv.gc.ca/en/opc-news/speeches/2020/s-d_20200507/).

- [Overview](#overview)
- [Local development](#local-development)
- [Customization](#customization)
- [Localization](#localization)

## Overview

This app is built using React Native and designed to work well with patterns on both Android and iOS devices. It works alongside the [COVID Alert Diagnosis Server](https://github.com/cds-snc/covid-alert-server) to provide a reference for how a client application for exposure notifications could work.

## Local development

### Prerequisites

Follow the steps outlined in [React Native Development Environment Setup](https://reactnative.dev/docs/environment-setup) to make sure you have the proper tools installed.

#### Node

- [Node 12 LTS](https://nodejs.org/en/download/)

#### iOS

- Xcode 11.5 or greater
- iOS device or simulator with iOS 13.5 or greater
- [Bundler](https://bundler.io/) to install the right version of CocoaPods locally
- You also need a provisioning profile with the Exposure Notification entitlement. For more information, visit https://developer.apple.com/documentation/exposurenotification.

#### Android

- Android device with the ability to run the latest version of Google Play Services or Google Play Services Beta. Sign up for beta program here https://developers.google.com/android/guides/beta-program.
- You also need a safelisted APPLICATION_ID that will be used to publish to Google Play. You could use APPLICATION_ID from [Google Sample App](https://github.com/google/exposure-notifications-android) for testing purposes `"com.google.android.apps.exposurenotification"`. Go to [Environment config](https://github.com/CovidShield/mobile#3-environment-config) to see how to change APPLICATION_ID.

#### 1. Check out the repository

```bash
git clone git@github.com:cds-snc/covid-shield-mobile.git
```

#### 2. Install dependencies

```bash
yarn install
```

##### 2.1 Additional step for iOS

###### 2.1.1 Install Cocoapods

```bash
sudo gem install cocoapods
```

###### 2.1.2 Install pods

```bash
bundle install && yarn pod-install
```

#### 3. Environment config

Check `.env` and adjust configuration if necessary. See [react-native-config](https://www.npmjs.com/package/react-native-config#different-environments) for more information.

Ex:

```bash
ENVFILE=.env.production yarn run-ios
ENVFILE=.env.production yarn run-android
```

#### 4. Start app in development mode

You can now launch the app using the following commands for both iOS and Android.

```bash
yarn run-ios
yarn run-android
```

You can also build the app with native development tool:

- For iOS, using Xcode by opening the `CovidShield.xcworkspace` file in the `ios` folder.
- For Android, using Android Studio by opening `android` folder.

### Development mode

When the app is running development mode, you can tap on the COVID Alert logo at the top of the app to open the Test menu. This menu enables you to:

- Put the app into test mode to bypass the Exposure Notification API check
- Change the system status
- Change the exposure status
- Send a sample notification
- Reset the app to onboarding state

Note that: Test menu is enabled if the environment config file (`.env*`) has `TEST_MODE=true`. To disable test mode UI on production build, simply set it to false in the environment config file `TEST_MODE=false`.

#### iOS Local Development

If you would like to:

- connect to a COVID Alert Diagnosis Server instance with an IP address or the server does not support HTTPS, or
- have the app run in the simulator and get automatic React-Native code updates via the Metro server;

Please add the following keys to the `info.plist` file. These keys should not be commited to the repo, and used only for local development.

```
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsLocalNetworking</key>
		<true/>
		<key>NSAllowsArbitraryLoads</key>
		<false/>
	</dict>
```

## Customization

You can customize the look and feel of the app largely by editing values found in the [Theme File](https://github.com/CovidShield/mobile/blob/master/src/shared/theme.ts).

## Localization

The COVID Alert app is available in French and English. Fully localized content can be modified by editing translations files found in the [translations directory](https://github.com/cds-snc/covid-alert-app/tree/master/src/locale/translations). More translations can be added by using the same mechanism as French and English.

After modifying the content you must run the `generate-translations` command in order for the app to reflect your changes.

```bash
yarn generate-translations
```

### Add new translation

1. Create a new i18n file in [src/locale/translations/](./src/locale/translations/).
2. Add the new option `pt` in [translations.js](./translations.js).
3. Regenerate the translations `yarn generate-translations`.
4. Add the new option in [src/components/LanguageToggle.tsx](./src/components/LanguageToggle.tsx).
5. Add the new option in [src/screens/language/Language.tsx](./src/screens/language/Language.tsx).
6. Add the new option in Xcode `Localizations` settings (Project -> CovidShield -> Info tab -> Localizations) and make sure `Launch Screen.storyboard` is checked.

## Testing

- [Manual Testing Plan](./TEST_PLAN.md)
- [End to end testing with Detox](./e2e/DETOX_DOC.md)

## Who built COVID Alert?

COVID Alert was originally developed by [volunteers at Shopify](https://www.covidshield.app/). It was [released free of charge under a flexible open-source license](https://github.com/CovidShield/mobile).

This repository is being developed by the [Canadian Digital Service](https://digital.canada.ca/). We can be reached at <cds-snc@tbs-sct.gc.ca>.

## Troubleshooting

### [Android] Problem with debug.keystore during run Android version

Logs

```bash
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:packageDebug'.
> A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
   > com.android.ide.common.signing.KeytoolException: Failed to read key AndroidDebugKey from store "/Users/YOUR_USER/.android/debug.keystore": keystore password was incorrect
```

Generate a new `debug.keystore`:

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

Copy your debug.keystore to `~/.android/debug.keystore`:

```bash
cd android/app
cp debug.keystore ~/.android/debug.keystore
```

Now you can run `yarn run-android` in your root folder.

### [MacOS] Problem installing Cocoapods

When following step _2.1.1 Install Cocoapods_ if you recieve an error that looks like the following (_Please Note:_ Error message will not be identical but simliar):

```bash
ERROR:  Loading command: install (LoadError)
  dlopen(/Users/$home/ruby/2.6.5/x86_64-darwin18/openssl.bundle, 9): Library not loaded: /usr/local/opt/openssl/lib/libssl.1.0.0.dylib
  Referenced from: /Users/$home/ruby/2.6.5/x86_64-darwin18/openssl.bundle
ERROR:  While executing gem ... (NoMethodError)
```

This is because the version of Ruby you have installed does not have OpenSSL included.

You can fix this error by installing Ruby Version Manager (if you do not already have it), and reinstalling the version of ruby required with OpenSSL using the following steps:

1. Install RVM following the instructions here: https://rvm.io/
1. Run the following command to install the version of Ruby needed with OpenSSL included, this will take a few minutes so be patient.

```bash
rvm reinstall 2.6.5 --with-openssl-dir=/usr/local/opt/openssl
```

You should now be able to install cocoapods and gem commands should now work.

---

# Application mobile Alerte COVID

![Lint + Typscript](https://github.com/cds-snc/covid-alert-app/workflows/CI/badge.svg)

Adapté de <https://github.com/CovidShield/mobile> ([voir les modifications](https://github.com/cds-snc/covid-alert-app/blob/master/FORK.md))

Ce dépôt met en œuvre une _application client_ React Native pour le cadriciel [Notification
d’exposition](https://www.apple.com/covid19/contacttracing) d’Apple/Google, éclairé par [l’orientation fournie par le commissaire à la protection de la vie privée du Canada](https://priv.gc.ca/fr/opc-news/speeches/2020/s-d_20200507/).

- [Aperçu](#aperçu)
- [Développement local](#développement-local)
- [Personnalisation](#personnalisation)
- [Localisation](#localisation)

## Aperçu

Cette application est construite à l’aide de React Native et est conçue pour bien fonctionner avec des modèles sur les appareils Android et iOS. Elle fonctionne de concert avec le [Serveur de diagnostic Alerte COVID](https://github.com/cds-snc/covid-alert-server) pour fournir une référence sur le fonctionnement possible d’une application client pour les notifications d’exposition.

## Développement local

### Conditions préalables

Suivez les étapes décrites dans [Configuration de l’environnement de développement React Native](https://reactnative.dev/docs/environment-setup) pour vous assurer que les outils appropriés sont installés.

#### Node

- [Node 12 LTS](https://nodejs.org/en/download/)

#### iOS

- XCode 11.5 ou supérieur
- appareil ou simulateur iOS avec iOS 13.5 ou plus récent
- [Bundler](https://bundler.io/) pour installer la bonne version de CocoaPods localement
- Vous avez également besoin d’un profil de provisionnement avec le droit de notification d’exposition. Pour obtenir de plus amples renseignements, visitez https://developer.apple.com/documentation/exposurenotification.

#### Android

- Appareil Android pouvant exécuter la dernière version de Google Play Services ou Google Play Services Beta. Inscrivez-vous au programme bêta ici https://developers.google.com/android/guides/beta-program.
- Vous avez également besoin d’un APPLICATION_ID protégé qui sera utilisé pour publier dans Google Play. Vous pouvez utiliser l’APPLICATION_ID de [Google Sample App](https://github.com/google/exposure-notifications-android) à des fins d’essai `« com.google.android.apps.exposurenotification »`. Aller à [Environment config](https://github.com/CovidShield/mobile#3-environment-config) pour voir comment modifier l’APPLICATION_ID.

#### 1. Consulter le dépôt

```bash
git clone git@github.com:cds-snc/covid-shield-mobile.git
```

#### 2. Installer les dépendances :

```bash
yarn install
```

##### 2.1 Étape supplémentaire pour iOS

###### 2.1.1 Installer Cocoapods

```bash
sudo gem install cocoapods
```

###### 2.1.2 Installer les modules

```bash
bundle install && yarn pod-install
```

#### 3. Configuration environnement

Cocher `.env` et rajuster la configuration si nécessaire. Voir [react-native-config](https://www.npmjs.com/package/react-native-config#different-environments) pour plus d’information.

Exemple :

```bash
ENVFILE=.env.production yarn run-ios
ENVFILE=.env.production yarn run-android
```

#### 4. Démarrer l’application en mode développement

Vous pouvez maintenant lancer l’application à l’aide des commandes suivantes pour iOS et Android :

```bash
yarn run-ios
yarn run-android
```

Vous pouvez également construire l’application avec un outil de développement natif :

- Pour iOS, utilisez XCode en ouvrant le fichier `CovidShield.xcworkspace` dans le dossier « ios ».
- Pour Android, utilisez Android Studio en ouvrant le dossier `android`.

### Mode de développement

Lorsque l’application est en mode de développement, vous pouvez appuyer sur le logo Alerte COVID en haut de l’application pour ouvrir le menu Test. Ce menu vous permet de :

- Mettre l’application en mode test pour contourner le contrôle de l’API de notification d’exposition
- Modifier l’état du système
- Modifier le statut d’exposition
- Envoyer un exemple de notification
- Réinitialiser l’application à l’état d’intégration

Remarque : Le menu de test est activé si le fichier de configuration de l’environnement (`.env*`) montre « TEST_MODE=true ». Pour désactiver l’interface utilisateur du mode test en production, il suffit de la définir comme False dans le fichier de configuration d’environnement « TEST_MODE=false ».

## Personnalisation

Vous pouvez personnaliser l’apparence de l’application en grande partie en modifiant les valeurs du [Theme File](https://github.com/CovidShield/mobile/blob/master/src/shared/theme.ts).

## Localisation

L’application Alerte COVID est disponible en français et en anglais. Le contenu entièrement localisé peut être modifié en modifiant les fichiers de traduction qui se trouvent dans le [répertoire des traductions](https://github.com/cds-snc/covid-alert-app/tree/master/src/locale/translations). On peut ajouter plus de traductions en utilisant le même mécanisme pour le français et l’anglais.

Après avoir modifié le contenu, vous devez exécuter la commande `generate-translations` pour que l’application reflète vos modifications.

```bash
yarn generate-translations
```

### Ajouter une nouvelle traduction

1. Créer un nouveau fichier i18n dans [src/local/translations/](./src/local/translations/).
2. Ajouter la nouvelle option `pt` dans [translations.js](./translations.js).
3. Régénérer les traductions `yarn generate-translations`.
4. Ajouter la nouvelle option dans [src/components/Languagetoggle.tsx](./src/components/Languagetoggle.tsx).
5. Ajouter la nouvelle option dans [src/screens/language/Language.tsx](./src/screens/language/Language.tsx).
6. Ajouter la nouvelle option dans les paramètres Xcode `Localizations` (Project -> CovidShield -> onglet Info -> Localizations) et assurez-vous que `Launch Screen.storyboard` est coché.

## Qui a conçu Alerte COVID?

Alerte COVID a été développé à l’origine par [des bénévoles de Shopify](https://www.covidshield.app/). Il a été [diffusé gratuitement en vertu d’une licence ouverte flexible](https://github.com/CovidShield/server).

Ce dépôt est maintenu par le [Service numérique canadien](https://numerique.canada.ca/). Vous pouvez nous joindre à <cds-snc@tbs-sct.gc.ca>.

## Résolution de problèmes

### [Android] Problème avec debug.keystore pendant l’exécution de la version Android

Journaux

```bash
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:packageDebug'.
> A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
   > com.android.ide.common.signing.KeytoolException: Failed to read key AndroidDebugKey from store "/Users/YOUR_USER/.android/debug.keystore": keystore password was incorrect
```

Créer un nouveau `debug.keystore` :

```bash
cd android/app
keytool -genkey -v -keystore debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

Copiez votre debug.keystore sur `~/.android/debug.keystore` :

```bash
cd android/app
cp debug.keystore ~/.android/debug.keystore
```

Vous pouvez maintenant exécuter `yarn run-android` dans votre dossier racine.
