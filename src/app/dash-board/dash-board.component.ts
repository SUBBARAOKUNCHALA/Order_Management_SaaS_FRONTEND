import { Component, OnInit, OnDestroy } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

interface Product {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  discount?: number;
  sizes: string[];
  createdAt?: string;
  imagePath: string;
  imageUrl: string;
  selectedSize?: string;
  quantity?: number;
}

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.scss'],
})
export class DashBoardComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 8;
  private timeoutId: any;
  selectedProduct: Product | null = null;
  zoomImage: string | null = null;
  mobileMenu: boolean = false;
  pageOptions: any[] = [];

  currentYear = new Date().getFullYear();

  isProductDialogVisible: boolean = false;
isZoomDialogVisible: boolean = false;

  constructor(
    private router: Router,
    private adminservice: AdminServiceService,
     private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

fetchProducts(): void {
  this.spinner.show();   //  SHOW SPINNER

  this.adminservice.getAllProducts().subscribe({
    next: (data) => {
      this.products = data.map(product => ({
        ...product,
        imagePath: product.imagePath,
        imageUrl: product.imagePath.startsWith('http')
          ? product.imagePath
          : environment.backendUrl + product.imagePath,
        sizes: Array.isArray(product.sizes) ? product.sizes : [],
        selectedSize: '',
        quantity: 1
      }));

      console.log('Products fetched successfully', this.products);
      this.currentPage = 1;
      this.updateDropdownOptions();
      setTimeout(()=>{
        this.spinner.hide();
      },3000)
        //  HIDE SPINNER
    },
    error: (err) => {
      console.error(' Failed to fetch products', err);
      this.spinner.hide();  //  HIDE EVEN ON ERROR
    }
  });
}

get paginatedProducts() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  return this.products.slice(start, end);
}


  get totalPages() {
    return Math.ceil(this.products.length / this.itemsPerPage);
  }

 nextPage() {
  if (this.currentPage < this.totalPages) {
    this.currentPage++;
  }
}

prevPage() {
  if (this.currentPage > 1) {
    this.currentPage--;
  }
}
  toggleMobileMenu() {
  this.mobileMenu = !this.mobileMenu;
}

navigate(route: string) {
  this.mobileMenu = false;
  this.navigateTo(route);
}

  navigateTo(path: string) {
    this.router.navigate([`/${path}`]);
  }

  viewDetails(product: Product) {
  this.selectedProduct = { ...product, quantity: product.quantity || 1 };
  this.isProductDialogVisible = true;
}

closeDetails() {
  this.isProductDialogVisible = false;
  this.selectedProduct = null;
}

openZoom(imageUrl: string) {
  this.zoomImage = imageUrl;
  this.isZoomDialogVisible = true;
}

closeZoom() {
  this.isZoomDialogVisible = false;
  this.zoomImage = null;
}


  increaseQuantity(product: Product) {
    if (product.quantity) product.quantity++;
  }

  decreaseQuantity(product: Product) {
    if (product.quantity && product.quantity > 1) product.quantity--;
  }

addToCart(product: Product) {
  this.closeDetails();
  const token = localStorage.getItem('token');

  if (!token) {
    Swal.fire({
      icon: 'warning',
      title: 'Please Login',
      text: 'You must login before adding to cart'
    }).then(() => this.router.navigate(['/login']));
    return;
  }

  if (!product.selectedSize) {
    Swal.fire('Select Size', 'Please choose a size before adding to cart', 'warning');
    return;
  }

  this.adminservice.AddToCart(product._id, product.quantity!, product.selectedSize!)
    .subscribe({
      next: () => {
        this.isProductDialogVisible = true;
        Swal.fire({
          title: 'Product added to cart!',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Go to Cart',
          cancelButtonText: 'Continue Shopping'
        }).then(result => {
          if (result.isConfirmed) this.router.navigate(['/cart']);
        });
      },
      error: (err: any) => {
        console.error("Add to cart error:", err);
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
}

  updateDropdownOptions() {
  this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1
  }));
}


  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.router.navigate(['/login']);
  }

  goToPage() {
}
}
