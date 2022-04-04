import { AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from './models/message.model';
import { User } from './models/user.model';
import { HubService } from './services/hub.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy,AfterViewChecked{
  title = 'autobus-complete';
  
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | undefined;

  allUsers:User[]=[]
  messages:Message[]=[]
  unReadMessages:boolean = false;

  usersSub:Subscription = new Subscription();
  messageSub:Subscription = new Subscription();

  constructor(private hubService:HubService){
    this.usersSub = this.hubService.usersObservable.subscribe(res=>{
      this.allUsers = res
    })
    
   this.messageSub = this.hubService.chatMessagesObservable.subscribe(res =>{
      this.messages = res;
      this.unReadMessages = true;
    })
  }

  updateLeaderboard(){
    this.hubService.hubConnection.invoke("GetAllUsers");
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom(); 
  }
  scrollToBottom(): void {
    try {
      if(this.myScrollContainer){
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }                 
}

sendMessage(messageText:string){
  if(messageText == "") return
  this.hubService.sendMessage(messageText)
}

get newUnReadMessages(){
  if(this.messages[this.messages.length-1].mine){
    return false
  }
  return true
}
  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
    this.messageSub.unsubscribe();
  }
}
