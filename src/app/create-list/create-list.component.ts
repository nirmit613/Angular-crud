import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../models/user.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../sevices/api.service';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss'],
})
export class CreateListComponent implements OnInit {
  public dataSource!: MatTableDataSource<User>;
  public users!: User[];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = [
    'Id',
    'FirstName',
    'LastName',
    'Email',
    'Mobile',
    'BmiResult',
    'Gender',
    'Package',
    'EnquiryDate',
    'Action',
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private confirm: NgConfirmService,
    private toast: NgToastService
  ) {}
  ngOnInit(): void {
    this.getUsers();
  }
  public getUsers() {
    this.api.getRegisteredUser().subscribe((res) => {
      this.users = res;
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public edit(id: number) {
    this.router.navigate(['update', id]);
  }
  public delete(id: number) {
    this.confirm.showConfirm(
      'Are you sure you want to delete?',
      () => {
        this.api.deleteRegistered(id).subscribe((res) => {
          this.toast.success({
            detail: 'Success',
            summary: 'Deleted Successfully',
            duration: 4000,
          });
          this.getUsers();
        });
      },
      () => {}
    );
  }
}
