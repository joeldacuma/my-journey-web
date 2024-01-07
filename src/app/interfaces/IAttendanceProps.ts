import { IEventProps } from './IEventsProps';

export interface IAttendanceProps {
  id: number;
  eventId: number;
  eventSectionId: number;
  memberId: number;
  dateTimeLogged: string;
  dateCreated: string;
  createdBy: string;
  dateModified: string;
  modifiedBy: string;
  event: IEventProps;
  member: {},
  firstTimer: {}
}

export interface IAttendanceEventProps {
  name: string;
  memberId: number;
  dateTimeLogged: string;
}