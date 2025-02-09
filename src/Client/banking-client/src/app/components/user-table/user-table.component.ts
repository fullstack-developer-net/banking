import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {
onSearchTextChange($event: Event) {
  console.log('Search Text Changed', $event);
}

  constructor() { }

  ngOnInit() {
  }

}
