import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { TweetStore, TweetState } from './tweet.store';
import { Tweet } from "./tweet.model";
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class TweetQuery extends QueryEntity<TweetState, Tweet> {
    tweets$ = this.selectAll();
    private filter: string = "";

    constructor(protected store: TweetStore) {
        super(store);
    }

    filterTweets() {
        let filteredTweets = this.tweets$.pipe(map((tweets) => {
            if (this.filter) {
                tweets = tweets.filter(y => {
                    return y.text.includes(this.filter);
                });
            }
            return tweets.slice(Math.max(tweets.length - 100, 1));
        }));

        return filteredTweets;
    }

    setFilter(text) {
        this.filter = text;
    }
}
