import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ILoginAuthProps } from '@interfaces/index';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private http = inject(HttpClient);

  login(body: Object) {
    return this.http.post<ILoginAuthProps>(
      `${environment.agenda}/${environment.NEW_AGENDA_API_VERSION}/authentication/signin`, 
      body);
  }
}
