import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }
  /* public searchFilter:BehaviorSubject<string> = new BehaviorSubject(''); */
  public searchFilter: Subject<string> = new Subject();
}
