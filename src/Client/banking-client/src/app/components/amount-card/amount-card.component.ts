import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-amount-card',
  imports: [],
  templateUrl: './amount-card.component.html',
  styleUrl: './amount-card.component.scss'
})
export class AmountCardComponent {
  @Input() title: string;
  @Input() amount: number;
  @Input() currency: string;
  @Input() icon: string;
}
