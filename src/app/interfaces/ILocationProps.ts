import { IEventProps } from './IEventsProps';

export interface ILocationProps {
  id: number;
  name: string;
  address: string;
  remarks: string;
  dateTimeCreated: string;
  createdBy: string;
  dateTimeModified: string;
  modifiedBy: string;
  communityId: number;
  event: [IEventProps];
  eventCategoryReport: [];
  eventSection: []
};