import { Component, inject, signal, ViewChild, effect } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";
import moment from 'moment';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";

import { UserForm } from '@forms/index';
import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { IUserProps } from '@interfaces/index';
import { GENDER_SELECTION, 
         ACTIVE_SELECTION,
         ERROR_CREATE_MEMBER_TITLE,
         ERROR_CREATE_MEMBER_DETAILS,
         SUCCESS_CREATE_MEMBER_TITLE,
         SUCCESS_CREATE_MEMBER_DETAILS,
         ERROR_CREATE_MEMBER_DUPLICATE } from '@constants/index';

import { Paginator } from 'primeng/paginator';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule,
            PrimengModule,
            ReactiveFormsModule,
            FormsModule
          ],
  providers: [MessageService],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  @ViewChild('paginator', {static: false}) paginator?: Paginator;
  @ViewChild('opMember', {static: false}) opMember?: OverlayPanel;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private formBuilder = inject(FormBuilder);
  public users = signal({
    members: [],
    pager: {}
  });
  public pager = signal({
    page: 1,
    totalRows: 0,
    pageSize: 100
  });
  public loading = signal(true);
  public defaultFilterRows = 0;
  public selectedMembers: IUserProps[] = [];
  public userFormGroup = new FormGroup<any>(UserForm);

  public selectedGender: any;
  public activeSelection: Array<any> = ACTIVE_SELECTION;
  public gendersSelection: Array<any> = GENDER_SELECTION;
  public genders: Array<any> = [];

  initData() {
    const _PROCESS = [
      this.getMembers(1),
      this.getGenderLookup()
    ];

    Promise.all(_PROCESS).then((result) => {
      const members = result[0];
       this.genders = result[1];
      this.users.set({...members});

      this.pager.set({
        page: 1,
        totalRows: members.pager.totalItems,
        pageSize: members.pager.pageSize
      });

      this.loading.set(false);
    });
  }

  onGenderLookup(gender: number) {
    const _gender: any = this.genders.filter((value: any) => gender === value.id);
    return _gender[0]?.name;
  }  

  async getMembers(page: number) {
    const members = await lastValueFrom(
      this.agendaService.getMembersByPage(page, {}).pipe(
        map((result: IUserProps) => {
          return result;
        })
      )
     ).catch((error) => error);

     return members;
  }

  async addMember(body: Object) {
    const member = await lastValueFrom(
      this.agendaService.addMember(body).pipe(
        map((result: number) => {
          return result;
        })
      )
     ).catch((error) => error);

     return member;
  }

  async getGenderLookup() {
    const gender = await lastValueFrom(this.agendaService.genderLookup()
    .pipe(map((result: any) => {
      return result;
    }))
    ).catch((error) => error);

    return gender;
  }

  onFilter(event: any) {
    const filteredValue = event.filteredValue;
    if (this.defaultFilterRows === 0) {
      this.defaultFilterRows = this.pager().totalRows;
    } else if (filteredValue.length >= 100) {
      this.pager.set({
        page: 1,
        totalRows: this.defaultFilterRows,
        pageSize: 100
      });
    } else {
      this.pager.set({
        page: 1,
        totalRows: filteredValue.length,
        pageSize: filteredValue.length
      });
    }
  }

  clearFilter(table: Table) {
   table.clear();
    this.pager.set({
      page: 1,
      totalRows: this.defaultFilterRows,
      pageSize: 100
    });
  }

  async createMember() {
    this.loading.update(() => true);
    if (!this.userFormGroup.valid) {
      this.messageService.add({
        key: 'member',
        severity: 'error',
        summary: ERROR_CREATE_MEMBER_TITLE,
        detail: ERROR_CREATE_MEMBER_DETAILS
      });

      this.loading.update(() => false);
      return;
    }
    
    const memberValue = this.userFormGroup.value;
    const genderFilterId = this.genders.filter((gender: any) => gender.id === memberValue.gender.id);
    const body = {
      name: memberValue.name,
      address: memberValue.address,
      birthDate: moment(memberValue.birthDate).format('MM/DD/YYYY'),
      email: memberValue.email,
      gender: genderFilterId[0].id.toString(),
      invitedByMemberName: memberValue.invitedByMemberName,
      nickName: memberValue.nickName,
      remarks: memberValue.remarks,
      mobile: memberValue.mobile
    };
    
    this.opMember?.hide();
    const addMember = await this.addMember(body);
    this.loading.update(() => false);
    if (addMember) {
      if (addMember.status === 403) {
        this.messageService.add({
          key: 'member',
          severity: 'error',
          summary: ERROR_CREATE_MEMBER_TITLE,
          detail: ERROR_CREATE_MEMBER_DUPLICATE
        });
        return;
      }

      this.userFormGroup.reset();
      this.initData();

      this.messageService.add({
        key: 'member',
        severity: 'info',
        summary: SUCCESS_CREATE_MEMBER_TITLE,
        detail: SUCCESS_CREATE_MEMBER_DETAILS
      });
    }
  }

  constructor() {
    this.initData();
    this.userFormGroup = this.formBuilder.group<any>(UserForm);
    this.userFormGroup.patchValue({
      gender: this.gendersSelection[0],
      isActive: this.activeSelection[0]
    });
    effect(() => {
      this.users();
      this.pager();
    });
  }
}
