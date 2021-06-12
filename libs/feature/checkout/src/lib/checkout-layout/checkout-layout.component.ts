import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { bookState, submitOrder } from '@buyonline/shared/data-access/state';

@Component({
  selector: 'buyonline-checkout-layout',
  templateUrl: './checkout-layout.component.html',
  styleUrls: ['./checkout-layout.component.scss'],
})
export class CheckoutLayoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  isFormSubmitted = false;
  constructor(
    private fb: FormBuilder,
    private store: Store<bookState>,
    public snackBar: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.pattern(/\d{10}$/),
      ]),
      address: new FormControl('', [Validators.required]),
    });
  }

  submitCheckout(): void {
    this.store.dispatch(
      submitOrder({ billingAddress: { ...this.checkoutForm.value } })
    );
    const snackBarRef = this.snackBar.open(
      'Your order is placed successfully....',
      'Go to my collection',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/my-collection']);
    });
  }
}
