import { Component } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {

  cartItems: any[] = [];
  totalAmount = 0;

  customerName = '';
  customerPhone = '';
  shippingAddress = '';
  paymentMethod = 'COD';
  paymentQR: any = null;
showQRPopup = false;


  constructor(
    private adminService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit() {
  this.adminService.getCardsDataByUserId().subscribe((res: any) => {
    this.cartItems = res?.items || [];
    this.totalAmount = this.cartItems
      .reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);
  });
}

placeOrder() {
  const body = {
    customerName: this.customerName,
    customerPhone: this.customerPhone,
    shippingAddress: this.shippingAddress,
    paymentMethod: this.paymentMethod,
    items: this.cartItems.map(item => ({
      productId: item.product._id,
      quantity: item.quantity
    }))
  };

  this.adminService.placeOrder(body).subscribe((res: any) => {

    Swal.fire({
      title: "Order Placed!",
      text: "Your order has been successfully placed.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false
    });

    this.adminService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.totalAmount = 0;

      // ✅ Redirect after small delay so Swal finishes
      setTimeout(() => {
        this.router.navigate(['/orders']);
      }, 1200);
    });

  });
}
generateQR() {
  this.adminService.getPaymentQRForCart(this.totalAmount)
    .subscribe((res: any) => {
      this.paymentQR = res.qrImage;
      this.showQRPopup = true;
    });
}

allowOnlyNumbers(event: any) {
  const charCode = event.which ? event.which : event.keyCode;
  if (charCode < 48 || charCode > 57) {
    event.preventDefault();
  }
}


}
