import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrer-modal',
  templateUrl: './registrer-modal.component.html',
  styleUrls: ['./registrer-modal.component.scss']
})
export class RegisterModalComponent {
  registerForm: FormGroup;
  isOpenModal = true;
  showPassword = false;
  showConfirmPassword = false;
  showSuccess = false;
  showError = false;
  successMessage = '¡Registro exitoso!';
  errorMessage = 'Ocurrió un error al registrar';
  steps = 0;

  // Simula tu objeto con más datos
  formData = {
    roles: '',
    nombre: '',
    fecha_nacimiento: '',
    correo: '',
    clave: '',
    confirmarClave: ''
  };

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      roles: ['', Validators.required],
      nombre: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(8)]],
      confirmarClave: ['', Validators.required]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  handleSubmit() {
    if (this.registerForm.invalid) return;

    const { clave, confirmarClave } = this.registerForm.value;
    if (clave !== confirmarClave) {
      this.errorMessage = 'Las contraseñas no coinciden';
      this.showError = true;
      return;
    }

    // Simula el envío
    this.showSuccess = true;
  }

  handleNextStep() {
    this.steps++;
  }

  handlePrevStep() {
    this.steps--;
  }

  handleOpenModal() {
    this.isOpenModal = false;
  }

  setShowSuccess(value: boolean) {
    this.showSuccess = value;
  }

  setShowError(value: boolean) {
    this.showError = value;
  }

  handleSuccessRedirect() {
    // Redirección o acción después del éxito
    this.isOpenModal = false;
  }
}
