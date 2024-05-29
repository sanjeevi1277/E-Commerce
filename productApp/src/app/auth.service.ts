import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegisterModel } from './user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private apiUrl = 'https://localhost:7291/api/Auth'; // Base URL for the API

    constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

    // registerUser(user: RegisterModel, ): Observable<any> {
    //   return this.http.post<any>(`${this.apiUrl}/register`, user)
    // }
    registerUser(user: RegisterModel): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/register`, user)
    }

    registerAdmin(user: RegisterModel,url:string): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/register-admin?url=` + url, user)
    }
    login(credentials: any): Observable<any> {
      return this.http.post<any>(`${this.apiUrl}/login`, credentials);
    }
    // login(credentials: any, url: string): Observable<any> {
    //   return this.http.post<any>(this.apiUrl+'/login?url=' +url, credentials);
    // }

    private openSnackBar(message: string, panelClass: string) {
      this.snackBar.open(message, 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: [panelClass]
      });
    }

    public saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    getAuthToken(): string | null {
        return localStorage.getItem('token');
    }

    logout() {
        localStorage.removeItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getAuthToken();
    }
    isadmin:boolean = false;
    token1!:string;
    isadmin1(): string | null {
      // Implement your logic to check if the user is an admin based on roles
      const token = localStorage.getItem('token');
      if (token) {
        const user = JSON.parse(atob(token.split('.')[1]));
        const userRoles = user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        // Ensure userRoles is an array and contains the 'Admin' role
        if (Array.isArray(userRoles) && userRoles.includes('Admin')) {
          this.isadmin = true;
          this.token1=token;
        }

      }
      return this.token1;
    }
    isAdmin(): boolean {
        return !!this.isadmin1();
      }

    createAuthorizationHeader(): { headers: { Authorization: string } } {
        const token = this.getAuthToken();
        return { headers: { Authorization: `Bearer ${token}` } };
    }
}
