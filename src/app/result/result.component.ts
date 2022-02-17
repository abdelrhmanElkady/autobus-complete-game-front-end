import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Marks } from '../models/marks.model';
import { User } from '../models/user.model';
import { HubService } from '../services/hub.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnDestroy {

  users:User[] = []
  categories:string[] = ["boy","girl","inanimate","animal","plant","country"];
  marks:Marks = new Marks();
  
  
  usersSub:Subscription = new Subscription();
  constructor(private hubService:HubService,private router:Router) {
    this.hubService.hubConnection.invoke("GetAllUsers");
   this.usersSub =  this.hubService.usersObservable.subscribe(res =>{
      this.users = res
    })

    console.log()
   }
   saveScore(){
     this.hubService.setScore(this.marks.totalmark())
     this.router.navigate(["/game"])
   }

  ngOnDestroy(): void {
    this.usersSub.unsubscribe();
  }

  

}
