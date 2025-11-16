import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from './encrypt.service';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';


@Injectable({ providedIn: 'root' })
export class RegisterService {

  private api = `${environment.backendUrl}/api/auth`;

  constructor(private http: HttpClient, private enc: EncryptionService) {}

  async register(user: { name: string; email: string; password: string }) {
    try {
      // Encrypt fields
      const nameEnc = await this.enc.encrypt(user.name);
      const emailEnc = await this.enc.encrypt(user.email);
      const passEnc = await this.enc.encrypt(user.password);

      const payload = {
        name: nameEnc,
        email: emailEnc,
        password: passEnc
      };

      // API call
      const response = await firstValueFrom(
        this.http.post<any>(`${this.api}/register`, payload)
      );

      return response;
    } catch (error: any) {
      throw error.error || { message: "Something went wrong" };
    }
  }

  async login(email: string, password: string) {
    const emailEnc = await this.enc.encrypt(email);
    const passEnc = await this.enc.encrypt(password);

    const payload = { email: emailEnc, password: passEnc };

    return firstValueFrom(
      this.http.post<any>(`${this.api}/login`, payload)
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
