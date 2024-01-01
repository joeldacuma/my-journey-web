import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IDashboardProps } from '@interfaces/index';
import { POPULATE_ALL } from '@constants/index';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private http = inject(HttpClient);

  getDashboardContentData() {
    return this.http.get<IDashboardProps>(`${environment.strapi}/my-journey-dashboard?${POPULATE_ALL}`);
  }
}
