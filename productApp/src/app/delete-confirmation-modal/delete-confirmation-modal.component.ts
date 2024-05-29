import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-delete-confirmation-modal',
  templateUrl: './delete-confirmation-modal.component.html',
  styleUrls: ['./delete-confirmation-modal.component.css']
})
export class DeleteConfirmationModalComponent {
   // Input property to receive the productId

  product!: ProductModel; // Property to hold the fetched product data
  isLoading = false;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
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

  fetchProductById(productId: number): void {
    this.isLoading = true;
    this.productService.getProductById(productId).subscribe(
      (product: ProductModel) => {
        this.product = { ...product }; // Update product with fetched data
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching product:', error);
        this.isLoading = false;
        // Handle error scenario (e.g., display error message)
      }
    );
  }

  onDelete(): void {
    this.isLoading = true;
    setTimeout(() =>{
      this.productService.deleteProduct(this.product.productId).subscribe(
        () => {
          console.log('Product deleted successfully');
          this.router.navigate(['/product-list']); // Navigate to the product list page after successful deletion
          this.showSnackBar('Product deleted successfully');
        },
        (error) => {
          console.error('Error deleting product:', error);
          this.isLoading = false;
          this.showSnackBar('Error deleting product');
          // Handle error scenario (e.g., display error message)
        }
      );
    },1000)
    
  }

  onCancel(): void {
    this.router.navigate(['/product-list']); // Navigate to the product list page without deleting
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}