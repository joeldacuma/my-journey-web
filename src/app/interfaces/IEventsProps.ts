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

export interface IEventGroupProps {
  eventId: number;
  groupId: number;
  event: IEventProps;
  group: {};
}

export interface IEventCategoryProps {
  id: string;
  name: string;
  description: string;
  allowMemberToLogOnMultipleEvents: boolean;
  allowSectionOverlapping: boolean;
  dateTimeCreated: string;
  createdBy: string;
  dateTimeModified: string;
  modifiedBy: string;
  communityId: number;
  event: [IEventProps];
  eventCategoryReport: [IEventCategoryReportProps];
  eventSection: [IEventSectionProps];
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