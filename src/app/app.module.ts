import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './state/app.reducer';

@NgModule({
  declarations: [
    // Xóa LoginComponent khỏi đây
  ],
  imports: [
    ReactiveFormsModule,
    StoreModule.forRoot(appReducers) // Cấu hình NgRx Store ở đây
  ],
})
export class AppModule { } 