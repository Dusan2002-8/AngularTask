export interface TimeEntry {
  EmployeeName: string | null;
  StarTimeUtc: string;
  EndTimeUtc: string;
  DeletedOn: string | null;
}

export interface Employee {
  name: string;
  totalHours: number;
}