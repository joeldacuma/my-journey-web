import { Component, signal, effect, inject, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";

import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { IEventLocationProps } from '@interfaces/index';
import { CONFIRM_DELETE_LOCATION_DETAILS,
         CONFIRM_DELETE_LOCATION_TITLE,
         DELETE_LOCATION_SUCCESS_TITLE, 
         DELETE_LOCATION_SUCESS_DETAILS,
         ERROR_UPDATE_LOCATION_TITLE,
         ERROR_UPDATE_LOCATION_DETAILS,
         SUCCESS_UPDATE_LOCATION_TITLE,
         SUCCESS_UPDATE_LOCATION_DETAILS,
         ERROR_CREATE_LOCATION_TITLE,
         ERROR_CREATE_LOCATION_DETAILS,
         SUCCESS_CREATE_LOCATION_TITLE,
         SUCCESS_CREATE_LOCATION_DETAILS } from '@constants/index';
import { LocationForm } from '@forms/index'; 

import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss'
})
export class LocationsComponent {
  @ViewChild('opLocation', {static: false}) opLocation?: OverlayPanel;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private formBuilder = inject(FormBuilder);
  public loading = signal(true);
  public locationsData = signal({
    locations: []
  });
  public locationFormGroup = new FormGroup<any>(LocationForm);
  public isEditLocation:boolean = false;
  public defaultFilterRows = 0;
  public locationId: number = 0;
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

  async addLocaton(body: Object) {
    const result = await lastValueFrom(
      this.agendaService.addLocation(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return result;
  };

  async createLocation() {
    this.loading.update(() => true);
    if (!this.locationFormGroup.valid) {
      this.messageService.add({
        key: 'location',
        severity: 'error',
        summary: ERROR_CREATE_LOCATION_TITLE,
        detail: ERROR_CREATE_LOCATION_DETAILS, 
      });
      this.loading.update(() => false);
      return;
    }

    const body = {
      address: this.locationFormGroup.value.address,
      name: this.locationFormGroup.value.name
    };

    this.opLocation?.hide();
    const addLocation = await this.addLocaton(body);
    this.loading.update(() => false);
    if (addLocation) {
      this.messageService.add({
        key: 'location',
        severity: 'info',
        summary: SUCCESS_CREATE_LOCATION_TITLE,
        detail: SUCCESS_CREATE_LOCATION_DETAILS
      });

      this.locationFormGroup.reset();
      this.initData();
      this.defaultFilterRows = this.defaultFilterRows + 1;
    } else {
      this.messageService.add({
        key: 'category',
        severity:'error',
        summary: ERROR_CREATE_LOCATION_TITLE,
        detail: ERROR_CREATE_LOCATION_DETAILS
      }); 
    }
  }

  showEditLocationModal(location: IEventLocationProps) {
    this.isEditLocation = true;
    this.locationId = location.id;
    this.locationFormGroup.patchValue({
      address: location.address,
      name: location.name,
    });
  }

  async submitUpdateLocation() {
    this.loading.update(() => true);
    if (!this.locationFormGroup.valid) {
      this.messageService.add({
        key: 'category',
        severity: 'error',
        summary: ERROR_UPDATE_LOCATION_TITLE,
        detail: ERROR_UPDATE_LOCATION_DETAILS, 
      });
      this.loading.update(() => false);
      return;
    }

    const body = {
        id: this.locationId,
        address: this.locationFormGroup.value.address,
        name: this.locationFormGroup.value.name
      };
    this.isEditLocation = false;
    const result = await this.updateLocation(body)
      .then(() => {
        this.messageService.add({
          key: 'location',
          severity: 'info',
          summary: SUCCESS_UPDATE_LOCATION_TITLE,
          detail: SUCCESS_UPDATE_LOCATION_DETAILS
        });

        this.locationFormGroup.reset();
        this.initData();
      });
  }

  async updateLocation(body: Object) {
    const updateLocation = await lastValueFrom(
      this.agendaService.editLocation(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return updateLocation;
  };



  constructor() {
    this.initData();
    this.locationFormGroup = this.formBuilder.group(LocationForm);
    effect(() => {
      this.locationsData();
      this.loading();
    });
  }
}
