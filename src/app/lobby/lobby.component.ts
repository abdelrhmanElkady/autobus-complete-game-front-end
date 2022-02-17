import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { HubService } from '../services/hub.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnDestroy {

  allUsers:User[]=[]

  usersSub:Subscription = new Subscription();
  startGameSub:Subscription = new Subscription();

  
  constructor(private hubService:HubService,private router:Router) {
    this.usersSub = this.hubService.usersObservable.subscribe(res=>{
      this.allUsers = res
    })

    this.startGameSub = this.hubService.startGameObservable.subscribe(()=>{
      this.router.navigate(["/game"])
    })
   }
 

  

  currentUsrName(name:string){
    if(name == "") return
    this.hubService.hubConnection.invoke("AddUser",name)
   }

   startGame(){
     if(this.allUsers.length<2){
       alert("should be two players at least")
       return
     }

     this.hubService.hubConnection.invoke("StartGame")
     
   }

   ngOnDestroy(): void {
    this.usersSub.unsubscribe()
    this.startGameSub.unsubscribe()
  }
}
