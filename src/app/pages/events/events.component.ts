import { Component, inject, signal, effect, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";
import moment from 'moment';
import { IEventProps,
         IGuestAttendanceProps,
         IAttendanceEventProps,
         IEventCategoryProps, 
         IEventLocationProps,
         ICreateEventProps } from '@interfaces/index';
import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { DELETE_EVENT_SUCCESS_TITLE, 
         DELETE_EVENT_SUCESS_DETAILS, 
         ERROR_CREATE_EVENT_TITLE, 
         ERROR_CREATE_EVENT_DETAILS,
         SUCCESS_CREATE_EVENT_TITLE,
         SUCCESS_CREATE_EVENT_DETAILS,
         ERROR_CREATE_GUEST_TITLE,
         ERROR_CREATE_GUEST_DETAILS,
         SUCCESS_CREATE_GUEST_TITLE,
         SUCCESS_CREATE_GUEST_DETAILS,
         ERROR_GENERIC_TITLE,
         ERROR_GENERIC_DETAILS,
         GENDER_SELECTION } from '@constants/index';
import { EventForm, GuestForm } from '@forms/index';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[
    MessageService
   ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  @ViewChild('paginator', {static: false}) paginator?: Paginator;
  @ViewChild('opEvent', {static: false}) opEvent?: OverlayPanel;
  @ViewChild('guestForm', {static: false}) guestForm?: OverlayPanel;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  public selectedEvents: IEventProps[] = [];
  public loading = signal(true);
  public loadingAttendance = signal(true);
  public eventFormGroup = new FormGroup<ICreateEventProps>(EventForm);
  public guestFormGroup = new FormGroup<IGuestAttendanceProps>(GuestForm);
  public metaKeySelection: boolean = true;
  public isDialogAttendance = false;
  public attendanceCount = 0;
  public diaLogAttendance = signal({
    id: 0,
    name: '',
    attendance: 0
  });
  public events = signal({
    events: [],
    categories: [] || null,
    locations: [],
    pager: {}
  });
  public pager = signal({
   page: 1,
   totalRows: 0,
   pageSize: 100
  });
  public attendancePager = signal({
    page: 1,
    totalRows: 0,
    pageSize: 100
  });
  public attendanceEvents = signal({
    registrants: [],
    pager: {}
  });

  public searchAttendanceName: string = '';
  public genderSelection = GENDER_SELECTION;

  public selectedCategory: any; // To change
  public selectedLocation: any; // To change
  public selectedMembers: any; // To change

  ngOnInit() {
    this.initData();
  }

  initData() {
    const _PROCESS = [
      this.getEvents(1),
      this.getEventCategories(),
      this.getEventLocations(),
    ];

    Promise.all(_PROCESS)
    .then((results) => {
      const events = results[0];
      const categories = results[1];
      const locations = results[2];
      this.events.set({...events, categories, locations});
      this.pager.set({
        page: 1,
        totalRows: events.pager.totalItems,
        pageSize: events.pager.pageSize
      });

      this.loading.set(false);
      this.loadingAttendance.set(false);
    });
  }

  async getEvents(pageNumber: number) {
    const eventData = await lastValueFrom(
      this.agendaService.getEventsByPage(pageNumber, {}).pipe(
        map((result: IEventProps) => {
          return result;
        })
    )).catch((error) => error);

    return eventData;
  }

  async getEventCategories() {
    const eventCategories = await lastValueFrom(
      this.agendaService.getEventCategories({}).pipe(
        map((result: IEventCategoryProps) => {
          return result;
        })
      )
    ).catch((error) => error);

    return eventCategories;
  };

  async getEventLocations() {
    const eventLocations = await lastValueFrom(
      this.agendaService.getEventLocations({}).pipe(
        map((result: IEventLocationProps) => {
          return result;
        })
      )
    ).catch((error) => error);

    return eventLocations;
  }

  async getEventAttendance(id: number, page: number, body: any) {
    const eventAttendance = await lastValueFrom(
      this.agendaService.getEventAttendanceByPage(id, page, body).pipe(
        map((result: IAttendanceEventProps) => {
          return result;
        })
      )
    ).catch((error) => error);

    return eventAttendance;
  }

  async createNewEvent(body: Object) {
   const newEvent = await lastValueFrom(
    this.agendaService.createEvent(body).pipe(
      map((result: number) => {
        return result;
      })
      )
   )
   return newEvent;
  }

  async createMember(body: Object) {
    const newMember = await lastValueFrom(
      this.agendaService.addMember(body).pipe(
        map((result: number) => {
          return result;
        })
        )
     )
     return newMember;
  }

  async nextPage(event: any) {
    this.loading.update(() => true);
    await this.getEvents(event.page + 1)
          .then((result) => {
            this.events.update(() => result);
            this.loading.update(() => false);
          });
  }

  async nextPageAttendance(event: any) {
    this.loadingAttendance.update(() => true);
    await this.getEventAttendance(this.diaLogAttendance().id, event.page + 1, {})
          .then((result) => {
            this.attendanceEvents.update(() => result);
            this.loadingAttendance.update(() => false);
          });
  };

  async clearFilter(table: Table) {
    table.clear();
    if (this.searchAttendanceName) {
      this.loadingAttendance.update(() => true);
      this.searchAttendanceName = '';
      const attendanceMembers = await this.getEventAttendance(
        this.diaLogAttendance().id, 1,{});
    
      this.attendanceEvents.set({...attendanceMembers});
      if (attendanceMembers) {
        this.attendancePager.set({
          page: 1,
          totalRows: attendanceMembers.pager.totalItems,
          pageSize: attendanceMembers.pager.pageSize
        });
  
        this.loadingAttendance.update(() => false);
      }
    }
  }

  async deleteEvents() {
    if (this.selectedEvents.length === 0) {
      return;
    }

    this.loading.update(() => true);
    const selectedEvents: any = this.selectedEvents;
    const eventIds: Array<any> = [];
    selectedEvents.forEach((event: IEventProps) => {
      eventIds.push(event.id.toString());
    });

    const deletedEvents = await lastValueFrom(
      this.agendaService.deleteEvents(eventIds)
         .pipe(
            map((result) => {
              this.messageService.add({
                key: 'event',
                severity:'info',
                summary: DELETE_EVENT_SUCCESS_TITLE,
                detail: DELETE_EVENT_SUCESS_DETAILS
                });
              return result;
            })
          )
      ).catch((error) => error);

      if (deletedEvents) {
        setTimeout(() => { 
          this.getEvents(1)
          .then((result) => {
            this.events.update(() => result);
            this.paginator?.changePage(0);
            this.loading.update(() => false);
            this.selectedEvents = [];
          });
        }, 500);
      }
  }

  async createEvent() {
    this.loading.update(() => true);
    if (!this.eventFormGroup.valid) {
      this.messageService.add({
        key: 'event',
        severity:'error',
        summary: ERROR_CREATE_EVENT_TITLE,
        detail: ERROR_CREATE_EVENT_DETAILS
        });
      
      this.loading.update(() => false);
      return;
    }

    const newEventForm: any = this.eventFormGroup.value;
    const body = {
      dateTimeStart: newEventForm.dateTimeStart,
      eventCategoryId: newEventForm.eventCategory.id.toString(),
      locationId: newEventForm.location.id.toString(),
      name: newEventForm.name
    };

    await this.createNewEvent(body)
    .then((result: number) => {
      if (result) {
        this.messageService.add({
          key: 'event',
          severity:'info',
          summary: SUCCESS_CREATE_EVENT_TITLE,
          detail: SUCCESS_CREATE_EVENT_DETAILS
          });
          
          this.initData();
          this.opEvent?.hide();
      }
    }).catch((error) => error);
  }

  async showAttendance(event: any) {
    this.loadingAttendance.update(() => true);
    this.diaLogAttendance.set({
      id: event.id,
      name: event.name,
      attendance: event.attendance
    });
    this.attendanceCount = event.attendance;
    this.isDialogAttendance = true;

    const attendanceMembers = await this.getEventAttendance(event.id, 1, {});
    this.attendanceEvents.set({...attendanceMembers});
    if (attendanceMembers) {
      this.attendancePager.set({
        page: 1,
        totalRows: attendanceMembers.pager.totalItems,
        pageSize: attendanceMembers.pager.pageSize
      });

      this.loadingAttendance.update(() => false);
    }
  }

  async tagAttendedToEvent(selected: any) {
    this.attendanceCount = this.attendanceCount + 1;
    selected.dateTimeLogged = moment(new Date()).format('MM/DD/YYYY, h:mm:ss a');
    const body = {
      dateTimeLogged: selected.dateTimeLogged,
      memberId: selected.memberId
    };
    const tagAttended = await lastValueFrom(
      this.agendaService.tagAttendedToEvent(this.diaLogAttendance().id, body).pipe(
        map((result: number) => {
          return result;
        })
      )).catch((error) => error);
  }

  async onClickMemberAttendance(selected: any) {
    if (!selected.dateTimeLogged) {
      this.tagAttendedToEvent(selected);
    } else {
      this.attendanceCount = this.attendanceCount - 1;
      selected.dateTimeLogged = null; 
      const body = {
        memberId: selected.memberId
      };     
      const untagAttended = await lastValueFrom(
        this.agendaService.removeTagAttendedToEvent(this.diaLogAttendance().id, body).pipe(
          map((result: number) => {
            return result;
          })
        )).catch((error) => error); 
    }
  }

  async globalAttendanceFilter() {
    this.loadingAttendance.update(() => true);
    const attendanceMembers = await this.getEventAttendance(
      this.diaLogAttendance().id, 1, (this.searchAttendanceName) ? `"${this.searchAttendanceName}"` : {}
    );
  
    this.attendanceEvents.set({...attendanceMembers});
    if (attendanceMembers) {
      this.attendancePager.set({
        page: 1,
        totalRows: attendanceMembers.pager.totalItems,
        pageSize: attendanceMembers.pager.pageSize
      });

      this.loadingAttendance.update(() => false);
    }
  }

  async createGuest() {
    this.loadingAttendance.update(() => true);
    if (!this.guestFormGroup.valid) {
      this.messageService.add({
        key: 'guest',
        severity:'error',
        summary: ERROR_CREATE_GUEST_TITLE,
        detail: ERROR_CREATE_GUEST_DETAILS
        });
        this.loadingAttendance.update(() => false);
      return;
    }

    this.guestForm?.hide();
    const guestValue:any = this.guestFormGroup.value;
    const body = {
      name: guestValue.name,
      nickName: guestValue.nickName,
      birthDate: guestValue.birthDate,
      email: guestValue.email,
      address: guestValue.address,
      gender: guestValue.gender.id.toString(),
      mobile: guestValue.mobile,
      remarks: guestValue.remarks,
      invtedBy: guestValue.invtedBy,
    }

    const member = await this.createMember(body)
          .then((result: any) => {
            if (result) {
              this.messageService.add({
                key: 'guest',
                severity:'info',
                summary: SUCCESS_CREATE_GUEST_TITLE,
                detail: SUCCESS_CREATE_GUEST_DETAILS
                });

                this.guestFormGroup.reset();
                this.loadingAttendance.update(() => false);
              
             return result;
            }
          })
          .catch((error) => {
            this.messageService.add({
              key: 'guest',
              severity:'error',
              summary: ERROR_GENERIC_TITLE,
              detail: ERROR_GENERIC_DETAILS
              });

              this.loadingAttendance.update(() => false);
              return error;
          });
    const _member = {
      dateTimeLogged: '',
      memberId: member
    };
    this.tagAttendedToEvent(_member);
  }

  constructor() {
    this.eventFormGroup = this.formBuilder.group(EventForm);
    this.guestFormGroup = this.formBuilder.group(GuestForm);
    effect(() => {
      this.events();
      this.pager();
      this.attendanceEvents();
    });
  }
}
