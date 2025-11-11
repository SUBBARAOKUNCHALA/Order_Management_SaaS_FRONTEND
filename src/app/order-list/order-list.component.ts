import { Component } from '@angular/core';
import { AdminServiceService } from '../admin-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {

   order: any = null;
  productId: any;
  statusSteps = ["Pending", "Shipped", "Out for Delivery", "Delivered"];
  currentStep = 0;

  constructor(private router:Router,private route: ActivatedRoute, private service: AdminServiceService) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.service.getOrderDetails(id).subscribe((res: any) => {
      this.order = res;
      this.currentStep = this.statusSteps.indexOf(this.order.status);
      console.info("order details ",res,"+++",this.currentStep)

    })
  }
  GoBack(){
    this.router.navigate(['/orders']);
  }
  ContinueShoping(){
    this.router.navigate(['/']);
  }
}
