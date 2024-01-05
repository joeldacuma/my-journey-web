import { Component, inject, signal, WritableSignal, effect } from '@angular/core';
import { CommonModule } from "@angular/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { IEventProps } from '@interfaces/index';

import { PrimengModule } from '@modules/index';

import { AgendaService } from '@api/index';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  private agendaService = inject(AgendaService);
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

  async nextPage(event: any) {
    this.loading.update(() => true);
    await this.getEvents(event.page + 1)
          .then((result) => {
            this.events.update(() => result);
            this.loading.update(() => false);
          });
  }

  constructor() {
    effect(() => {
      this.events();
    });
  }
}
