import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  private isClosedSubject = new BehaviorSubject<boolean>(false);
  isClosed$ = this.isClosedSubject.asObservable();

  toggleSidebar(): void {
    this.isClosedSubject.next(!this.isClosedSubject.value);
  }

  close(): void {
    this.isClosedSubject.next(true);
  }

  open(): void {
    this.isClosedSubject.next(false);
  }
}