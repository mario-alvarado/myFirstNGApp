import { Injectable } from '@angular/core';
import { TweetStore } from './tweet.store';
import { timer } from 'rxjs';
import { mapTo } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TweetService {
  constructor(private appStore: TweetStore) { }

  setTweets(tweets) {
    this.appStore.set(tweets);
  }

}
