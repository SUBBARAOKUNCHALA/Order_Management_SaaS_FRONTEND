import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from './environment';


interface Product {
  sizes: boolean;
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private baseUrl = `${environment.backendUrl}/api/products`;
  private API = `${environment.backendUrl}/api/orders`;

  constructor(private http: HttpClient, private router: Router) {}

  addProduct(productData: any, image: File): Observable<any> {
    const formData = new FormData();

    for (let key in productData) {
      formData.append(key, JSON.stringify(productData[key]));
    }

    if (image) formData.append("image", image);

    return this.http.post(`${this.baseUrl}/fiadmin`, formData);
  }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getProductImage(productId: string) {
    return this.http.get(`${environment.backendUrl}/api/products/${productId}/image`);
  }

  AddToCart(productId: string, quantity: number, size: string) {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const body = { productId, quantity, size };
    
    return this.http.post(`${environment.backendUrl}/api/cart/add`, body, { headers });
  }

  getCardsDataByUserId() {
    return this.http.get(`${environment.backendUrl}/api/cart`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
  }

  updateCartItem(data: any) {
    return this.http.put(`${environment.backendUrl}/api/cart/update`, data);
  }

  removeFromCart(data: any) {
    return this.http.delete(`${environment.backendUrl}/api/cart/remove`, { body: data });
  }

  clearCart() {
    return this.http.delete(`${environment.backendUrl}/api/cart/clear`);
  }

  placeOrder(body:any) {
    return this.http.post(this.API, body);
  }

  getOrdersByUser() {
    return this.http.get(this.API);
  }

  getOrderById(id: string) {
    return this.http.get(`${this.API}/${id}`);
  }

  getAllOrders() {
    return this.http.get(this.API);
  }

  getOrderDetails(id: string) {
    return this.http.get(`${this.API}/${id}`);
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }

  getPaymentQRForCart(amount: number) {
    return this.http.get(`${environment.backendUrl}/api/payment/qr?amount=${amount}`);
  }
}
