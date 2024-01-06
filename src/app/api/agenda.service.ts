import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ILoginAuthProps, 
         IEventProps, 
         IEventCategoryProps,
         IEventLocationProps } from '@interfaces/index';
import { environment } from 'environments/environment';

import { AuthService } from '@services/index';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  login(body: Object) {
    return this.http.post<ILoginAuthProps>(
      `${environment.agenda}/${environment.NEW_AGENDA_API_VERSION}/authentication/signin`, 
      body);
  }

  refreshAccessTokens() {
    return this.http.get<ILoginAuthProps>(
      `${environment.agenda}/${environment.NEW_AGENDA_API_VERSION}/authentication/token`,
      {
        headers: {
         'Authorization': this.authService.refreshToken(),
        }
      });
  };

  getEventsByPage(page: number, body: Object) {
    return this.http.post<IEventProps>(`${environment.agenda}/event/find/page/` + page, 
    body,{
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });  
  }
  
  deleteEvents(body: Array<string>) {
    return this.http.post(`${environment.agenda}/event/delete`, 
    body,{
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });
  }

  getEventCategories(body: Object) {
    return this.http.post<IEventCategoryProps>(`${environment.agenda}/eventcategory/find`, 
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  getEventLocations(body: Object) {
    return this.http.post<IEventLocationProps>(`${environment.agenda}/location/find`, 
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });   
  }

  createEvent(body: Object) {
    return this.http.post<number>(`${environment.agenda}/event/new`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

}
