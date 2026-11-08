import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Employee, TimeEntry } from '../employee.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private http = inject(HttpClient);

  private apiUrl = `https://rc-vault-fap-live-1.azurewebsites.net/api/gettimeentries?code=${environment.apiKey}`;

  getEmployees(): Observable<Employee[]> {
    return this.http.get<TimeEntry[]>(this.apiUrl).pipe(
      map(entries => {
        const totals = new Map<string, number>();

        entries.forEach(entry => {
          if (
            !entry.EmployeeName ||
            !entry.StarTimeUtc ||
            !entry.EndTimeUtc ||
            entry.DeletedOn
          ) {
            return;
          }

          const start = new Date(entry.StarTimeUtc).getTime();
          const end = new Date(entry.EndTimeUtc).getTime();

          const hours = (end - start) / (1000 * 60 * 60);

          if (hours > 0) {
            const current = totals.get(entry.EmployeeName) || 0;
            totals.set(entry.EmployeeName, current + hours);
          }
        });

        return Array.from(totals, ([name, totalHours]) => ({
          name,
          totalHours
        })).sort((a, b) => b.totalHours - a.totalHours);
      })
    );
  }
}