import { Component, OnInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { EmployeeService } from '../services/employee';
import { Employee } from '../employee.model';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-employees',
  imports: [CommonModule],
  templateUrl: './employees.html',
  styleUrl: './employees.css',
})
export class Employees implements OnInit, OnDestroy {

  @ViewChild('employeeChart') employeeChart!: ElementRef<HTMLCanvasElement>;

  employees: Employee[] = [];
  loading = true;
  errorMessage = '';

  private chart?: Chart<'pie', number[], string>;

  constructor(private employeeService: EmployeeService,
              private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        console.log('Employees received:', data);

        this.employees = data;
        this.loading = false;

        this.cdr.detectChanges();

        this.createChart();
      },
      error: (error) => {
        console.error('API Error:', error);

        this.errorMessage = 'Error loading employees.';
        this.loading = false;

        this.cdr.detectChanges();
        }
    });
  }

  formatHours(hours: number): string {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);

    return `${wholeHours} hrs ${minutes} mins`;
  }

  createChart(): void {
    if (!this.employeeChart || this.employees.length === 0) {
      return;
    }

    const labels = this.employees.map(e => e.name);
    const values = this.employees.map(e => e.totalHours);

    this.chart?.destroy();

    this.chart = new Chart(this.employeeChart.nativeElement, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: ['#b45a2a', '#ffff80', '#703fa0', '#c5a6d4']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom'
          },
          datalabels: {
            color: '#ffffff',
            formatter: (value, context) => {
              const data = context.chart.data.datasets[0].data as number[];
              const total = data.reduce((sum, item) => sum + item, 0);
              return Math.round(Number(value) / total * 100) + '%';
            }
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}