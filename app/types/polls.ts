import type { CalendarDate, Time } from '@internationalized/date';
import type { Raw } from 'vue';

export interface PollOption {
  text: string;
  date: Raw<CalendarDate> | null;
  time: Raw<Time> | null;
}

export interface PollCreationState {
  title: string;
  description: string;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  isAnonymous: boolean;
  optionType: 'TEXT' | 'DATE';
  options: PollOption[];
}

export interface PollOptionData {
  id: string;
  pollId: string;
  creatorName: string;
  content: string;
}

export interface PollVotesData {
  value: string;
  count: number;
  voters: string[];
  rank: number;
}

export type PollData = {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  creatorName: string;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  optionType: string;
  status: string;
  isClosed: boolean;
  options: PollOptionData[];
};

export type PollResultData = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  creatorName: string;
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  optionType: string;
  status: string;
  isClosed: boolean;
  totalVotes: number;
  votes: PollVotesData[];
};
