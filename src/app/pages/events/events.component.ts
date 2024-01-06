import { Component, inject, signal, computed, effect, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { catchError, lastValueFrom, map } from "rxjs";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";
import { IEventProps, 
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
         SUCCESS_CREATE_EVENT_DETAILS } from '@constants/index';
import { EventForm } from '@forms/index';

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
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  public selectedEvents: IEventProps[] = [];
  public loading = signal(true);
  public eventFormGroup = new FormGroup<ICreateEventProps>(EventForm);
  public selectedCategory: any;
  public selectedLocation: any;

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

  ngOnInit() {
    this.initData();
  }

  initData() {
    const _PROCESS = [
      this.getEvents(1),
      this.getEventCategories(),
      this.getEventLocations()
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

  async nextPage(event: any) {
    this.loading.update(() => true);
    await this.getEvents(event.page + 1)
          .then((result) => {
            this.events.update(() => result);
            this.loading.update(() => false);
          });
  }

  clearFilter(table: Table) {
    table.clear();
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

  constructor() {
    this.eventFormGroup = this.formBuilder.group(EventForm);
    effect(() => {
      this.events();
      this.pager();
    });
  }
}
