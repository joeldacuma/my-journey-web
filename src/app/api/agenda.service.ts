import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ILoginProps } from '@interfaces/index';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private http = inject(HttpClient);

  login(body: ILoginProps) {
    return this.http.post(
      `${environment.agenda}/${environment.NEW_AGENDA_API_VERSION}/Authentication/Signin`, 
      body);
  }
}
