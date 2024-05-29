import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { AddProductComponent } from './add-product/add-product.component';
import { EditProductModalComponent } from './edit-product-modal/edit-product-modal.component';
import { DeleteConfirmationModalComponent } from './delete-confirmation-modal/delete-confirmation-modal.component';
import { AuthGuard, LoginGuard } from './auth.guard';
import { AccountVerifyComponent } from './account-verify/account-verify.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent , canActivate: [LoginGuard] },
  {path:'register',component:RegisterComponent , canActivate: [LoginGuard] },
  { path: 'product-list', component: ProductlistComponent ,canActivate: [AuthGuard]},
  { path: 'add-product', component: AddProductComponent ,canActivate: [AuthGuard]},
  { path: 'edit-product/:productId', component: EditProductModalComponent ,canActivate: [AuthGuard]},
  { path: 'delete-product/:productId', component: DeleteConfirmationModalComponent ,canActivate: [AuthGuard]},
  {path:'app-account-verify',component:AccountVerifyComponent,canActivate:[AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
