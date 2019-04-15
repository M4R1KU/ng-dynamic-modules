# Module A

This is a wrapper app for the actual module we want to load in an independent Angular app.

## Install

`npm install && ng build`

## Build bundle

To build the UMD bundle for later serving to the app run `npm run bundle:module`.

## Serve module

To make the UMD bundle accessible for the portal app run `npm run serve:module`.  
And then start the portal app in its directory by running `ng s`
