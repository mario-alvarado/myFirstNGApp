import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { AppModel } from './app.model';

export interface AppState extends EntityState<AppModel> { }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'dataStreams' })
export class AppStore extends EntityStore<AppState, AppModel> {

  constructor() {
    super();
  }

}