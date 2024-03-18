import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { DrillingStore, IState } from '../../stores';
import { IDrilling } from '../../entities';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnDestroy, OnInit {
  public list: IDrilling[] = [];
  public displayedColumns: string[] = [
    'stepNo',
    'targetDuration',
    'activityGroup',
    'activityPhase',
    'mdFrom',
    'mdTo',
  ];

  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly drillingStore: DrillingStore,
  ) { }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngOnInit(): void {
    this.drillingStore.load();

    this.drillingStore.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: IState<IDrilling[]>): void => {
        this.list = state.value;
        this.changeDetectorRef.detectChanges();
      });
  }
}
