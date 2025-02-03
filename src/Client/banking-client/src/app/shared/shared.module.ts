import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicesModule } from './services/services.module';
import { AppStateManager } from './app.state-manager';

@NgModule({
  declarations: [],
  imports: [CommonModule, ServicesModule],
  providers: []
})
export class SharedModule {}
