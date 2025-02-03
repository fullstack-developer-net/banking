import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestTransactionsCardComponent } from './latest-transactions-card.component';

describe('LatestTransactionsCardComponent', () => {
  let component: LatestTransactionsCardComponent;
  let fixture: ComponentFixture<LatestTransactionsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestTransactionsCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestTransactionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
