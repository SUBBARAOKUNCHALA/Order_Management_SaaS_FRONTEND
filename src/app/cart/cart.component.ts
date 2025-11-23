import { Component } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent {

  cartItems: any[] = [];

  constructor(private adminService:AdminServiceService,private router:Router){

  }

  ngOnInit() {
    this.loadCart()
  }

    loadCart() {
    this.adminService.getCardsDataByUserId().subscribe({
      next: (response: any) => {
        this.cartItems = response.items || [];
        console.log("🛒 Cart Items:", this.cartItems);
      }
    });
  }

  // Increase quantity
  increaseQty(item: any) {
    const newQty = item.quantity + 1;
    this.updateQuantity(item.product._id, newQty);
  }

  // Decrease quantity
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      const newQty = item.quantity - 1;
      this.updateQuantity(item.product._id, newQty);
    }
  }

  // Update Quantity API
updateQuantity(productId: string, quantity: number) {
  this.adminService.updateCartItem({ productId, quantity }).subscribe({
    next: () => this.loadCart(),
    error: (err) => console.error(err)
  });
}


  // Remove Item
  removeItem(productId: string) {
    this.adminService.removeFromCart({ productId }).subscribe({
      next: () => {
        Swal.fire('Removed ✅', 'Item removed from cart', 'success');
        this.loadCart();
      }
    });
  }

  // Clear Cart
  clearCart() {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove all items!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Clear"
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.clearCart().subscribe({
          next: () => {
            this.cartItems = [];
            Swal.fire("Cleared", "Your cart is now empty!", "success");
          }
        });
      }
    });
  }
buyNow() {
  this.router.navigate(['/checkout']);
}


}
