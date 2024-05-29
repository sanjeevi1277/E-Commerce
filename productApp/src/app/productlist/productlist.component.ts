import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductModel } from '../product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductService } from '../product.service';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {
  displayedColumns: string[] = ['productId', 'name', 'description', 'price', 'quantity', 'actions'];
  dataSource: MatTableDataSource<ProductModel>;
  pageSizeOptions: number[] = [5, 10, 25];
  pageSize = 25; // Initial page size
  isAdmin: boolean = false;
  islogin: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private authService:AuthService,private productService: ProductService, private http: HttpClient,private router: Router,private snackBar: MatSnackBar) {
    this.dataSource = new MatTableDataSource<ProductModel>([]);

  }

  ngOnInit(): void {
    // Retrieve userRole from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.islogin = true;
      try {
        const user = JSON.parse(atob(token.split('.')[1]));
        const userRoles = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        
        // Ensure userRoles is an array and contains the 'Admin' role
        if (Array.isArray(userRoles) && userRoles.includes('Admin')) {
          this.isAdmin = true;
        }
      } catch (error) {
        console.error('Error parsing user roles:', error);
      }
    }
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.productService.getProducts().subscribe((products: ProductModel[]) => {
      this.dataSource.data = products;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    // Apply custom filter function to filter only by name
    this.dataSource.filterPredicate = (data: ProductModel, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };
  }
  
  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.fetchData(event.pageIndex, event.pageSize);
  }

  fetchData(pageIndex: number = 0, pageSize: number = this.pageSize): void {
    this.http.get<any>('https://localhost:7291/api/Products', {
      params: {
        _page: pageIndex.toString(),
        _limit: pageSize.toString()
      }
    }).subscribe((response: any) => {
      this.dataSource.data = response; // Assuming your API response is an array of products
      this.dataSource.paginator = this.paginator;
    }, (error) => {
      console.error('Error fetching data:', error);
    });
  }
  editProduct(productId: number): void {
    if (!this.isAdmin) {
      this.showSnackbar('You are not authorized to edit products.');
      return;
    }
    this.router.navigate(['/edit-product', productId]);
    console.log('Edit product with ID:', productId);
  }
  
  deleteProduct(productId: number): void {
    if (!this.isAdmin) {
      this.showSnackbar('You are not authorized to delete products.');
      return;
    }
    this.router.navigate(['/delete-product',productId]);
    console.log('Delete product with ID:', productId);
  }
  logout() {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout(); // Call logout method from AuthService
      this.router.navigate(['/login']); // Redirect to login page after logout
    }
  }
  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}