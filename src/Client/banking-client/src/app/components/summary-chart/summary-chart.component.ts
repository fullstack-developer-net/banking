import { Component } from '@angular/core';
import { ChartDataMonthComponent } from 'src/app/core/components/apexchart/chart-data-month/chart-data-month.component';

@Component({
  selector: 'app-summary-chart',
  imports: [ChartDataMonthComponent],
  templateUrl: './summary-chart.component.html',
  styleUrl: './summary-chart.component.scss'
})
export class SummaryChartComponent {}
