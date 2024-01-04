import { Injectable , inject} from '@angular/core';
import { MY_JOURNEY_AUTH_CONSTANT, 
         JWT_ACCESS_CONSTANT, 
         JWT_REFRESH_TOKEN_CONSTANT 
        } from '@constants/index';
import { LocalstorageService } from '@services/index';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private localStorageService = inject(LocalstorageService);

  isUserAuthenticated() {
    const data = this.localStorageService.getItem(MY_JOURNEY_AUTH_CONSTANT);
    return data[JWT_ACCESS_CONSTANT] ? true : false;
  };

  authenticatedToken() {
    const data = this.localStorageService.getItem(MY_JOURNEY_AUTH_CONSTANT);
    return data[JWT_ACCESS_CONSTANT] || '';
  }

  refreshToken() {
    const data = this.localStorageService.getItem(MY_JOURNEY_AUTH_CONSTANT);
    return data[JWT_REFRESH_TOKEN_CONSTANT] || '';
  }
}
