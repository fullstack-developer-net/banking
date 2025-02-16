import { TestBed } from '@angular/core/testing';
import { AccountsService } from './accounts.service';
import { BaseApi } from '../base-api.service';
import { of } from 'rxjs';

describe('AccountsService', () => {
  let service: AccountsService;
  let mockBaseApi: jasmine.SpyObj<BaseApi>;

  beforeEach(() => {
    mockBaseApi = jasmine.createSpyObj('BaseApi', ['post']);
    mockBaseApi.post.and.returnValue(of({}));

    TestBed.configureTestingModule({
      providers: [
        AccountsService,
        { provide: BaseApi, useValue: mockBaseApi }
      ]
    });
    service = TestBed.inject(AccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call change password endpoint with correct request format', () => {
    const mockData = {
      userId: '123',
      oldPassword: 'old',
      newPassword: 'new',
      confirmPassword: 'new'
    };

    const expectedRequest = {
      changePasswordDto: mockData
    };

    service.changePassword(mockData);

    expect(mockBaseApi.post).toHaveBeenCalledWith(
      `${service.baseApiUrl}/users/password`,
      expectedRequest
    );
  });
});
