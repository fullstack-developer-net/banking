import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'creditCardNumber'
})
export class CreditCardNumberPipe implements PipeTransform {
  transform(value: string): string {
    const cleanedValue = value.replace(/\D/g, '');

    // Chèn dấu gạch ngang sau mỗi 4 chữ số
    const formattedValue = cleanedValue.match(/.{1,4}/g)?.join(' - ');

    return formattedValue ?? '';
  }
}
