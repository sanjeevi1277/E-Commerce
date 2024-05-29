import { Component, Inject, OnInit } from '@angular/core';
import { ProductModel } from '../product.model';

import { ProductService } from '../product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-edit-product-modal',
  templateUrl: './edit-product-modal.component.html',
  styleUrls: ['./edit-product-modal.component.css']
})
export class EditProductModalComponent implements OnInit {
  editedProduct: ProductModel = {
    productId: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  };
  isLoading = false;

  constructor(
    private snackBar: MatSnackBar,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute // Inject ActivatedRoute for getting route parameters
  ) {}

  ngOnInit(): void {
    // Get the productId from the route parameters
    this.route.params.subscribe((params: Params) => {
      const productId = +params['productId']; // Assuming productId is a number
      if (productId) {
        // Fetch the product data based on productId
        this.fetchProductById(productId);
      } else {
        console.error('Invalid productId:', productId);
      }
    });
  }

  onSave(): void {
    this.isLoading = true;
    setTimeout(() => { // Simulate 2 seconds delay before API call
      // Replace the below code with your actual API call to update the product
      this.productService.updateProduct(this.editedProduct).subscribe(
        (response) => {
          console.log('Product updated successfully:', response);
          this.router.navigate(['/product-list']);
          this.showSnackBar('Product updated successfully');
        },
        (error) => {
          this.isLoading = false;
          console.error('Error updating product:', error);
          this.showSnackBar('Error updating product');
        }
      );
    }, 1000);
  }

  onCancel(): void {
    this.router.navigate(['/product-list']);
  }

  private fetchProductById(productId: number): void {
    this.productService.getProductById(productId).subscribe(
      (product: ProductModel) => {
        this.editedProduct = { ...product }; // Update editedProduct with fetched product data
      },
      (error) => {
        console.error('Error fetching product:', error);
      }
    );
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
