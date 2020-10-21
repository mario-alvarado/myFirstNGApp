import { ID } from '@datorama/akita';

export type Tweet = {
  id: ID;
  country: string;
  author: string;
  username: string;
  text: string;
  profile_url: string;
};

