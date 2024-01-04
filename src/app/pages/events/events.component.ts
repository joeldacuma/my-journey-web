import { Component, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { catchError, lastValueFrom, map } from "rxjs";

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
    // this.agendaService.getEventsByPage(2, {})
    // .subscribe((data) => {
    //   console.log(data);
    // })
    this.getEvents();
  }

  getEvents() {
    this.agendaService.getEventsByPage(2, {})
    .subscribe((data: any) => {
      return data;
    }, error => {
      return error;
    })
  }
}
