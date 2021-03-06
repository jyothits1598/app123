import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './views/forgot-password/forgot-password.component';
import { SignupEmailRedirectComponent } from './views/signup-email-redirect/signup-email-redirect.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./views/login/login.module').then(m => m.LoginModule)},
  { path: 'signup', loadChildren:() => import('./views/signup/signup.module').then(m => m.SignupModule)},
  { path: 'page-under-progress', loadChildren: () => import('./views/page-under-progress/page-under-progress.module').then(m => m.PageUnderProgressModule)},
  { path: 'email-token-expired', loadChildren: () => import('./views/email-token-expired/email-token-expired.module').then(m => m.EmailTokenExpiredModule)},
  
  { path: 'confirm-singup', loadChildren:() => import('./views/confirmation-signup/confirmation-signup.module').then(m => m.ConfirmationSignupModule)},
  { path: 'forgot-password', component: ForgotPasswordComponent},
  { path: 'email-verify', component: SignupEmailRedirectComponent},
  { path: 'store', loadChildren: () => import('./views/add-store-forms/add-store-forms.module').then(m => m.AddStoreFormsModule)},
  
  { path: '', loadChildren: () => import('./views/containers/containers.module').then(m => m.ContainersModule)},
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
