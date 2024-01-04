import { IEventProps } from './IEventsProps';

export interface IRegistrantsProps {
  id: number;
  eventId: number;
  groupId: number;
  memberId: number;
  dateCreated: string;
  createdBy: string;
  event: IEventProps;
  member: {};  
};