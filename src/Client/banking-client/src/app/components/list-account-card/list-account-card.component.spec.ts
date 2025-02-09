import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ListAccountCardComponent } from './list-account-card.component';
import { AccountsService } from 'src/app/shared/services/accounts/accounts.service';
import { of } from 'rxjs';

describe('ListAccountCardComponent', () => {
  let component: ListAccountCardComponent;
  let fixture: ComponentFixture<ListAccountCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAccountCardComponent, FormsModule],
      providers: [
        {
          provide: AccountsService,
          useValue: {
            getListAccounts: () => of({ items: [] })
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
