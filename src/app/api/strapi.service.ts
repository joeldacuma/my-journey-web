import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '@environments/environment';

import { IDashboardProps } from '@interfaces/index';
import { POPULATE_ALL } from '@constants/index';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private http = inject(HttpClient);

  getDashboardContentData() {
    return this.http.get<IDashboardProps>(`${environment.strapi}/my-journey-dashboard?${POPULATE_ALL}`);
  }
}
