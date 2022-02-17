import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { LobbyComponent } from './lobby/lobby.component';
import { ResultComponent } from './result/result.component';

const routes: Routes = [
  {path:"",redirectTo:"lobby",pathMatch:"full"},
  {path:"lobby",component:LobbyComponent},
  {path:"game",component:GameComponent},
  {path:"result",component:ResultComponent},
  {path:"**",redirectTo:"lobby",pathMatch:"full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
