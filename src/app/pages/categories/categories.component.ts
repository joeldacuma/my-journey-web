import { Component, signal, inject } from '@angular/core';
import { CommonModule } from "@angular/common";
import { lastValueFrom, map } from "rxjs";

import { PrimengModule } from '@modules/index';
import { AgendaService } from '@api/index';
import { ICategoriesProps } from '@interfaces/index';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {
  public agendaService = inject(AgendaService);
  public loading = signal(true);
  public categoriesData = signal({
    categories: []
  });
  public pager = signal({
    totalRows: 0,
  });

  public defaultFilterRows = 0;
  public selectedCategories: ICategoriesProps[] = [];

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
      this.agendaService.getCategoriesLookup(body).pipe(
        map((result: ICategoriesProps) => {
          return result;
        })
      )
    ).catch((error: any) => error);

    return categories;
  }

  constructor() {
    this.initData();
    this.loading();
  }
}
