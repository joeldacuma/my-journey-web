import { Component, signal, inject, effect, ViewChild } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder} from "@angular/forms";

import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { ICategoriesProps } from '@interfaces/index';
import { CategoryForm } from '@forms/index';
import {
  CONFIRM_DELETE_CATEGORY_TITLE,
  CONFIRM_DELETE_CATEGORY_DETAILS,
  DELETE_CATEGORY_SUCCESS_TITLE,
  DELETE_CATEGORY_SUCESS_DETAILS,
  ERROR_CREATE_CATEGORY_DETAILS,
  ERROR_CREATE_CATEGORY_TITLE,
  SUCCESS_CREATE_CATEGORY_DETAILS,
  SUCCESS_CREATE_CATEGORY_TITLE,
  ERROR_UPDATE_CATEGORY_TITLE,
  ERROR_UPDATE_CATEGORY_DETAILS,
  SUCCESS_UPDATE_CATEGORY_TITLE,
  SUCCESS_UPDATE_CATEGORY_DETAILS } from '@constants/index';

import { MessageService, ConfirmationService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers:[
    MessageService,
    ConfirmationService
   ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  @ViewChild('opCategory', {static: false}) opCategory?: OverlayPanel;
  private agendaService = inject(AgendaService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);
  private formBuilder = inject(FormBuilder);
  public loading = signal(true);
  public categoryFormGroup = new FormGroup<any>(CategoryForm);
  public categoriesData = signal({
    categories: []
  });
  public pager = signal({
    totalRows: 0,
  });
  public defaultFilterRows = 0;
  public isEditCategory: boolean = false;
  public categoryId: number = 0;
  public selectedCategories: ICategoriesProps[] = [];
  public CATEGORY_TOASTS = [
    'category'
  ];

  initData() {
    const _PROCESS = [
      this.getCategories({})
    ];

    Promise.all(_PROCESS)
    .then((result: any) => {
      const categories: any = result[0];

      this.pager.set({totalRows: categories.length});
      this.categoriesData.set({categories});
      this.defaultFilterRows = categories.length;
      this.loading.update(() => false);
    }).catch((error: any) => {
      return error;
    });
  }

  async getCategories(body: Object) {
    const categories = await lastValueFrom(
      this.agendaService.getEventCategories(body).pipe(
        map((result: ICategoriesProps) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return categories;
  }

  async deleteCategories(body: Array<string>) {
    const result = await lastValueFrom(
      this.agendaService.deleteCategories(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return result;
  }

  confirmDeleteCategories() {
    this.confirmationService.confirm({
      header: CONFIRM_DELETE_CATEGORY_TITLE,
      key: 'confirmDeleteCategories',
      message: CONFIRM_DELETE_CATEGORY_DETAILS,
      accept: () => {
        this.removeCategories();
      }
    });
  }

  async removeCategories() {
    this.loading.update(() => true);
    const body = this.selectedCategories.map((category: ICategoriesProps) => {
      return category.id.toString();
    });

    const result = await this.deleteCategories(body);
    if (result) {
      this.initData();
      this.messageService.add({
        key: 'category',
        severity:'info',
        summary: DELETE_CATEGORY_SUCCESS_TITLE,
        detail: DELETE_CATEGORY_SUCESS_DETAILS
      });

      this.selectedCategories = [];
      this.defaultFilterRows = this.defaultFilterRows - this.selectedCategories.length;
    }
  }

  async addCategory(body: Object) {
    const result = await lastValueFrom(
      this.agendaService.addCategory(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return result;
  }

  async createCategory() {
    this.loading.update(() => true);

    if (!this.categoryFormGroup.valid) {
      this.messageService.add({
        key: 'category',
        severity:'error',
        summary: ERROR_CREATE_CATEGORY_TITLE,
        detail: ERROR_CREATE_CATEGORY_DETAILS
      });
      this.loading.update(() => false);
      return;
    }

    const body = {
      name: this.categoryFormGroup.value.name
    };

    this.opCategory?.hide();
    const addedCategory = await this.addCategory(body);
    this.loading.update(() => false);
    if (addedCategory) {
      this.messageService.add({
        key: 'category',
        severity:'info',
        summary: SUCCESS_CREATE_CATEGORY_TITLE,
        detail: SUCCESS_CREATE_CATEGORY_DETAILS
      });

      this.categoryFormGroup.reset();
      this.initData();
      this.defaultFilterRows = this.defaultFilterRows + 1;
    } else {
      this.messageService.add({
        key: 'category',
        severity:'error',
        summary: ERROR_CREATE_CATEGORY_TITLE,
        detail: ERROR_CREATE_CATEGORY_DETAILS
      }); 
    }
  }

  showEditCategoryModal(category: ICategoriesProps) {
    this.isEditCategory = true;
    this.categoryId = category.id;

    this.categoryFormGroup.patchValue({
      name: category.name
    });
  }

  async submitUpdateCategory() {
    this.loading.update(() => true);
    if (!this.categoryFormGroup.valid) {
      this.messageService.add({
        key: 'category',
        severity: 'error',
        summary: ERROR_UPDATE_CATEGORY_TITLE,
        detail: ERROR_UPDATE_CATEGORY_DETAILS, 
      });
      return;
    }

    const body = {
      id: this.categoryId,
      name: this.categoryFormGroup.value.name
    };
    this.isEditCategory = false;
    const editCategory = await this.updateCategory(body)
    .then(() => {
      this.messageService.add({
        key: 'category',
        severity: 'info',
        summary: SUCCESS_UPDATE_CATEGORY_TITLE,
        detail: SUCCESS_UPDATE_CATEGORY_DETAILS
      });

      this.categoryFormGroup.reset();
      this.initData();
    });
  }

  async updateCategory(body: Object) {
    const updateCategory = await lastValueFrom(
      this.agendaService.editCategory(body).pipe(
        map((result: any) => {
          return result;
        })
      )
    ).catch((error: any) => error);
    
    return updateCategory;
  }

  async clearFilters(table: Table) {
    table.clear();
    this.initData();
  }

  constructor() {
    this.initData();
    this.categoryFormGroup = this.formBuilder.group(CategoryForm);
    effect(() => {
      this.loading();
    });
  }
}
