# Scripts for parsing Detox test artifacts

## install

First `cd test-gallery`
then `yarn install`, to install the required dependencies.

You are now able to run the following two scripts:

## test-gallery

This is a node script thast will generate a single, vertical-view html page of a Detox test's screenshots.

Uses e2e tests' output from the `artifacts` folder, and outputs back to that folder.

```bash
yarn test-gallery --dir 'ios.2021-01-29 14-17-59Z'
yarn test-gallery --dir 'android.aosp.2021-01-28 23-28-22Z'
```

Original author Tim Arney, with contributions by Andréas K.LeF.

## visual-diff

This node script will take the two output HTML files from the test-gallery script, parse them, and merge them into one single continuous file.

This allows one to easily view two versions of the app, ideally from two different features branhes, side-by-side, for easy visual inspection.

For convenience, this script's output is also made into a single PDF, for easy distribution and consumption.

## Calling the script



### provide two file names

where each file is the output of one run of the `test-gallery` script:

`yarn visual-diff --base 'android.aosp.2021-02-12 20-15-24Z.html' --target 'ios.2021-02-12 20-10-56Z.html'`

Which should generate a visual-diff file of the following format:

>`visual-diff.2021-02-12 20-10-56Z [android.aosp vs ios].html`

This file will also be placed in the `../artifacts` folder.

### provide two folder names (you lose the branch naming )

where each folder will contain the output of one run of the `exploreDemoMenu.e2e.js` Detox test:

`yarn visual-diff --base "ios.2021-05-06 16-18-53Z" --target "ios.2021-05-06 18-56-43Z`

## Future Work

### to visual-diff

#### --latest flag

be able to pass a `--latest` flag to visual-diff that automatically grabs the two most recent  `*.html` files `/artifacts`, would be very convenient. That would mean sorting through the files, and getting the lastest couple by "most recently created" date.
