import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Answer } from '../models/answer.model';
import { HubService } from '../services/hub.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnDestroy {

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

  constructor(private formBuilder:FormBuilder,private hubSerivce:HubService,private router:Router) {

   this.autobusSub =  this.hubSerivce.autobusObservable.subscribe(()=>{
      this.answers = this.answersForm.value;
      this.hubSerivce.setAnswers(this.answers)
      this.router.navigate(["/result"])
      this.answersForm.reset();
    })
   }
  

  

  autobusComplete(){
    this.hubSerivce.hubConnection.invoke("AutobusComplete")
  }

  ngOnDestroy(): void {
    this.autobusSub.unsubscribe();
  }
}
