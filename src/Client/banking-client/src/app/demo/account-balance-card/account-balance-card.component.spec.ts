import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountBalanceCardComponent } from './account-balance-card.component';

describe('AccountBalanceCardComponent', () => {
  let component: AccountBalanceCardComponent;
  let fixture: ComponentFixture<AccountBalanceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountBalanceCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountBalanceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
