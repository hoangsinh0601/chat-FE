import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from './rooms/rooms.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: RoomsComponent },
  {
    path: ':id',
    loadComponent: () =>
      import('./room/room.component').then((c) => c.RoomComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsRoutingModule {}
