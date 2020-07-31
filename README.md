[La version française suit.](#application-mobile-alerte-covid)

# COVID Alert Mobile App

![Lint + Typscript](https://github.com/cds-snc/covid-alert-app/workflows/CI/badge.svg)

Adapted from <https://github.com/CovidShield/mobile> ([upstream](https://github.com/cds-snc/covid-alert-app/blob/master/FORK.md))

This repository implements a React Native _client application_ for Apple/Google's [Exposure
Notification](https://www.apple.com/covid19/contacttracing) framework, informed by the [guidance provided by Canada's Privacy Commissioners](https://priv.gc.ca/en/opc-news/speeches/2020/s-d_20200507/).

- [Overview](#overview)
- [App Description](#description)
- in [development doc:](DEVELOP.md)
    - [Local development](DEVELOP.md#local-development)
    - [Customization](DEVELOP.md#customization)
    - [Localization](DEVELOP.md#localization)
    - [Troubleshooting](DEVELOP.md#troubleshooting)

## Overview

This app is built using React Native and designed to work well with patterns on both Android and iOS devices. It works alongside the [COVID Alert Diagnosis Server](https://github.com/cds-snc/covid-alert-server) to provide a reference for how a client application for exposure notifications could work.

## Description

Canada's COVID Alert app notifies you if someone you were near in the past 14 days tells the app they tested positive.

COVID Alert uses Bluetooth to exchange random codes with nearby phones.
It does not use or access any location data.
COVID Alert works by determining how far away other phones are by the strength of their Bluetooth signal.

Several times a day, COVID Alert checks a list of codes from people who tell the app they tested positive.
You'll get a notification if a code you received matches one of the positive codes.

If you test positive for COVID-19 you will receive a one-time key with your diagnosis to enter into COVID Alert.
The app asks permission to share your random codes from the last 14 days with a central server.

Other phones using COVID Alert check the central server periodically throughout the day.
If they recorded any codes that match the codes in the central server, their user will be notified that they were exposed.

COVID Alert has no way of knowing:

* your location - COVID Alert does not use GPS or location services
* your name or address
* the place or time you were near someone
* if you're currently near someone who was previously diagnosed

Provincial and territorial governments are working to support COVID Alert across Canada.

## Who built COVID Alert?

COVID Alert was originally developed by [volunteers at Shopify](https://www.covidshield.app/). It was [released free of charge under a flexible open-source license](https://github.com/CovidShield/mobile).

This repository is being developed by the [Canadian Digital Service](https://digital.canada.ca/). We can be reached at <cds-snc@tbs-sct.gc.ca>.

---

# Application mobile Alerte COVID

![Lint + Typscript](https://github.com/cds-snc/covid-alert-app/workflows/CI/badge.svg)

Adapté de <https://github.com/CovidShield/mobile> ([voir les modifications](https://github.com/cds-snc/covid-alert-app/blob/master/FORK.md))

Ce dépôt met en œuvre une _application client_ React Native pour le cadriciel [Notification
d’exposition](https://www.apple.com/covid19/contacttracing) d’Apple/Google, éclairé par [l’orientation fournie par le commissaire à la protection de la vie privée du Canada](https://priv.gc.ca/fr/opc-news/speeches/2020/s-d_20200507/).

- [Aperçu](#aperçu)
- in [development doc:](DEVELOP.md#application-mobile-alerte-covid)
    - [Développement local](DEVELOP.md#développement-local)
    - [Personnalisation](DEVELOP.md#personnalisation)
    - [Localisation](DEVELOP.md#localisation)
    - [Résolution de problèmes](DEVELOP.md#Résolution-de-problèmes)

## Aperçu

Cette application est construite à l’aide de React Native et est conçue pour bien fonctionner avec des modèles sur les appareils Android et iOS. Elle fonctionne de concert avec le [Serveur de diagnostic Alerte COVID](https://github.com/cds-snc/covid-alert-server) pour fournir une référence sur le fonctionnement possible d’une application client pour les notifications d’exposition.

## Qui a conçu Alerte COVID?

Alerte COVID a été développé à l’origine par [des bénévoles de Shopify](https://www.covidshield.app/). Il a été [diffusé gratuitement en vertu d’une licence ouverte flexible](https://github.com/CovidShield/server).

Ce dépôt est maintenu par le [Service numérique canadien](https://numerique.canada.ca/). Vous pouvez nous joindre à <cds-snc@tbs-sct.gc.ca>.
