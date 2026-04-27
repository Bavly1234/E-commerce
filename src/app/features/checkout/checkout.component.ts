import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/auth/services/cart.service';

@Component({
  selector: 'app-checkout',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute)
  private readonly router = inject(Router)
  private readonly fb = inject(FormBuilder)
  private readonly cartService = inject(CartService)
  flag = signal<string>("cash")
  cartId = signal<string>("")
  checkOut: FormGroup = this.fb.group({

    shippingAddress: this.fb.group({

      details: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', Validators.required],

    })
  })




  ngOnInit(): void {
  this.cartService.getLoggedUserCart().subscribe({
    next: (res) => {
      console.log('Cart ID:', res.data._id);
      this.cartId.set(res.data._id);
    }
  });
}



  getCartID(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      console.log(params.get('id'));
      this.cartId.set(params.get('id')!);
    });
  }


  submitForm(): void {
    if (this.checkOut.valid) {

      if (this.flag() === "cash") {
        console.log('Cash on Delivery selected');
this.cartService.createCashOrder(this.cartId(), this.checkOut.value).subscribe({
  next:(res)=>{
    console.log(res);
    if(res.status === 'success') {
this.router.navigate(['/allorders']);
    }
  }
})




      } else {
        console.log('Visa selected');
        this.cartService.createVisaOrder(this.cartId(), this.checkOut.value).subscribe({
          next:(res)=>{
            console.log(res);
            if(res.status === 'success') {
              window.open(res.session.url, '_self');
            }
          }
        })

      }
    }

  }


  changeFlag(ref: HTMLInputElement): void {
    this.flag.set(ref.value);
    console.log(this.flag());
  }
}
