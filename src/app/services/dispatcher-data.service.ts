import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DispatcherDataService {
  name:string;
  value: any;

  constructor(name:string, value: any) { 
    this.name = name;
    this.value = value;
   }
}
