import { IEventProps } from './IEventsProps';
import { FormControl } from '@angular/forms';

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

export interface IGuestAttendanceProps {
  name: FormControl<string | null>;
  address: FormControl<string| null>;
  birthDate: FormControl<string | null>;
  email: FormControl<string | null>;
  gender: FormControl<string | null>;
  invitedByMemberName: FormControl<string | null>;
  mobile: FormControl<string | null>;
  nickName: FormControl<string | null>;
  remarks: FormControl<string | null>;
}