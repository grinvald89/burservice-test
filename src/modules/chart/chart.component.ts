import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import Chart, { ChartItem } from 'chart.js/auto';
import { chain, filter, forEach } from 'lodash';
import { Subject, takeUntil } from 'rxjs';

import { DrillingStore, IState } from '../../stores';
import { IDrilling } from '../../entities';

interface IChartData {
  x: string;
  y: number;
}

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartComponent implements OnDestroy, AfterViewInit {
  @ViewChild('chart') chart!: ElementRef<HTMLVideoElement>;
  canvas: any;
  ctx!: ChartItem;

  private destroy$: Subject<void> = new Subject<void>();

  constructor(private readonly drillingStore: DrillingStore) { }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public ngAfterViewInit(): void {
    this.drillingStore.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: IState<IDrilling[]>): void => {
        if (state.loaded) {
          this.drawChart(state.value);
        }
      });
  }

  private drawChart(list: IDrilling[]): void {
    this.canvas = this.chart.nativeElement;
    this.ctx = this.canvas.getContext('2d');

    new Chart(this.ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: this.getChartData(list),
        }],
      },
    });
  }

  private getChartData(list: IDrilling[]): IChartData[] {
    const chartData: IChartData[] = [];

    const sortingListByStep: IDrilling[] = list.sort((a: IDrilling, b: IDrilling): number =>
      (a.stepNo > b.stepNo) ? 1 : -1);

    const phases: string[] = chain(sortingListByStep)
      .uniqBy('activityPhase')
      .map((item: IDrilling): string => item.activityPhase)
      .value();

    forEach(phases, (phase: string): void => {
      const listByPhase: IDrilling[] = filter(sortingListByStep, (item: IDrilling): boolean => (phase === item.activityPhase));

      chartData.push({
        x: phase,
        y: Math.round(listByPhase[listByPhase.length - 1].mdTo),
      });
    });

    return chartData;
  }
}