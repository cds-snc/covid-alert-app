# Using Detox test artifacts

## test-gallery

Uses e2e tests' output from the `artifacts` folder, and outputs back to that folder, this is a node script thast will generate a single, vertical-view html page of that test's screenshots.

Original author Tim Arney, with contributions by Andréas K.LeF.

## visual-diff

We can use the test-gallery script to get before/after images. Ex: run once on latest master, and again on feature branch.

This node script will take the two output HTML files from the test-gallery script, parse them, and merge them into one single continuous file. Displaying two versions of the app, ideally from two different features branhes, side-by-side, for easy visual inspection.

Original Andréas K.LeF.

## Future Work

### to visual-diff

be able to pass a `--latest` flag to visual-diff that automatically grabs the two most recent  `*.html` files from `/artifacts` would be very convenient. That would mean sorting through the files and getting the lastest couple by "most recently created" date.
