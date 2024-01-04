import { IEventProps } from './IEventsProps';

export interface IRsvpProps {
  eventId: number;
  memberId: number;
  isGoing: boolean;
  dateCreated: string;
  dateModified: string;
  event: IEventProps;
  member: {};    
}