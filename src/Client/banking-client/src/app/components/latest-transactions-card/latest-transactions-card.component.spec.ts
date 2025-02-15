import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LatestTransactionsCardComponent } from './latest-transactions-card.component';
import { TransactionsService } from 'src/app/shared/services/transactions/transactions.service';
import { of } from 'rxjs';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

describe('LatestTransactionsCardComponent', () => {
  let component: LatestTransactionsCardComponent;
  let fixture: ComponentFixture<LatestTransactionsCardComponent>;
  let mockTransactionsService: jasmine.SpyObj<TransactionsService>;

  beforeEach(async () => {
    mockTransactionsService = jasmine.createSpyObj('TransactionsService', ['getTransactions']);
    mockTransactionsService.getTransactions.and.returnValue(of({
      items: [],
      totalItems: 0,
      currentPage: 1,
      totalPages: 1,
      pageSize: 5
    }));

    await TestBed.configureTestingModule({
      imports: [
        LatestTransactionsCardComponent,
        TransactionItemComponent,
        FormsModule
      ],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LatestTransactionsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load transactions with pagination parameters', () => {
    component.currentPage = 2;
    component.pageSize = 10;
    component.searchTerm = 'test';
    
    component.loadTransactions();

    expect(mockTransactionsService.getTransactions).toHaveBeenCalledWith({
      pageNumber: 2,
      pageSize: 10,
      searchTerm: 'test'
    });
  });

  it('should reset to first page when searching', () => {
    component.currentPage = 2;
    const event = new Event('input');
    Object.defineProperty(event, 'target', { value: { value: 'search' } });
    
    component.onSearch(event);

    expect(component.currentPage).toBe(1);
    expect(mockTransactionsService.getTransactions).toHaveBeenCalled();
  });
});
