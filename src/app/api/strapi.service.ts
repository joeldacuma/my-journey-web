import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { IDashboardProps, IAuthProps } from '@interfaces/index';
import { POPULATE_ALL } from '@constants/index';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StrapiService {
  private http = inject(HttpClient);

  login(body: Object) {
    return this.http.post<IAuthProps>(`${environment.strapi}/auth/local`, body);
  };

  getDashboardContentData() {
    return this.http.get<IDashboardProps>(`${environment.strapi}/my-journey-dashboard?${POPULATE_ALL}`);
  }
}
