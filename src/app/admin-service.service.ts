import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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

  private baseUrl = 'http://localhost:5000/api/products';
  private API = "http://localhost:5000/api/orders";


  constructor(private http: HttpClient, private router: Router) {}

addProduct(productData: any, image: File): Observable<any> {
  const formData = new FormData();

  for (let key in productData) {
    formData.append(key, JSON.stringify(productData[key]));
  }

  if (image) formData.append("image", image);

  return this.http.post(`${this.baseUrl}/fiadmin`, formData);
}

  /** GET: Fetch all products */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
  getProductImage(productId: string) {
  return this.http.get(`http://localhost:5000/api/products/${productId}/image`);
}
AddToCart(productId: string, quantity: number, size: string) {

  const token = localStorage.getItem('token'); // ✅ Correct place

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const body = {
    productId: productId,
    quantity: quantity,
    size: size
  };

  return this.http.post('http://localhost:5000/api/cart/add', body, { headers });
}

getCardsDataByUserId() {
  return this.http.get("http://localhost:5000/api/cart", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  });
}

updateCartItem(data: any) {
  return this.http.put('http://localhost:5000/api/cart/update', data);
}

removeFromCart(data: any) {
  return this.http.delete('http://localhost:5000/api/cart/remove', {
    body: data
  });
}

clearCart() {
  return this.http.delete('http://localhost:5000/api/cart/clear');
}

placeOrder(body:any) {
  return this.http.post(`${this.API}`, body);
}

getOrdersByUser() {
  return this.http.get(`${this.API}`);        // ✅ GET /api/orders
}

getOrderById(id: string) {
  return this.http.get(`${this.API}/${id}`);  // ✅ GET /api/orders/:id
}

getAllOrders() {
  return this.http.get(`${this.API}`);        // ✅ same as getOrdersByUser
}

getOrderDetails(id: string) {
  return this.http.get(`${this.API}/${id}`);  // ✅ GET /api/orders/:id
}


deleteOrder(id: string) {
  return this.http.delete(`${this.API}/${id}`); // ✅ DELETE /api/orders/:id
}
getPaymentQRForCart(amount: number) {
  return this.http.get(`http://localhost:5000/api/payment/qr?amount=${amount}`);
}
}
