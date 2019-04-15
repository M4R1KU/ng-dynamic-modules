# Module B

This is a wrapper app for the actual module we want to load in an independent Angular app.

This wrapper can be run in a standalone mode which only shows the given module.
Thanks to this we can develop every module in a separate repository with its backend microservice and have loose coupling within the frontend but strict coupling the frontend and backend.
This lets us extend the original idea of vertical separation in the backend to the frontend.

## Install

`npm install && ng build`

## Build bundle

To build the UMD bundle for later serving to the app run `npm run bundle:module`.

## Serve module

To make the UMD bundle accessible for the portal app run `npm run serve:module`.  
And then start the portal app in its directory by running `ng s`
