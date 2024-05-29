import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { Router } from '@angular/router';
import { RegisterModel } from '../user.model';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailValidator, passwordValidator } from '../validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  hide = true;
  domainName :string =''
  constructor(private fb: FormBuilder, private authservice: AuthService,private router: Router,private snackBar: MatSnackBar) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, emailValidator()]],
      password: ['', [Validators.required, passwordValidator()]], // Apply custom validator
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.domainName = window.location.origin ;

      var url=this.domainName + '/app-account-verify';
      console.log(this.domainName);
    if (this.registerForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        const formData = this.registerForm.value;
        if (formData.role === 'User') {
          this.authservice.registerUser(formData).subscribe(
            response => {
              // Handle successful user registration
              this.router.navigate(['/login']);
              this.snackBar.open('User registered successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            },
            error => {
              this.isLoading = false;
              console.log('Error status:', error.status);
              console.log('Error message:', error.error?.message);
              if (error.status === 500) {
                if (error.status === 500 && error.error?.message === 'User already exists!') {
                  this.snackBar.open('User already exists', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                } else {
                  this.snackBar.open('Internal Server Error', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                }
              } else {
                this.snackBar.open('Registration failed', 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                });
              }
            }
          );
        } else if (formData.role === 'Admin') {
          this.authservice.registerAdmin(formData,url).subscribe(
            response => {
              // Handle successful admin registration
              this.router.navigate(['/login']);
              this.snackBar.open('Admin registered successfully', 'Close', {
                duration: 3000,
                verticalPosition: 'top',
                horizontalPosition: 'right'
              });
            },
            error => {
              this.isLoading = false;
              console.log('Error status:', error.status);
              console.log('Error message:', error.error?.message);
              if (error.status === 500) {
                if (error.status === 500 && error.error?.message === 'User already exists!') {
                  this.snackBar.open('User already exists', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                } else {
                  this.snackBar.open('Internal Server Error', 'Close', {
                    duration: 3000,
                    verticalPosition: 'top',
                    horizontalPosition: 'right'
                  });
                }
              } else {
                this.snackBar.open('Registration failed', 'Close', {
                  duration: 3000,
                  verticalPosition: 'top',
                  horizontalPosition: 'right'
                });
              }
            }
          );
        }
        //this.isLoading = false;
      }, 1000); // Simulating a delay of 1 seconds before executing the API call
    }
  }
  togglePasswordVisibility(event: Event): void {
    event.preventDefault(); // Prevent default button behavior
    this.hide = !this.hide; // Toggle the hide property
  }

}
