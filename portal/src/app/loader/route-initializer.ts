import * as angularCdkOverlay from '@angular/cdk/overlay';
import * as angularCommon from '@angular/common';
import * as angularForms from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as angularCore from '@angular/core';
import { Injector, Type } from '@angular/core';
import * as angularMaterialButton from '@angular/material/button';
import * as angularMaterialCard from '@angular/material/card';
import * as angularMaterialDatepicker from '@angular/material/datepicker';
import * as angularMaterialFormField from '@angular/material/form-field';
import * as angularMaterialIcon from '@angular/material/icon';
import * as angularMaterialInput from '@angular/material/input';
import * as angularMaterialTable from '@angular/material/table';
import * as angularRouter from '@angular/router';
import { Router, Routes } from '@angular/router';
import { tap } from 'rxjs/operators';

export interface ModuleDefinition {
  path: string;
  name: string;
  ngModuleName: string;
  source: string;
}

(window as any).ng = {};
(window as any).ng.core = angularCore;
(window as any).ng.common = angularCommon;
(window as any).ng.router = angularRouter;
(window as any).ng.forms = angularForms;
(window as any).ng.material = {};
(window as any).ng.material.formField = angularMaterialFormField;
(window as any).ng.material.card = angularMaterialCard;
(window as any).ng.material.table = angularMaterialTable;
(window as any).ng.material.input = angularMaterialInput;
(window as any).ng.material.datepicker = angularMaterialDatepicker;
(window as any).ng.material.button = angularMaterialButton;
(window as any).ng.material.icon = angularMaterialIcon;
(window as any).ng.cdk = {};
(window as any).ng.cdk.overlay = angularCdkOverlay;

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
