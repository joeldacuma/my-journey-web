import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ILoginAuthProps, 
         IUserProps,
         IEventProps, 
         IEventCategoryProps,
         IEventLocationProps,
         IAttendanceEventProps,
         ICategoriesProps } from '@interfaces/index';
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

  getEventAttendanceByPage(id: number, page: number, body: Object) {
    return this.http.post<IAttendanceEventProps>(`${environment.agenda}/attendance/${id}/search/page/` + page,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`,
        'Content-Type': 'application/json'
      }
    })
  }

  createEvent(body: Object) {
    return this.http.post<number>(`${environment.agenda}/event/new`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  updateEvent(body: Object) {
    return this.http.post(`${environment.agenda}/event/edit`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    }); 
  }

  tagAttendedToEvent(id: number, body: Object) {
    return this.http.put<number>(`${environment.agenda}/attendance/${id}/add`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  removeTagAttendedToEvent(id: number, body: Object) {
    return this.http.post<number>(`${environment.agenda}/attendance/${id}/delete`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  getMembersByPage(page: number, body: Object) {
    return this.http.post<IUserProps>(`${environment.agenda}/member/find/page/` + page, 
    body,{
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });  
  }

  addMember(body: Object) {
    return this.http.post<number>(`${environment.agenda}/member/new`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  genderLookup() {
    return this.http.get(`${environment.agenda}/lookup/get/gender`, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  updateMember(body: Object) {
    return this.http.post(`${environment.agenda}/member/edit`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    }); 
  }

  deleteMembers(body: Array<string>) {
    return this.http.post(`${environment.agenda}/member/delete`, 
    body,{
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });
  }

  downloadAttendeeDetails(id: number) {
    return this.http.get(`${environment.agenda}/attendance/${id}/downloadattendeedetails`,
    {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`,
        'Accept': 'text/csv',
        'Content-Disposition': `attachment; filename=attendee-${id}-details.csv`
      },
      reportProgress: true,
      responseType: 'blob'
    });
  }

  downloadGuestsDetails(id: number) {
    return this.http.get(`${environment.agenda}/attendance/${id}/downloadfirsttimerdetails`,
    {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`,
        'Accept': 'text/csv',
        'Content-Disposition': `attachment; filename=attendee-${id}-details.csv`
      },
      reportProgress: true,
      responseType: 'blob'
    });
  }

  getCategoriesLookup(body: Object) {
    return this.http.post<ICategoriesProps>(`${environment.agenda}/eventcategory/find`, 
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });
  }

  addCategory(body: Object) {
    return this.http.post<number>(`${environment.agenda}/eventcategory/new`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  editCategory(body: Object) {
    return this.http.post(`${environment.agenda}/eventcategory/edit`,
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }      
    });
  }

  deleteCategories(body: Array<string>) {
    return this.http.post(`${environment.agenda}/eventcategory/delete`, 
    body, {
      headers: {
        'Authorization': `${this.authService.authenticatedToken()}`
      }
    });
  }
}
