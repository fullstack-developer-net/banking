import { Component, OnInit } from '@angular/core';
import { TextInputComponent } from "../../core/components/text-input/text-input.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css'],
  imports: [TextInputComponent,ReactiveFormsModule, CommonModule]
})
export class NewUserComponent implements OnInit {
  constructor(private fb: FormBuilder) {
   
  }
  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    isAdmin: [false, '']
  });
  ngOnInit() {
    
  }
}
