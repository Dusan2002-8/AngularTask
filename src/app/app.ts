import { Component } from '@angular/core';
import { Employees } from './employees/employees';

@Component({
  selector: 'app-root',
  imports: [Employees],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
}
