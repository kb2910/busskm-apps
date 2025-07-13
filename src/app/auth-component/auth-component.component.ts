import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { IonButton, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-auth-component',
  templateUrl: './auth-component.component.html',
  styleUrls: ['./auth-component.component.scss'],
})
export class AuthComponentComponent implements OnInit {
  screen: 'signin' | 'signup' | 'forget' = 'signin';
  formData: FormGroup;
  isLoading: boolean = false;
  showPassword = false;


  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toastController: ToastController) {
    this.formData = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() { }

  change(event) {
    this.screen = event;
  }

  async login() {
    this.isLoading = true
    const body = {
      correo: this.formData.get('email').value,
      clave: this.formData.get('password').value
    }
    this.auth.userLogin(body).subscribe((data: any) => {
      this.router.navigate(['/home']);
      this.formData.reset()
      localStorage.setItem("token", data.data_send?.token);
      localStorage.setItem("dataUsers", JSON.stringify(data.data_send));
      this.isLoading = false
    }, error => {
      this.isLoading = false;
    });
  }

  register() {
    var formData: any = new FormData();
    if (this.formData.valid) {
      this.isLoading = true
      formData.append('name', this.formData.get('name').value);
      formData.append('email', this.formData.get('email').value);
      formData.append('password', this.formData.get('password').value);
      this.auth.userRegister(formData).subscribe((data: any) => {
        console.log(data);
      });
    }
  }


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


}
