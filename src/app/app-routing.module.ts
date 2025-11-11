import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { FiAdminComponent } from './fi-admin/fi-admin.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CartComponent } from './cart/cart.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderListComponent } from './order-list/order-list.component';
import { CheckoutComponent } from './checkout/checkout.component';

const routes: Routes = [
  {path:"",component:DashBoardComponent},
  {path:"~fiadmin",component:FiAdminComponent},
  {path:"register",component:RegisterComponent},
  {path:"login",component:LoginComponent},
  {path:"cart",component:CartComponent},
  {path:"orders",component:OrderDetailsComponent},
  {path:"orders/:id",component:OrderListComponent},
  {path:"checkout",component:CheckoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
