import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionItemComponent } from './transaction-item.component';

describe('TransactionItemComponent', () => {
  let component: TransactionItemComponent;
  let fixture: ComponentFixture<TransactionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format amount correctly', () => {
    component.amount = 1234.56;
    expect(component.formattedAmount).toContain('$1,234.56');
  });

  it('should format date correctly', () => {
    const testDate = new Date('2024-03-20T10:30:00');
    component.transactionTime = testDate;
    expect(component.formattedDate).toMatch(/Mar 20, 2024/);
  });

  it('should return correct status class', () => {
    component.status = 'COMPLETED';
    expect(component.statusClass).toBe('completed');
  });
});
