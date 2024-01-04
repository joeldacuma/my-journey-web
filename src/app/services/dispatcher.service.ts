import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { DispatcherDataService } from '@services/index';

@Injectable({
  providedIn: 'root'
})
export class DispatcherService {
  private subject = new Subject<DispatcherDataService>();

  constructor() {}

  emit(event: DispatcherDataService) {
    this.subject.next(event);
  }

  on(eventName: string, action: any): Subscription {
    return this.subject.pipe(
      filter((e: DispatcherDataService) => e.name == eventName),
      map((e: DispatcherDataService) => e["value"])).subscribe(action);
  }
}
