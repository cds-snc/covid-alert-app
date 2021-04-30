# Using Detox test artifacts

## test-gallery

Uses e2e tests' output from the `artifacts` folder, and outputs back to that folder, this is a node script thast will generate a single, vertical-view html page of that test's screenshots.

Original author Tim Arney, with contributions by Andréas K.LeF.

## visual-diff

We can use the test-gallery script to get before/after images. Ex: run once on latest master, and again on feature branch.

This node script will take those two runs (two HTML files) from the test-gallery script, parse them, and merges them into one single continuous file. It displays two version of the app side-by-side, for easy visual difference identification.

Original Andréas K.LeF.

## Future Work

It would be really nice to be able to pass a flag
