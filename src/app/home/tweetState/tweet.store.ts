import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Tweet } from './tweet.model';

export interface TweetState extends EntityState<Tweet> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dataStreams' })
export class TweetStore extends EntityStore<TweetState, Tweet> {

  constructor() {
    super();
  }
}