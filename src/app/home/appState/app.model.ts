import { ID } from '@datorama/akita';

export type AppModel = {
  id: ID;
  tweetsCount: number,
  tweetsPerMinuteArray: number[],
  tweetsPerMinuteAverage: number,
  tweetsPerCountry: CountryCounter[]
}

export type CountryCounter = {
  id: string,
  counter: number
}