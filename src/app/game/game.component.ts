import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Answer } from '../models/answer.model';
import { HubService } from '../services/hub.service';
import {LocationStrategy} from '@angular/common';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy,OnInit {

  answersForm = this.formBuilder.group({
    boy:[''],
    girl:[''],
    inanimate:[''],
    animal:[''],
    plant:[''],
    country:[''],
  })

  answers:Answer = new Answer();

  autobusSub:Subscription = new Subscription();

  constructor(private formBuilder:FormBuilder,private hubSerivce:HubService,private router:Router,private Location: LocationStrategy) {

    // disable the browser’s back button
    history.pushState(null, '', window.location.href);
    this.Location.onPopState(() => {
    history.pushState(null, '', window.location.href);
    });

   this.autobusSub =  this.hubSerivce.autobusObservable.subscribe(()=>{
      this.answers = this.answersForm.value;
      this.hubSerivce.setAnswers(this.answers)
      this.router.navigate(["/result"])
      this.answersForm.reset();
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
  

  autobusComplete(){
    this.hubSerivce.hubConnection.invoke("AutobusComplete")
  }

  ngOnDestroy(): void {
    this.autobusSub.unsubscribe();
  }
}
