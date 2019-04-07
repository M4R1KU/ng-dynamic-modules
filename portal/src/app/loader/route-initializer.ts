import { HttpClient } from '@angular/common/http';
import * as angularCore from '@angular/core';
import { Injector, Type } from '@angular/core';
import { tap } from 'rxjs/operators';
import * as angularRouter from '@angular/router';
import { Router, Routes } from '@angular/router';
import * as angularCommon from '@angular/common';

export interface ModuleDefinition {
  path: string;
  name: string;
  ngModuleName: string;
  source: string;
}

(window as any).ng.core = angularCore;
(window as any).ng.common = angularCommon;
(window as any).ng.router = angularRouter;

export function routeInitializer(http: HttpClient, injector: Injector) {
  return () => http.get<ModuleDefinition[]>('/assets/modules.json')
    .pipe(tap(definitions => {
        const router = injector.get(Router);

        const paths: Routes = definitions.map(definition => ({
          path: definition.path,
          loadChildren: () => loadModule(definition)
        }));

        router.resetConfig([
          ...paths,
          ...router.config
        ]);
      })
    ).toPromise();
}

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
