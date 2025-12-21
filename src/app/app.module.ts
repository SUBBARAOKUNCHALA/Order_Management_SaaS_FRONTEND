import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // ✅ Add this
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { FiAdminComponent } from './fi-admin/fi-admin.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './login/auth.interceptor';
import { CartComponent } from './cart/cart.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MenubarModule } from 'primeng/menubar';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { ChipModule } from 'primeng/chip';
import { TagModule } from 'primeng/tag';
import { SidebarModule } from 'primeng/sidebar';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StepsModule } from 'primeng/steps';
@NgModule({
  declarations: [
    AppComponent,
    DashBoardComponent,
    FiAdminComponent,
    RegisterComponent,
    LoginComponent,
    CartComponent,
    OrderListComponent,
    OrderDetailsComponent,
    CheckoutComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    FormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MenubarModule,
    CardModule,
    ButtonModule,
    DialogModule,
    PaginatorModule,
    InputTextModule,
    ChipModule,
    TagModule,
    SidebarModule,
    PasswordModule,
    ProgressSpinnerModule,
    StepsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
