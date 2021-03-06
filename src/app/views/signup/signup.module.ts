import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { ReactiveFormsModule,FormsModule} from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  },
]
const routingModule = RouterModule.forChild(routes);

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    routingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SignupModule { }
