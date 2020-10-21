import { Injectable } from '@angular/core';
import { AppStore } from './app.store';
import { AppModel, CountryCounter } from './app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private appStore: AppStore) { }

  setCount(tweetsCount, tweetCountry) {
    let model = this.appStore.getValue().entities[1];
    let index = model.tweetsPerCountry.findIndex(x => x.id === tweetCountry);
    let tweetsPerCountryTmp = model.tweetsPerCountry.slice();
    if (index === -1) {
      let counter: CountryCounter = { id: tweetCountry, counter: 1 };
      tweetsPerCountryTmp = [...model.tweetsPerCountry, counter];
    } else {
      tweetsPerCountryTmp = Object.assign([], model.tweetsPerCountry, { [index]: { id: tweetCountry, counter: model.tweetsPerCountry[index].counter + 1 } });
    }
    this.appStore.upsert(1, { tweetsCount: tweetsCount, tweetsPerCountry: tweetsPerCountryTmp })
  }

  getLastMinuteAverage(lastMinuteTweetsCount) {
    let model = this.appStore.getValue().entities[1];
    let newArray = [...model.tweetsPerMinuteArray, lastMinuteTweetsCount];
    var sum = newArray.reduce(function (a, b) {
      return a + b;
    }, 0);
    let average = (sum / newArray.length);
    this.appStore.upsert(1, { tweetsPerMinuteArray: newArray, tweetsPerMinuteAverage: average });
  }

  setInitialState() {
    let initialModel: AppModel = {
      id: 1,
      tweetsCount: 0,
      tweetsPerCountry: [] as CountryCounter[],
      tweetsPerMinuteArray: [] as number[],
      tweetsPerMinuteAverage: 0
    }
    this.appStore.set({ 1: initialModel });
  }
}
