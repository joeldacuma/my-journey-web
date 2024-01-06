import { ILocationProps } from './ILocationProps';
import { IAttendanceProps } from './IAttendanceProps';
import { IRegistrantsProps } from './IRegistrantsProps';
import { IRsvpProps } from './IRsvpProps';

export interface IEventProps {
  id: number;
  locationId: number;
  name: string;
  eventCategoryId: number;
  description: string;
  dateTimeStart: string;
  dateTimeEnd: string;
  recurrenceId: number;
  allowRegistration: boolean;
  isExclusive: boolean;
  isActive: boolean;
  dateTimeCreated: string;
  createdBy: string;
  dateTimeModified: string;
  modifiedBy: string;
  eventCategory: IEventCategoryProps;
  location: ILocationProps;
  attendance: [IAttendanceProps];
  eventGroup: [IEventGroupProps];
  registrant: [IRegistrantsProps];
  rsvp: [IRsvpProps];
};

export interface ICreateEventProps {
  name: string;
  dateTimeStart: string;
  eventCategoryId: number;
  locationId: number;
};

export interface IEventGroupProps {
  eventId: number;
  groupId: number;
  event: IEventProps;
  group: {};
}

export interface IEventCategoryProps {
  id: number;
  name: string;
  events: number;
  minAttendees: number;
  averageAttendees: number;
  maxAttendees: number;
};

export interface IEventLocationProps {
  id: number;
  name: string;
  address: string;
  events: number;
  minAttendees: number;
  averageAttendees: number;
  maxAttendees: number;
};

export interface IEventCategoryReportProps {
  eventCategoryId: number;
  reportId: number;
  eventCategory: IEventCategoryProps;
  report: {};  
};

export interface IEventSectionProps {
  id: number;
  name: string;
  eventCategoryId: number;
  description: string;
  dateTimeCreated: string;
  createdBy: string;
  dateTimeModified: string;
  modifiedBy: string;
  eventCategory: IEventCategoryProps;
};