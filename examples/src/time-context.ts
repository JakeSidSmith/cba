import { createContext } from 'cba';

export interface TimeProps {
  time: string;
}

export const TimeContext = createContext<TimeProps>({time: new Date().toString()});
