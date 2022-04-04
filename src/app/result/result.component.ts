import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Marks } from '../models/marks.model';
import { User } from '../models/user.model';
import { HubService } from '../services/hub.service';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnDestroy,OnInit {

  users:User[] = []
  categories:string[] = ["boy","girl","inanimate","animal","plant","country"];
  marks:Marks = new Marks();
  
  
  usersSub:Subscription = new Subscription();
  constructor(private hubService:HubService,private router:Router,private Location: LocationStrategy) {

    // disable the browser’s back button
    history.pushState(null, '', window.location.href);
    this.Location.onPopState(() => {
    history.pushState(null, '', window.location.href);
    });


    this.hubService.hubConnection.invoke("GetAllUsers");
   this.usersSub =  this.hubService.usersObservable.subscribe(res =>{
      this.users = res
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

   saveScore(){
     this.hubService.setScore(this.marks.totalmark())
     this.router.navigate(["/game"])
   }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  

}
