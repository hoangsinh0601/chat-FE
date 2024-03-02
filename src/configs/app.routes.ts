import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../app/pages/pages-routing.module').then(
        (m) => m.PagesRoutingModule
      ),
  },
];
