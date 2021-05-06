# Using Detox test artifacts

## test-gallery

Uses e2e tests' output from the `artifacts` folder, and outputs back to that folder, this is a node script thast will generate a single, vertical-view html page of that test's screenshots.

First `cd test-gallery`
then `yarn install`, to install dependencies

You are now able to run:

```node
node index.js --dir 'ios.2021-01-29 14-17-59Z'
node index.js --dir 'android.aosp.2021-01-28 23-28-22Z'
```

Original author Tim Arney, with contributions by Andréas K.LeF.

## visual-diff

The premise is that we use the test-gallery script to get before/after images of the app. Ex: run once on latest master, and again on feature branch.

This node script will take the two output HTML files from the test-gallery script in our scenario above, parse them, and merge them into one single continuous file. Displaying two versions of the app, ideally from two different features branhes, side-by-side, for easy visual inspection.

example:

`yarn visual-diff --base 'android.aosp.2021-02-12 20-15-24Z.html' --target 'ios.2021-02-12 20-10-56Z.html'`

Which should generate a visual-diff file of the following format:

`visual-diff.2021-02-12 20-10-56Z [android.aosp vs ios].html`

This file will also be output to the `../artifacts` folder.

Original Andréas K.LeF.

## Future Work

### to visual-diff

#### --latest flag

be able to pass a `--latest` flag to visual-diff that automatically grabs the two most recent  `*.html` files from `/artifacts` would be very convenient. That would mean sorting through the files and getting the lastest couple by "most recently created" date.

#### PDF output


