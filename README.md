# NgDynamicModules

Example application on how to lazily load prebuilt angular modules from any location and include them in a Wrapper Application.

The motivation behind this behaviour is that sub modules of an app can be developed independently by different teams and also deployed independently on different servers.
With this we can dynamically collect our modules that we want to have in our app and most importantly the submodules do not have to be known at build time of the enclosing app.

## Running the whole thing

To see how to run this demonstration, read the other README's in the subfolders.

## Building a dynamic module

A dynamic module is just a normal Angular module which is built manually and bundled into UMD bundle.  
In this repository there is an Angular app called module-a which wraps the underlying module which will then be lazy loaded.
This allows us to independently develop this module without having to add it to the app which will lazy load it later on.

The module-a app has a rollup-config which says how the result of the Angular compiler will be bundled.
Also it has a separate tsconfig for compiling the module, which defines that only the module.ts file in the src folder will be compiled. 
This means that we have to re-export every module, component etc. that we want to use in the wrapper application which loads our module.
If the module does everything by having its own Router configuration we only have to re-export the main module as is the case here.

`module.ts`
```typescript
export * from './app/module-a/module-a.module';
```

`tsconfig.module.ts`
```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "outDir": "./dist/out-module/",
    "types": []
  },
  "include": [
    "src/module.ts"
  ],
  "exclude": [
    "src/test.ts",
    "src/**/*.spec.ts"
  ]
}
```

`rollup.config.js`
```javascript
export default {
  input: 'dist/out-module/module.js',
  output: {
    file: 'dist/bundle/module.js',
    format: 'umd',
    name: 'module-a',
    globals: {
      '@angular/core': 'ng.core',
      '@angular/common': 'ng.common',
      '@angular/router': 'ng.router'
    }
  },
  // This is only to suppress the warning
  external: [
    '@angular/core',
    '@angular/common',
    '@angular/router'
  ]
}
```

The resulting bundle can be placed everywhere. We could copy it into the assets folder of the main app or place it on some webserver.

## Loading a module into the app

The portal app is our app that loads the prebuilt module from a local webserver.

We've got the modules.json which defines all modules that can be loaded lazily. We can also define a path under which the module will be available in the router.

`modules.json`
```json
[
  {
    "path": "module-a",
    "name": "module-a",
    "ngModuleName": "ModuleAModule",
    "source": "http://localhost:8080/module.js"
  }
]
```

The name of the module will be used to add the module to the global scope of the app as is the unique identifier for this module.
The property `ngModuleName` contains the name of the entry point module which we will be handing over to the router in the `loadChildren` method.

### Shared dependencies

The portal and its lazy loaded modules will share some dependencies and we want them to be provided by the portal app.
We already defined externals in the rollup configuration, now we have to add them to the window object so that they are available when we are interpreting the umd bundle.
This can be done anywhere in the app. What is important is that we use the same names.

```typescript
import * as angularCore from '@angular/core';
import * as angularCommon from '@angular/common';
import * as angularRouter from '@angular/Router';

(window as any).ng.core = angularCore;
(window as any).ng.common = angularCommon;
(window as any).ng.router = angularRouter;
```
 
If we look at the fourth line of our umd bundle we can check for the correct names.

`module.js` (UMD-Bundle)
```javascript
...
(global = global || self, factory(global['module-a'] = {}, global.ng.core, global.ng.common, global.ng.router));
...
```

### Loading the routes

The next step is an `APP_INITIALIZER` which will get our configuration for the modules in the `modules.json` file.
The whole thing is pretty simple and just iterates over our module definitions, creates a route with the correct path and
the loadChildren method which calls the `loadModule` method with the definition. In the end the existing router configurations and the new ones are merged and the router config is reset.
The new routes are prepended because the configuration of the portal app most likely will have a fallback route (`**`) and we want to have this one at the end.

We have to get the Router from the Injector so that we don't get a cyclic dependency error.
 
```typescript
export function routeInitializer(http: HttpClient, injector: Injector) {
  return () => http.get<ModuleDefinition[]>('/assets/modules.json')
    .pipe(tap(definitions => {
        const router = injector.get(Router);

        const paths: Routes = [];

        for (const definition of definitions) {
          paths.push({
            path: definition.path,
            loadChildren: () => loadModule(definition)
          });
        }

        router.resetConfig([
          ...paths,
          ...router.config
        ]);
      })
    ).toPromise();
}
```

`app.module.ts`
```typescript
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: routeInitializer,
    deps: [HttpClient, Injector],
    multi: true 
  }
]
```

### Loading the module

Last but not least we have to get the module from the source. For this we add a script tag to the end of the head tag and listen to its `onload` event.
(Fun fact: This is actually the same way Angular does it). After the script is loaded we will find the module in the window object under its name.  
It's very important that the name of the module in the rollup config and the `modules.json` are the same to make this work.


```typescript
export function loadModule(definition: ModuleDefinition): Promise<Type<any>> {
  const module = document.getElementById(definition.name);

  if (module) {
    return Promise.resolve(window[definition.name][definition.ngModuleName]);
  }

  const script = document.createElement('script');
  script.src = definition.source;
  script.id = definition.name;

  return new Promise((resolve, reject) => {
    document.head.appendChild(script);

    script.onload = () => {
      resolve(window[definition.name][definition.ngModuleName]);
    };

    script.onerror = (event: ErrorEvent) => {
      reject(event.error);
    };
  });
}
```

## Angular 8 (and newer) and its Gems

So with the new Angular Ivy compiler which comes (optionally, from Angular 9 on it is the default) with Angular 8 the components of Angular are compiled to a different format and we finally can get rid of the ngfactories which we're a burden for lazy loading custom chunks of code.
In the older versions of Angular you could achieve the same behaviour but you had to use the compiler to manually compile the modules at runtime and this was not really what one wished for when using AOT.
With Ivy it will still call the compiler in the background but this compiler is much, much leaner than the old one because everything in the bundle is already ready to be consumed by Angular as is.

A more detailed explanation can be found in a talk of Jason Aden at AngularConnect 2018 [here](https://www.youtube.com/watch?v=MMPl9wHzmS4&feature=youtu.be&t=738).

## Notes

This repository only contains a very barebones solution to the problem. To make this solution ready to be used in a production environment there is a whole lot of things to be considered.

For example
- canLoad Guards and other security measures
- dynamic collection of the module definition
- deployment of the module (maybe CORS and Content-Security-Policy issues)
- The Angular compiler cannot process scss/sass/less on its own with the solution in module-a we can only use plain css but module-b uses the Angular-CLI's built-in support for [ng-packagr](https://github.com/ng-packagr/ng-packagr) which does the magic for us and processes the scss files.
