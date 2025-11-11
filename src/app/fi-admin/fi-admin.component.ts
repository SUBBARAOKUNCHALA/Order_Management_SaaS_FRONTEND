import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminServiceService } from '../admin-service.service';
import { EncryptionService } from '../encrypt.service';

@Component({
  selector: 'app-fi-admin',
  templateUrl: './fi-admin.component.html',
  styleUrls: ['./fi-admin.component.scss']
})
export class FiAdminComponent {
  productForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private encryptionService: EncryptionService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      discount: [''],
      sizes: ['']
    });
  }

  /** ✅ Handle file selection */
  onFileChange(event: any) {
    this.selectedFile = event.target.files[0] ?? null;
  }

  /** ✅ Submit form */
  async onSubmit() {
    if (this.productForm.invalid || !this.selectedFile) {
      alert("Please fill all fields and select an image");
      return;
    }

    const v = this.productForm.value;

    // ✅ Encrypt text fields
    const encryptedData = {
      name: await this.encryptionService.encrypt(v.name),
      description: await this.encryptionService.encrypt(v.description),
      price: await this.encryptionService.encrypt(v.price),
      category: await this.encryptionService.encrypt(v.category),
      discount: await this.encryptionService.encrypt(v.discount || "0"),
      sizes: await this.encryptionService.encrypt(
        JSON.stringify(v.sizes ? v.sizes.split(",").map((s:any)=>s.trim()) : [])
      )
    };

    this.adminService.addProduct(encryptedData, this.selectedFile).subscribe({
      next: () => alert("✅ Product uploaded successfully"),
      error: () => alert("❌ Upload failed"),
    });
  }
}
