import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'chats',
    loadChildren: () =>
      import('./chats/chats-routing.module').then((m) => m.ChatsRoutingModule),
  },
  {
    path: 'error',
    loadComponent: () =>
      import('./error/error.component').then((c) => c.ErrorComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: 'login', },
  { path: '**', pathMatch: 'full', redirectTo: 'error', },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
