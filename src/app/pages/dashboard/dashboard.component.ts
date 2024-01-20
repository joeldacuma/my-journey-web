import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";

import { PrimengModule } from '@modules/index';

import { AgendaService } from '@api/index';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private agendaService = inject(AgendaService);
  public dashboardData = signal({
    totalEvents: 0,
    totalMembers: 0,
    totalLocations: 0,
    latestAttendeesCount: 0,
    latestEventLocation: '',
    latestEvent: '',
    membersActive: 0,
    membersInactive: 0,
    latestLocation: ''
  });
  public loading = signal(true);

  initData() {
    const _PROCESSES = [
      this.getEvents({}),
      this.getMembers({}),
      this.getLocations({})
    ];

    Promise.all(_PROCESSES).then(
    (result: any) => {
      const events = result[0];
      const members = result[1];
      const locations = result[2];

      const totalEvents = events.length;
      const latestEvent = events[0].name;
      const latestAttendeesCount = events[0].attendance;
      const latestEventLocation = events[0].location;
      const totalMembers = members.length;
      const totalLocations = locations.length;

      const membersActive = members.filter((member: any) => member.isActive === true);
      const membersInactive = members.filter((member: any) => member.isActive === false);

      this.dashboardData.set({
        totalEvents,
        latestEvent,
        latestEventLocation,
        latestAttendeesCount,
        membersActive: membersActive.length,
        membersInactive: membersInactive.length,
        latestLocation: '',
        totalMembers,
        totalLocations
      });

      this.loading.set(false);
    });
  }

  async getEvents(body: Object) {
    const events = await lastValueFrom(
      this.agendaService.getEvents(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return events;
  }

  async getMembers(body: Object) {
    const members = await lastValueFrom(
      this.agendaService.getMembers(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);
    
    return members;
  };

  async getLocations(body: Object) {
    const locations = await lastValueFrom(
      this.agendaService.getEventLocations(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);
    
    return locations;
  }

  constructor() {
    this.initData();
    effect(() => {
      this.dashboardData();
      this.loading();
    });
  }
}
