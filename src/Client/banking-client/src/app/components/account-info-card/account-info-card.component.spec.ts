import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountInfoCardComponent } from './account-info-card.component';

describe('AccountInfoCardComponent', () => {
  let component: AccountInfoCardComponent;
  let fixture: ComponentFixture<AccountInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
