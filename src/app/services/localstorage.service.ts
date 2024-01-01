import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  clear() {
    localStorage.clear();
  }

  getItem(key: string) {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  setItem(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  };

  removeItem(key: string) {
    localStorage.removeItem(key);
  };
}
