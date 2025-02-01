import { ControlContainer, ControlValueAccessor, Form, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Input, Component } from '@angular/core';
import { errorLookup, getErrorMessage } from '../constants/errors.constant';

@Component({
  selector: 'app-base-input',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BaseInputComponent,
      multi: true
    }
  ]
})
export abstract class BaseInputComponent implements ControlValueAccessor {
  formGroup: FormGroup;
  @Input() id: string;
  @Input() label: string;
  @Input() formControlName: string;
  @Input() placeholder: string;
  @Input() type: string = 'text';
  @Input() required: boolean;
  value: string;

  onChange = (_) => {};
  onTouched = () => {};

  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.writeValue(inputElement.value);
    this.onChange(inputElement.value);
  }

  onBlur(): void {
    this.onTouched();
  }
  disabled = false;
  get isRequired(): boolean {
    return this.control.hasValidator(Validators.required) || this.required;
  }
  get control() {
    return this.formGroup?.controls[this.formControlName] as FormControl;
  }
  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  errorMessages() {
    const errors = this.control.errors;
    if (!errors) return [];
    var result = Object.keys(errors).map((key) => getErrorMessage(key));
    return result;
  }
}
