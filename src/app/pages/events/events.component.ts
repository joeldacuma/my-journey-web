import { Component, inject, signal, WritableSignal, effect, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { IEventProps } from '@interfaces/index';
import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';

import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Paginator } from 'primeng/paginator';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  providers:[
    MessageService
   ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  @ViewChild('paginator', {static: false}) paginator?: Paginator;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  public selectedEvents: IEventProps[] = [];
  public loading = signal(true);
  public events = signal({
    events: []
  });
  public pager = signal({
   page: 1,
   totalRows: 0,
   pageSize: 100
  });

  ngOnInit() {
    this.initializeEventTable();
  }

  initializeEventTable() {
    this.getEvents(1)
    .then((result) => {
      this.events.set(result);
      this.pager.set({
        page: 1,
        totalRows: result.pager.totalItems,
        pageSize: result.pager.pageSize
      });
      this.loading.set(false);
  });
  };

  async getEvents(pageNumber: number) {
    const eventData = await lastValueFrom(
      this.agendaService.getEventsByPage(pageNumber, {}).pipe(
        map((result: IEventProps) => {
          return result;
        })
    )).catch((error) => error);

    return eventData;
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
                summary: 'Delete Events',
                detail: 'Selected events had been removed.'
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

  constructor() {
    effect(() => {
      this.events();
      this.pager();
    });
  }
}
