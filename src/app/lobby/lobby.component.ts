import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { HubService } from '../services/hub.service';
import {LocationStrategy} from '@angular/common';
import { Group } from '../models/group.model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnDestroy ,OnInit {

  createRoomForm = this.formBuilder.group({
    roomName:[''],
    ownerName:[''],
   
  })

  allUsers:User[]=[];
  allGroups:Group[] = [];
  currentRoom:string = '';
  currentUser:User = new User();
  

  usersSub:Subscription = new Subscription();
  groupsSub:Subscription = new Subscription();
  startGameSub:Subscription = new Subscription();
  currentUserSub:Subscription = new Subscription();

  
  constructor(private formBuilder:FormBuilder,private hubService:HubService,private router:Router,private Location: LocationStrategy) {

    // disable the browser’s back button
    history.pushState(null, '', window.location.href);
    this.Location.onPopState(() => {
    history.pushState(null, '', window.location.href);
    });


    this.usersSub = this.hubService.usersObservable.subscribe(res=>{
      this.allUsers = res
    })

    this.currentUserSub = this.hubService.currentUserObservable.subscribe((res)=>{
      this.currentUser = res
    })

    this.groupsSub = this.hubService.groupsObservable.subscribe(res=>{
      this.allGroups = res
    })

    this.startGameSub = this.hubService.startGameObservable.subscribe(()=>{
      this.router.navigate(["/game"])
    })

    
   }

   ngOnInit(): void {
    // prevent page refresh //------------ uncomment this when publishing -----------------------------------------
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

   startGame(room:Group){
     if(room.users.length<2){
       alert("should be two players at least")
       return
     }

     this.hubService.hubConnection.invoke("StartGame")
     
     
   }

   createRoom(){
    if(this.createRoomForm.controls['roomName'].value == "" || this.createRoomForm.controls['ownerName'].value == "") return
    if(this.allGroups.find(x => x.name == this.createRoomForm.controls['roomName'].value)) return 
    this.hubService.hubConnection.invoke("AddGroup",this.createRoomForm.controls['roomName'].value,this.createRoomForm.controls['ownerName'].value)
    document.getElementById("closeModalButton")?.click();
    this.createRoomForm.reset()
   }

   setCurrentRoom(roomName:string){
    this.currentRoom = roomName;
   }

   joinRoom(userName:string){
    this.hubService.hubConnection.invoke("JoinRoom",this.currentRoom,userName)
    document.getElementById("closeJoinModalButton")?.click();
   }

   

   showElement(roomUsers:User[]){
     try {
      return roomUsers.some(e =>e.connectionId == this.currentUser.connectionId)
     } catch (error) {
       return false
     }
   }
   ngOnDestroy(): void {
    this.usersSub.unsubscribe()
    this.startGameSub.unsubscribe()
    this.groupsSub.unsubscribe()
  }
}
