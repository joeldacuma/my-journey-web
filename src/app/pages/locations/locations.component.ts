import { Component, signal, effect, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";
import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { IEventLocationProps } from '@interfaces/index';
import { CONFIRM_DELETE_LOCATION_DETAILS,
         CONFIRM_DELETE_LOCATION_TITLE,
         DELETE_LOCATION_SUCCESS_TITLE, 
         DELETE_LOCATION_SUCESS_DETAILS } from '@constants/index';

import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  public loading = signal(true);
  public locationsData = signal({
    locations: []
  });

  public defaultFilterRows = 0;
  public selectedLocations: IEventLocationProps[] = [];
  public LOCATION_TOASTS = [
    'location'
  ];

  initData() {
    const _PROCESS = [
      this.getLocations({})
    ];

    Promise.all(_PROCESS).then((result: any) => {
      const locations = result[0];
      this.defaultFilterRows = locations.length;
      this.locationsData.set({ locations: locations });
      this.loading.update(() => false);
    });
  }

  async getLocations(body: Object) {
    const locations = await lastValueFrom(
      this.agendaService.getEventLocations(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return locations;
  };

  async clearFilters(table: Table) {
    table.clear();
  }

  async deleteLocations(body: Array<string>) {
    const result = await lastValueFrom(
      this.agendaService.deleteLocations(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return result;
  }

  confirmDeleteLocations() {
    this.confirmationService.confirm({
      header: CONFIRM_DELETE_LOCATION_TITLE,
      key: 'confirmDeleteLocations',
      message: CONFIRM_DELETE_LOCATION_DETAILS,
      accept: () => {
        this.removeLocations();
      }
    });
  }

  async removeLocations() {
    this.loading.update(() => true);
    const body = this.selectedLocations.map((location: IEventLocationProps) => {
      return location.id.toString();
    });

    const result = await this.deleteLocations(body);
    if (result) {
      this.initData();
      this.messageService.add({
        key: 'location',
        severity:'info',
        summary: DELETE_LOCATION_SUCCESS_TITLE,
        detail: DELETE_LOCATION_SUCESS_DETAILS
      });

      this.selectedLocations = [];
      this.defaultFilterRows = this.defaultFilterRows - this.selectedLocations.length;
    }
  }

  constructor() {
    this.initData();
    effect(() => {
      this.locationsData();
      this.loading();
    });
  }
}
