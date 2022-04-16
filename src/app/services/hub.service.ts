import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr'; 
import { Subject } from 'rxjs';
import { Answer } from '../models/answer.model';
import { Group } from '../models/group.model';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root'
})
export class HubService {

  hubConnection:signalR.HubConnection = new signalR.HubConnectionBuilder()
    .configureLogging(signalR.LogLevel.Information)
    .withUrl("https://autobus-complete.herokuapp.com/GameHub"
    //  .withUrl("http://localhost:5076/GameHub"
    // , {
    //   skipNegotiation: true,
    //   transport: signalR.HttpTransportType.WebSockets
    // }
    )   // mapping to the chathub as in startup.cs
    .build();

    private users:User[]=[];
    private groups:Group[]=[];
    private roomUsers:User[]=[];
    private chatMessages:Message[] = [];
    currentUser:User = new User();

    usersObservable = new Subject<User[]>();
    groupsObservable = new Subject<Group[]>();
    roomUsersObservable = new Subject<User[]>();
    chatMessagesObservable = new Subject<Message[]>();
    startGameObservable = new Subject();
    autobusObservable = new Subject();
    
    currentUserObservable = new Subject<User>();

  constructor(private router:Router) { 

    this.hubConnection.start().then(()=> {
      console.log("connection started")
      this.hubConnection.invoke("GetAllUsers"); 
      this.hubConnection.invoke("GetAllGroups"); 
      this.hubConnection.invoke("GetCurrentUser");
      this.hubConnection.invoke("GetRoomUsers");
    });

    this.hubConnection.on("GetCurrentUser",(user:User)=>{
      this.currentUser = user;
      this.currentUserObservable.next(user)
    })

    this.hubConnection.on("GetAllUsers",(users:User[])=>{
      this.users = users;
      this.usersObservable.next(users)
    })

    this.hubConnection.on("GetAllGroups",(groups:Group[])=>{
      this.groups = groups;
      this.groupsObservable.next(this.groups)
    })

    this.hubConnection.on("RoomUsers",(users:User[])=>{
      this.roomUsers = users;
      this.roomUsersObservable.next(users)
    })

    this.hubConnection.on("StartGame",()=>{
      this.startGameObservable.next(null);
    })

    this.hubConnection.on("GoToLobby",()=>{
      this.router.navigate(["/lobby"])
    })

    this.hubConnection.on("AutobusComplete",()=>{
      this.autobusObservable.next(null)
    })

    this.hubConnection.on("ReceiveMessage", (user, message) => { 
      let tempMessage = new Message(user, message)
      if(user == this.currentUser.name){
        tempMessage.mine = true;
      }
      this.chatMessages.push(tempMessage)
      this.chatMessagesObservable.next(this.chatMessages)
    });
  }

  setAnswers(answer:Answer){
    this.hubConnection.invoke("SetResult",answer)
  }

  setScore(score:number){
    this.hubConnection.invoke("SetScore",score)
  }

  sendMessage(message:string){
    this.hubConnection
      .invoke('SendMessage', this.currentUser.name, message)
      .catch(err => console.error(err));
  }
}
