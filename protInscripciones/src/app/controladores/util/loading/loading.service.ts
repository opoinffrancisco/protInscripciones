import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private subject$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  show(): void {
   this.subject$.next(true);
  }

  hide(): void {
    this.subject$.next(false);
  }

  listenLoading(): Observable<boolean> {
    return this.subject$.asObservable();
  }
}