import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextInputComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class TextInputComponent extends BaseInputComponent implements OnInit {
  constructor(private controlContainer: ControlContainer) {
    super();
  }

  ngOnInit() {
    this.formGroup = this.controlContainer.control as FormGroup;
  }
}
