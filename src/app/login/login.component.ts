import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { EncryptionService } from '../encrypt.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {
  data = { email: '', password: '' };
  successMessage = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router,private registerService:RegisterService,private encryptionService:EncryptionService) {}

async login() {
  try {
    const response = await this.registerService.login(this.data.email, this.data.password);

    const result = await this.encryptionService.decryptAndParse(response.data);
    this.router.navigate(['/']);
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    console.log("✅ Response:", result);

    if (result?.token) {
      
      Swal.fire({
        title: '✅ Login Successful',
        text: `Welcome ${result.user.name}!`,
        icon: 'success',
        confirmButtonText: 'Continue',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          confirmButton: 'my-swal-button'
        }
      });

    } else {
      Swal.fire({
        title: '⚠️ Invalid',
        text: 'Invalid credentials',
        icon: 'warning'
      });
    }

  } catch (err: any) {
    console.error('❌ Login failed:', err);

    Swal.fire({
      title: '❌ Error',
      text: err?.error?.message || 'Login failed. Try again.',
      icon: 'error'
    });
  }
}
}
