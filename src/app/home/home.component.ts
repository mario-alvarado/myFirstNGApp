import { TweetService } from './tweetState/tweet.service';
import { AppService } from './appState/app.service';
import { Tweet } from './tweetState/tweet.model';
import { AppModel, CountryCounter } from './appState/app.model'
import { TweetQuery } from './tweetState/tweet.query';
import { AppQuery } from './appState/app.query';
import { Component, OnInit } from '@angular/core';
import { Observable, timer } from 'rxjs';
import PubNub from 'pubnub'

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  tweets$: Observable<Tweet[]>;
  selectLoading$: Observable<boolean>;
  appModel$: Observable<AppModel>;
  tweetsByCountry$: Observable<CountryCounter[]>
  filter$: Observable<string>;
  private pubnub: PubNub;
  private readonly subscribe_key: string = 'sub-c-78806dd4-42a6-11e4-aed8-02ee2ddab7fe'
  private readonly channel: string[] = ['pubnub-twitter'];

  constructor(
    private appQuery: AppQuery,
    private appService: AppService,
    private tweetService: TweetService,
    private tweetQuery: TweetQuery,

  ) { }

  ngOnInit() {
    this.pubnub = new PubNub({
      subscribeKey: this.subscribe_key
    });
    this.startLoading();
  }

  startLoading() {
    this.appService.setInitialState();
    this.tweets$ = this.tweetQuery.filterTweets();
    this.tweetsByCountry$ = this.appQuery.getCountryCounter();
    this.appModel$ = this.appQuery.selectFirst();
    this.filter$ = this.appQuery.getFilter();
    let self = this;
    let tweetsCount = 0, tweetsCountPerMinute = 0;
    let counting = true;
    let tweets: Array<Tweet> = [];

    //Subscribe to the channel, here I start getting tweets from PubNub
    this.pubnub.subscribe({
      channels: this.channel
    });

    //Now I'm gonna the listener so I can start mapping the incoming tweets
    this.pubnub.addListener({
      message: function ({ message }) {
        const tweetObject: Tweet = {
          id: message.id,
          author: message.user.name,
          text: message.text,
          profile_url: message.user.profile_image_url_https,
          country: message.place ? message.place.country || "" : "",
          username: message.user.screen_name
        };
        tweets = [...tweets, tweetObject]
        tweetsCount++;
        tweetsCountPerMinute++;

        self.setTweets(tweets);
        self.setCount(tweetsCount, tweetObject.country);

        if (counting) {
          timer(60000).subscribe(x => {
            counting = true;
            self.getLastMinuteAverage(tweetsCountPerMinute);
            tweetsCountPerMinute = 0;
          });
        }
        counting = false;
      }
    });
  }

  stopLoading() {
    this.pubnub.unsubscribe({
      channels: this.channel
    });
  }

  setTweets(tweets) {
    this.tweetService.setTweets(tweets);
  }

  setFilter(text) {
    this.tweetQuery.setFilter(text);
  }

  setCount(tweetsCount, tweetCountry) {
    this.appService.setCount(tweetsCount, tweetCountry);
  }

  getLastMinuteAverage(tweetsCount) {
    this.appService.getLastMinuteAverage(tweetsCount);
  }
}
