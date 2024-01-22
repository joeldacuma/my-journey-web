import { Component, inject, signal, ViewChild, effect, computed } from '@angular/core';
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
         ERROR_CREATE_MEMBER_DUPLICATE,
         CONFIRM_DELETE_MEMBER_TITLE,
         CONFIRM_DELETE_MEMBER_DETAILS,
         DELETE_MEMBER_SUCCESS_TITLE,
         DELETE_MEMBER_SUCESS_DETAILS,
         ERROR_UPDATE_MEMBER_TITLE,
         ERROR_UPDATE_MEMBER_DETAILS,
         SUCCESS_UPDATE_MEMBER_TITLE,
         SUCCESS_UPDATE_MEMBER_DETAILS } from '@constants/index';

import { Paginator } from 'primeng/paginator';
import { MessageService, ConfirmationService } from 'primeng/api';
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
  providers: [MessageService, ConfirmationService],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent {
  @ViewChild('paginator', {static: false}) paginator?: Paginator;
  @ViewChild('opMember', {static: false}) opMember?: OverlayPanel;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
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
  public searchMemberGlobal: string = '';
  public activeSelection: Array<any> = ACTIVE_SELECTION;
  public gendersSelection: Array<any> = GENDER_SELECTION;
  public genders: Array<any> = [];
  public isEditMember: boolean = false;
  public memberId: number = 0;

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
        totalRows: members.pager?.totalItems,
        pageSize: members.pager.pageSize
      });

      this.defaultFilterRows = members.pager?.totalItems;
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

  async clearFilter(table: Table) {
   table.clear();
   if (this.searchMemberGlobal) {
    this.loading.update(() => true);
    this.searchMemberGlobal = '';
    this.initData();
   } else {
    this.pager.set({
      page: 1,
      totalRows: this.defaultFilterRows,
      pageSize: 100
    });
   }
  }

  async onPage(event: any) {
    this.loading.update(() => true);
    const members = await this.getMembers(event.page + 1);
    this.users.set({...members});
    this.loading.update(() => false);
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
      this.userFormGroup.patchValue({
        gender: this.gendersSelection[0],
        isActive: this.activeSelection[0]
      });
      this.initData();
      this.defaultFilterRows = this.defaultFilterRows + 1;

      this.messageService.add({
        key: 'member',
        severity: 'info',
        summary: SUCCESS_CREATE_MEMBER_TITLE,
        detail: SUCCESS_CREATE_MEMBER_DETAILS
      });
    }
  }

  async globalSearchMemberFilter() {
    this.loading.update(() => true);
    const members = await lastValueFrom(
      this.agendaService.getMembersByPage(1, {name: this.searchMemberGlobal}).pipe(
        map((result: IUserProps) => {
          return result;
        })
      )
     ).catch((error) => error);

     this.users.set({...members});
     if (members) {
      this.pager.set({
        page: 1,
        totalRows: members.pager.totalItems,
        pageSize: members.pager.pageSize
      });

      this.loading.update(() => false);
     }
  }

  confirmDeleteMember() {
    this.confirmationService.confirm({
      key: 'confirmDeleteMember',
      header: CONFIRM_DELETE_MEMBER_TITLE,
      message: CONFIRM_DELETE_MEMBER_DETAILS,
      accept: () => {
        this.deleteMembers();
      }
    });
  }

  async deleteMembers() {
    this.loading.update(() => true);
    if (this.selectedMembers.length === 0) {
      return;
    }

    const selectedMembers: any = this.selectedMembers;
    const membersIds: Array<any> = [];
    selectedMembers.forEach((member: any) => {
      membersIds.push(member.id);
    });

    const deleteMembers = await lastValueFrom(
      this.agendaService.deleteMembers(membersIds).pipe(
        map((result: any) => {
          return result;
        })
      )
     ).catch((error) => error);

     if (deleteMembers) {
      this.messageService.add({
        key: 'member',
        severity: 'info',
        summary: DELETE_MEMBER_SUCCESS_TITLE,
        detail: DELETE_MEMBER_SUCESS_DETAILS
      });
      this.defaultFilterRows = this.defaultFilterRows - this.selectedMembers.length;
      this.selectedMembers = [];
      this.initData();
     }
  }

  async updateMember(body: Object) {
    const updateMember = await lastValueFrom(
      this.agendaService.updateMember(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error) => error);

    return updateMember;
  }

  showEditMemberModal(member: any) {
    this.isEditMember = true;
    this.memberId = member.id;

    if (!member.gender) {
      member.gender = 3;
    }

    const filterGender = GENDER_SELECTION.filter((gender: any) => gender.id === member.gender);

    this.userFormGroup.patchValue({
      name: member.name,
      nickName: member.nickName,
      birthDate: member.birthDate && new Date(member.birthDate),
      gender: filterGender[0],
      email: member.email,
      address: member.address,
      mobile: member.mobile,
      invitedByMemberName: member.invitedByMemberName,
      remarks: member.remarks,
      isActive: member.isActive ? this.activeSelection[0] : this.activeSelection[1]
    });
  }

  async submitUpdateMember() {
    this.loading.update(() => true);

    if (!this.userFormGroup.valid) {
      this.messageService.add({
        key: 'member',
        severity: 'error',
        summary: ERROR_UPDATE_MEMBER_TITLE,
        detail: ERROR_UPDATE_MEMBER_DETAILS, 
      });
      this.loading.update(() => false);
      return;
    }

    const body = {
      id: this.memberId,
      name: this.userFormGroup.value.name,
      nickName: this.userFormGroup.value.nickName,
      birthDate: moment(this.userFormGroup.value.birthDate).format('MM/DD/YYYY'),
      gender: this.userFormGroup.value.gender.id,
      email: this.userFormGroup.value.email,
      address: this.userFormGroup.value.address,
      mobile: this.userFormGroup.value.mobile,
      invitedByMemberName: this.userFormGroup.value.invitedByMemberName,
      remarks: this.userFormGroup.value.remarks,
      isActive: this.userFormGroup.value.isActive.id === 1 ? true : false,
    };

    this.isEditMember = false;

    const updateMember = await this.updateMember(body)
    .then(() => {
      this.messageService.add({
        key: 'member',
        severity: 'info',
        summary: SUCCESS_UPDATE_MEMBER_TITLE,
        detail: SUCCESS_UPDATE_MEMBER_DETAILS
      });

      this.userFormGroup.reset();
      this.initData();
    });
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
