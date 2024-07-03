import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgClass],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'] // Corrección: styleUrls en lugar de styleUrl
})
export class RegisterComponent implements OnInit {

  contactForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      birthdate: ['', [Validators.required, this.ageValidator]],
      password: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(18)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator }); // Note the plural 'validators'
  }

  // Validador personalizado para la edad mínima de 13 años
  ageValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const birthdate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    const dayDiff = today.getDate() - birthdate.getDate();
    if (
      age < 13 ||
      (age === 13 && monthDiff < 0) ||
      (age === 13 && monthDiff === 0 && dayDiff < 0)
    ) {
      return { underage: true };
    }
    return null;
  }

  // Validador personalizado para confirmar que las contraseñas coincidan
  passwordMatchValidator(formGroup: AbstractControl): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  enviar(event: Event) {
    event.preventDefault();
    if (this.contactForm.valid) {
      const formValue = this.contactForm.value;
      const jsonData = {
        name: formValue.name,
        email: formValue.email,
        birthdate: formValue.birthdate,
        password: formValue.password,
        rol: 'user' // Valor por defecto
      };

      this.downloadJson(jsonData, 'user_data.json'); // Llamada para descargar el JSON
    } else {
      this.contactForm.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }

  downloadJson(data: any, filename: string) {
    const jsonStr = JSON.stringify(data, null, 2); // Convierte los datos a JSON
    const blob = new Blob([jsonStr], { type: 'application/json' }); // Crea un Blob con los datos JSON
    const url = window.URL.createObjectURL(blob); // Crea una URL para el Blob
    const a = document.createElement('a'); // Crea un elemento <a>
    a.href = url; // Establece el href del <a> a la URL del Blob
    a.download = filename; // Establece el atributo de descarga con el nombre del archivo
    a.click(); // Simula un clic en el <a> para iniciar la descarga
    window.URL.revokeObjectURL(url); // Revoca la URL del Blob
  }

  ngOnInit(): void {}

  hasErrors(field: string, typeError: string) {
    return this.contactForm.get(field)?.hasError(typeError) && this.contactForm.get(field)?.touched;
  }
}
