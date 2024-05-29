import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {
  product: ProductModel = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  };
  isLoading = false;

  constructor(private productService: ProductService, private router: Router,private snackBar: MatSnackBar) {}

  onSave(): void {
    this.isLoading = true;
    setTimeout(() => { // Simulate 2 seconds delay before API call
    this.productService.addProduct(this.product).subscribe(
      (response) => {
        console.log('Product added successfully:', response);
        this.router.navigate(['/product-list']); // Replace '/products' with your desired route
        this.snackBar.open('Product Added Successfully', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      },
      error => {
        this.isLoading = false;
        console.log('Error status:', error.status);
        console.log('Error message:', error.error?.message);

        if (error.status === 409) {
          if (error.status === 409 && error.error?.message === 'Product already exists!') {
            console.error('Error adding product:', error);
            this.router.navigate(['/add-product']);
            this.snackBar.open('Product already exists', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          } else {
            console.error('Error adding product:', error);
            this.router.navigate(['/add-product']);
            this.snackBar.open('Internal Server Error', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });
          }
        } else {
          console.error('Error adding product:', error);
          this.router.navigate(['/add-product']);
          this.snackBar.open('Adding Product Failed', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right'
        });
        }
      }
    );
    this.isLoading = false;
  }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/product-list']); // Replace '/products' with your desired route
  }
}

