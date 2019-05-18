import { MatchFoundSubscription } from './../types';
import { FindUserByIdGQL, MatchFoundGQL, JoinGameGQL } from '@app/types';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubscriptionResult } from 'apollo-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private matchFoundGQL: MatchFoundGQL,
    private joinGameGQL: JoinGameGQL
  ) {}

  ngOnInit() {}

  queue(userId: string) {
    const matchFound = this.matchFoundGQL
      .subscribe({ userId }) // when variables match args, return values
      .subscribe((result: SubscriptionResult<MatchFoundSubscription>) => {
        console.log(result);
        matchFound.unsubscribe();
        this.router.navigate(['/game', result.data.matchFound.id]);
      });

    // just getting the state of the queue,
    // so it's slightly insignificant to track its results
    this.joinGameGQL
      .mutate({
        userId
      })
      .subscribe(res => console.log(res));
  }
}
