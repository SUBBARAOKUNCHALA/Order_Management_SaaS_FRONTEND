import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount?: number;
  imageUrl: string;
  createdAt?: string;
  sizes: string[];
  selectedSize?: string;
  quantity?: number;
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
  
})
export class DashBoardComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  quantity: number = 1; // Default value
  liked: any;
  private timeoutId: any;
  selectedProduct: Product | null = null;
  zoomImage: string | null = null;

  currentYear = new Date().getFullYear();


  constructor(
    private router: Router,
    private adminservice: AdminServiceService
  ) { }

  ngOnInit(): void {
    this.fetchProducts()
    const token = localStorage.getItem("token");

  if (!token) {
    this.timeoutId = setTimeout(() => {
      this.router.navigate(['/register']);
    }, 5000);
  }

  }

  ngOnDestroy(): void {
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
  }
}

  fetchProducts(): void {
    this.adminservice.getAllProducts().subscribe({
      next: (data) => {
        console.log('✅ Fetched products:', data);
        this.products = data.map(product => ({
          ...product,
          imageUrl: product.imageUrl,   // ✅ FIXED
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          selectedSize: '',
          quantity: 1
        }));
      },
      error: (err) => {
        console.error('❌ Failed to fetch products', err);
      }
    });
  }

  get paginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }



  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  viewDetails(product: Product) {
    this.selectedProduct = product;
    this.selectedProduct = { ...product, quantity: product.quantity || 1 };
  }

  closeDetails() {
    this.selectedProduct = null;
  }
  openZoom(imageUrl: string) {
    this.zoomImage = imageUrl;
  }

  closeZoom() {
    this.zoomImage = null;
  }

  increaseQuantity(product: any) {
    if (product.quantity) {
      product.quantity++;
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity && product.quantity > 1) {
      product.quantity--;
    }
  }

  addToCart(product: any) {

    const token = localStorage.getItem('token');
    console.log("TOKEN FOUND:", token);

    if (!token) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You must login before adding to cart'
      }).then(() => {
        this.router.navigate(['/login']);
      });
      return;
    }

    if (!product.selectedSize) {
      Swal.fire('Select Size', 'Please choose a size before adding to cart', 'warning');
      return;
    }

    this.adminservice.AddToCart(product._id, product.quantity, product.selectedSize)
      .subscribe({
        next: (res) => {
          Swal.fire({
            title: 'Product added to cart!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Go to Cart',
            cancelButtonText: 'Continue Shopping'
          }).then(result => {
            if (result.isConfirmed) {
              this.router.navigate(['/cart']);
            }
          });
        },
        error: (err) => console.error("Add to cart error:", err)
      });
  }
  logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  this.router.navigate(['/login']);
}
}
