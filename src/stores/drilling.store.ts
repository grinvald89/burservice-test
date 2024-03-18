import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { IState } from './state.interface';
import { IDrilling } from '../entities';

@Injectable({
  providedIn: 'root'
})
export class DrillingStore {
  private _store: BehaviorSubject<IState<IDrilling[]>> = new BehaviorSubject<IState<IDrilling[]>>({
    loaded: false,
    value: [],
  });

  public get state$(): Observable<IState<IDrilling[]>> {
    return this._store.asObservable();
  }

  constructor(private readonly http: HttpClient) { }

  public load(): void {
    this.http.get<IDrilling[]>('assets/drilling.json', { responseType: 'json' })
      .subscribe((value: IDrilling[]): void => {
        value = this.mapDrilling(value);

        value = value.sort((a: IDrilling, b: IDrilling): number =>
          (a.stepNo > b.stepNo) ? 1 : -1);

        this._store.next({
          loaded: true,
          value: value,
        });
      });
  }

  private mapDrilling(origin: IDrilling[]): IDrilling[] {
    const result: IDrilling[] = origin.map((item) => {
      item.stepNo = Number(item.stepNo);
      item.mdFrom = Math.round((item.mdFrom * 10)) / 10;
      item.mdTo = Math.round(item.mdTo);

      return item;
    });

    return result;
  }
}