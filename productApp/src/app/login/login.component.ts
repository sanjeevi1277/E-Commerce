import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  domainName: string="";
  returnUrl: string='';

  hide = true; // Initially hide password
  constructor(private fb: FormBuilder, private authService: AuthService,private route: ActivatedRoute, private router: Router,private snackBar: MatSnackBar) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/product-list';

    this.authService.logout();
  }

  onSubmit() {
    if (this.loginForm.valid) {

      this.isLoading = true; // Show loading spinner
      setTimeout(() => { // Simulate 2 seconds delay before API call
        const formData = this.loginForm.value;
        this.authService.login(formData).subscribe(
          (response: any) => {
            // Assuming the backend returns a token
            const token = response.token;
            localStorage.setItem('token', token); // Store the token in localStorage
            this.router.navigateByUrl(this.returnUrl);
            this.snackBar.open('Login successful', 'Close', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right'
            });

          },
          error => {
            this.isLoading = false; // Hide loading spinner on API call error
            if (error.status === 401) {
              this.snackBar.open('Invalid Credentials', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            }
          else if (error.status === 500 && error.error?.message === 'User Not Verified!') {
              this.snackBar.open('User Not Verified!', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            }
            else {
              this.snackBar.open('Login failed', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            }
          }
        );
      }, 1000); // Simulate 2 seconds delay
    }
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault(); // Prevent default button behavior
    this.hide = !this.hide; // Toggle the hide property
  }
}
