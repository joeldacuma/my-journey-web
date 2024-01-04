import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { catchError, lastValueFrom, map } from "rxjs";
import { IEventProps } from '@interfaces/index';

import { AgendaService } from '@api/index';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  private agendaService = inject(AgendaService);

  ngOnInit() {
    this.getEvents();
  }

  async getEvents() {
    const eventData = await lastValueFrom(
      this.agendaService.getEventsByPage(1, {}).pipe(
        map((result: IEventProps) => result)
    )).catch((error) => error);

  }
}
