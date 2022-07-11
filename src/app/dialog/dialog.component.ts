import { ApiService } from './../services/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog'

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  contactForm !: FormGroup;
  actionBtn : string = "Save"
  constructor(private formBuilder : FormBuilder, 
    private api : ApiService, 
    @Inject(MAT_DIALOG_DATA) public editData : any,
    private dialogRef : MatDialogRef<DialogComponent>) { }

  ngOnInit(): void {
    this.contactForm = this.formBuilder.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      date : ['', Validators.required],
      contactNumber : ['', Validators.required],
      email : ['', Validators.required]
    });

    if(this.editData){
      this.actionBtn = "Update"
      this.contactForm.controls['firstName'].setValue(this.editData.firstName);
      this.contactForm.controls['lastName'].setValue(this.editData.lastName);
      this.contactForm.controls['date'].setValue(this.editData.date);
      this.contactForm.controls['contactNumber'].setValue(this.editData.contactNumber);
      this.contactForm.controls['email'].setValue(this.editData.email);
    }
  }
  addContact(){
   if(!this.editData){
    if(this.contactForm.valid){
      this.api.postContact(this.contactForm.value)
      .subscribe({
        next:(res)=>{
          alert("Thank you. Your contact was added successfully");
          this.contactForm.reset();
          this.dialogRef.close('save');
        },
        error:()=>{
          alert("Sorry. We have a little problem. We encounter an error while adding your contact")
        }
      })
    }
   
    }else{
       this.updateContact()
        }
      }
  updateContact(){
    this.api.putContact(this.contactForm.value, this.editData.id)
    .subscribe({
      next:(res)=>{
        alert("Thank you! Your contact was sucessfully updated");
        this.contactForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Sorry. We have a little problem. We encounter an error while updating your contact");
      }
    })
  }
}
  