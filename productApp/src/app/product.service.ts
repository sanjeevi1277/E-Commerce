import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RegisterModel } from './user.model';
import { ProductModel } from './product.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7291/api/Products'; // Base URL for the API

  constructor(private http: HttpClient,private authservice: AuthService) {}

  getProducts(): Observable<any[]> {
    const headers = this.authservice.createAuthorizationHeader();
    return this.http.get<any[]>(this.apiUrl,headers);
  }
  getProductById(productId: number): Observable<ProductModel> {
    const headers = this.authservice.createAuthorizationHeader();
    const url = `${this.apiUrl}/${productId}`;
    return this.http.get<ProductModel>(url,headers);
  }
  addProduct(product: ProductModel): Observable<ProductModel> {
    const headers = this.authservice.createAuthorizationHeader();
    return this.http.post<ProductModel>((this.apiUrl),product,headers);
  }
  updateProduct(product: ProductModel): Observable<ProductModel> {
    const headers = this.authservice.createAuthorizationHeader();
    const url = `${this.apiUrl}/${product.productId}`; // Assuming productId is part of the product model
    return this.http.put<ProductModel>(url, product,headers);
  }
  deleteProduct(productId: number): Observable<any> {
    const headers = this.authservice.createAuthorizationHeader();
    return this.http.delete(`${this.apiUrl}/${productId}`,headers);
  }
}
