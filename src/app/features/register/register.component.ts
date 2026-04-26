import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { AuthService } from '../../core/auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
    toastr = inject(ToastrService);


  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)]],
    rePassword: ['', [Validators.required]],
    phone: ['', [Validators.required, Validators.pattern('^01[0125][0-9]{8}$')]],
  },{ validators: this.confirmPassword }
  );
  
  
  confirmPassword(group:AbstractControl){
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

  if(password !== rePassword  && rePassword !== "") {
    group.get('rePassword')?.setErrors({ misMatch: true });
    return { misMatch: true };
  } 
  return null;
  
  
  
}
submitForm() {
    // Check if the form is valid before submission because if user open the inspect and remove the disabled
      if (this.registerForm.valid) {
        this.authService.signUp(this.registerForm.value).subscribe({
          next: (res) => {
            if(res.message === "success") {
            this.router.navigate(['/login']);
            }
              this.toastr.success(res.message, 'Registration Successful');
          },
          error: (err) => {
            console.error('Registration failed:', err);
            this.toastr.error('Registration failed. Please try again.', 'Error');
          }
        });
      } else {
        this.registerForm.markAllAsTouched();
      }
    
  }
}