import { ApiService } from './services/api.service';
import { DialogComponent } from './dialog/dialog.component';
import { Component, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {AfterViewInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angularcrud-jsonserver';
  displayedColumns: string[] = ['firstName', 'lastName', 'date', 'contactNumber', 'email', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog : MatDialog, private api : ApiService){

  }
  ngOnInit(): void {
    this.getAllContact();
  }

  openDialog() {
    this.dialog.open(DialogComponent, {
     width: '50%'
    }).afterClosed().subscribe(val=>{
      if(val === 'save'){
        this.getAllContact();
      }
    })
  }
  getAllContact(){
    this.api.getContact()
    .subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort
      },
      error:(err)=>{
        alert("Sorry. We have a little problem. We encounter an error while fetching your contact")
      }
    })
  }
  editForm(row : any){
    this.dialog.open(DialogComponent,{
      width: '50%',
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllContact();
      }
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteContact(id: number){
    this.api.deleteContact(id)
    .subscribe({
      next:(res)=>{
        alert("Thank you! Your contact was successfully deleted")
        this.getAllContact();
      },
      error:()=>{
        alert("Sorry. We have a little problem. We encounter an error in deleting your contact.")
      }
    })
  }
}
