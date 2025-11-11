import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// import { JwtEncryptionService } from '../encrypt.service';
import { EncryptionService } from '../encrypt.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  name: string = "";
  email: string = ""
  password: string = ""
  isVisible = true;
  len: any = {};

  @Output() closeRegister = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private registerService: RegisterService,
    private snackBar: MatSnackBar,
    private encryptService: EncryptionService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit(): Promise<void> {
  if (!this.registerForm.valid) return;

  const { name, email, password } = this.registerForm.value;

  try {
    // Register user
    const result = await this.registerService.register({ name, email, password });
    this.encryptService.decryptAndParse(result.data)
    console.log("✅ Registered:", result);
        Swal.fire({
            title: `${result.message}!`,
            //text: `Welcome ${result.user.name}!`,
            icon: 'success',
            confirmButtonText: 'Continue',
            customClass: {
              popup: 'my-swal-popup',
              title: 'my-swal-title',
              confirmButton: 'my-swal-button'
            }
          });
    

    // Optionally auto-login if backend returns token
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    //this.snackBar.open('Registration successful!', 'Close', { duration: 2000 });
    this.router.navigate(['/login']); // go to home/dashboard
  } catch (error:any) {
    console.error("❌ Backend error:", error);
    Swal.fire({
            title: `${error.message}!`,
            //text: `Welcome ${result.user.name}!`,
            icon: 'success',
            confirmButtonText: 'Continue',
            customClass: {
              popup: 'my-swal-popup',
              title: 'my-swal-title',
              confirmButton: 'my-swal-button'
            }
          });
    //this.snackBar.open('Registration failed. Try again.', 'Close', { duration: 2000 });
  }
}
}
