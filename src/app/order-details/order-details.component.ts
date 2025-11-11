
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../admin-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent {

   orders: any[] = [];
  loading = true;

  constructor(
    private service: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.service.getAllOrders().subscribe((res: any) => {
      this.orders = res;
      this.loading = false;
    });
  }

  viewOrder(id: string) {
    this.router.navigate(['/orders', id]);
  }

cancelOrder(id: string) {
  Swal.fire({
    title: "Cancel Order?",
    text: "Are you sure you want to cancel this order?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, Cancel",
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.deleteOrder(id).subscribe(() => {

        Swal.fire({
          title: "Cancelled!",
          text: "The order has been cancelled.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });

        this.loadOrders();
      });
    }
  });
}

}
