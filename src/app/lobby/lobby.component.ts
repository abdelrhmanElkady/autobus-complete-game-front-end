import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { HubService } from '../services/hub.service';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnDestroy ,OnInit {

  allUsers:User[]=[]

  usersSub:Subscription = new Subscription();
  startGameSub:Subscription = new Subscription();

  
  constructor(private hubService:HubService,private router:Router,private Location: LocationStrategy) {

    // disable the browser’s back button
    history.pushState(null, '', window.location.href);
    this.Location.onPopState(() => {
    history.pushState(null, '', window.location.href);
    });


    this.usersSub = this.hubService.usersObservable.subscribe(res=>{
      this.allUsers = res
    })

    this.startGameSub = this.hubService.startGameObservable.subscribe(()=>{
      this.router.navigate(["/game"])
    })
   }

   ngOnInit(): void {
    // prevent page refresh
    window.addEventListener("beforeunload", function (e) {
        var confirmationMessage = "if you refresh you will leave the game ";
        e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
        return confirmationMessage;              // Gecko, WebKit, Chrome <34
    });
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
