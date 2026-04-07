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
