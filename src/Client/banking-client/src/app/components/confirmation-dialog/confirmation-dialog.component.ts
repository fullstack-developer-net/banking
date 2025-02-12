import { Component, OnInit, TemplateRef } from '@angular/core';
import { MoneyTransferComponent } from "../money-transfer/money-transfer.component";

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss'],
  imports: [MoneyTransferComponent]
})
export class ConfirmationDialogComponent implements OnInit {

  constructor() {}

  ngOnInit() {}
}
