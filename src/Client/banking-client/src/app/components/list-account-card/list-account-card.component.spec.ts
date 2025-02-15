import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListAccountCardComponent } from './list-account-card.component';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { of } from 'rxjs';

describe('ListAccountCardComponent', () => {
  let component: ListAccountCardComponent;
  let fixture: ComponentFixture<ListAccountCardComponent>;
  let mockAccountsService: jasmine.SpyObj<AccountsService>;

  beforeEach(async () => {
    mockAccountsService = jasmine.createSpyObj('AccountsService', ['getListAccounts', 'createAccount']);
    mockAccountsService.getListAccounts.and.returnValue(of({ items: [] }));
    mockAccountsService.createAccount.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        ListAccountCardComponent,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AccountsService, useValue: mockAccountsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.accountForm.get('fullName')?.value).toBe('');
    expect(component.accountForm.get('email')?.value).toBe('');
    expect(component.accountForm.get('initialBalance')?.value).toBe(0);
  });

  it('should validate required fields', () => {
    const form = component.accountForm;
    expect(form.valid).toBeFalsy();

    form.controls['fullName'].setValue('John Doe');
    form.controls['email'].setValue('invalid-email');
    expect(form.valid).toBeFalsy();

    form.controls['email'].setValue('john@example.com');
    form.controls['initialBalance'].setValue(100);
    expect(form.valid).toBeTruthy();
  });
});
