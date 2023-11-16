interface DubAPI {
  allUsers: { [key: string]: DerpyUser };
  log: (type: 'error' | 'info', name: string, message: string) => void;
  leaderboard: { [key: string]: LeaderboardEntry };
  sendChat: (message: string) => void;
  on: (event: string, callback: (data: any) => void) => void;
  events: { [key:string]: string };
  moderateSkip: (cb: () => void) => void;
  getDJ: () => DubAPIUser;
}

interface DubAPIUser {
  username: string;
}

interface DerpyUser {
  DateAdded: string;
  LastConnected: number;
  flow: number;
  id: number;
  introduced: boolean;
  isPlugDJ: boolean;
  logType: string;
  pp: number;
  props: number;
  username: string;
}

interface LeaderboardEntry {
  flow: string;
  flowObj: { [key: string]: number };
  month: string;
  props: string;
  propsObj: { [key: string]: number };
  year: string;
}

interface Trigger {
  // the oldest version of triggers only had these 3 properties
  Author: string
  Returns: string;
  Trigger: string;

  createdBy?: string;
  createdOn?: number;
  status?: string;
  givesProp?: boolean;
  lastUpdated?: number;
  propsEmoji?: string;
  givesFlow?: boolean;
  flowEmoji?: string;
}