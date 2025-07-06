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

    const toast = await this.toastController.create({
      message: 'Bienvenido!',
      duration: 1500,
      position: 'top',
    });

    await toast.present();

    var formData: any = new FormData();
    this.router.navigate(['/home']);
    /*  if(this.formData.valid){
        this.isLoading = true
        formData.append('email', this.formData.get('email').value);
        formData.append('password', this.formData.get('password').value);
        console.log(this.formData)
        this.auth.userLogin(formData).subscribe((data:any)=>{
          console.log(data);
        });
      }*/
  }

  register() {
    var formData: any = new FormData();
    if (this.formData.valid) {
      this.isLoading = true
      formData.append('name', this.formData.get('name').value);
      formData.append('email', this.formData.get('email').value);
      formData.append('password', this.formData.get('password').value);
      console.log(this.formData)
      this.auth.userRegister(formData).subscribe((data: any) => {
        console.log(data);
      });
    }
  }

}
