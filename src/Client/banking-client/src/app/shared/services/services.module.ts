import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from 'src/app/core/core.module';
import { BaseApi } from './base-api.service';
import { AuthService } from './auth/auth.service';
import { AccountsService } from './accounts/accounts.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, CoreModule],
  providers: [BaseApi, AuthService, AccountsService]
})
export class ServicesModule {}
