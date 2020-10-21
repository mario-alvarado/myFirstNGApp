import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { AppStore, AppState } from './app.store';
import { AppModel } from './app.model';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AppQuery extends QueryEntity<AppState, AppModel> {
    model$ = this.selectFirst();

    constructor(protected store: AppStore) {
        super(store);
    }

    getCountryCounter() {
        let countriesOrderedByPostedTweets = this.model$.pipe(map((model) => {
            if (model.tweetsPerCountry.length > 0) {
                var orderedList = model.tweetsPerCountry.slice().sort((a, b) => {
                    if (a.counter > b.counter) {
                        return -1;
                    }
                    if (a.counter < b.counter) {
                        return 1;
                    }
                    return 0;
                });
                return orderedList.slice(0, 3);
            }
            return model.tweetsPerCountry;
        }));
        return countriesOrderedByPostedTweets;
    }
    
    getFilter() {
        return this.select(state => state.name);
    }
}
