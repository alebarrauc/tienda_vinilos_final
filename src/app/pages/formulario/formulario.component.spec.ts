import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { RegisterComponent } from './formulario.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        RegisterComponent // Importando RegisterComponent como standalone
      ],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Pruebas para el campo 'email'
  it('should have email field invalid when empty', () => {
    const email = component.contactForm.get('email');
    email?.setValue('');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['required']).toBeTruthy();
  });

  it('should have email field invalid when format is incorrect', () => {
    const email = component.contactForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();
    expect(email?.errors?.['email']).toBeTruthy();
  });

  it('should have email field valid when format is correct', () => {
    const email = component.contactForm.get('email');
    email?.setValue('test@example.com');
    expect(email?.valid).toBeTruthy();
    expect(email?.errors).toBeNull();
  });

  // Pruebas para el campo 'name'
  it('should have name field invalid when empty', () => {
    const name = component.contactForm.get('name');
    name?.setValue('');
    expect(name?.valid).toBeFalsy();
    expect(name?.errors?.['required']).toBeTruthy();
  });

  it('should have name field valid when not empty', () => {
    const name = component.contactForm.get('name');
    name?.setValue('John Doe');
    expect(name?.valid).toBeTruthy();
    expect(name?.errors).toBeNull();
  });

  // Pruebas para el campo 'birthdate'
  it('should have birthdate field invalid when empty', () => {
    const birthdate = component.contactForm.get('birthdate');
    birthdate?.setValue('');
    expect(birthdate?.valid).toBeFalsy();
    expect(birthdate?.errors?.['required']).toBeTruthy();
  });

  it('should have birthdate field invalid when age is less than 13', () => {
    const birthdate = component.contactForm.get('birthdate');
    const today = new Date();
    const underageDate = new Date(today.getFullYear() - 10, today.getMonth(), today.getDate());
    birthdate?.setValue(underageDate.toISOString().split('T')[0]);
    expect(birthdate?.valid).toBeFalsy();
    expect(birthdate?.errors?.['underage']).toBeTruthy();
  });

  it('should have birthdate field valid when age is 13 or older', () => {
    const birthdate = component.contactForm.get('birthdate');
    const today = new Date();
    const validDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());
    birthdate?.setValue(validDate.toISOString().split('T')[0]);
    expect(birthdate?.valid).toBeTruthy();
    expect(birthdate?.errors).toBeNull();
  });

  // Pruebas para el campo 'password'
  it('should invalidate the form if the password is too short', () => {
    component.contactForm.controls['password'].setValue('12345');
    component.contactForm.controls['confirmPassword'].setValue('12345');
    component.contactForm.controls['password'].markAsTouched();
    expect(component.contactForm.controls['password'].valid).toBeFalse();
    const errors = component.contactForm.controls['password'].errors;
    expect(errors).toBeTruthy();
    expect(errors?.['minlength']).toBeTruthy();
  });

  it('should invalidate the form if the password is too long', () => {
    component.contactForm.controls['password'].setValue('a'.repeat(19));
    component.contactForm.controls['confirmPassword'].setValue('a'.repeat(19));
    component.contactForm.controls['password'].markAsTouched();
    expect(component.contactForm.controls['password'].valid).toBeFalse();
    const errors = component.contactForm.controls['password'].errors;
    expect(errors).toBeTruthy();
    expect(errors?.['maxlength']).toBeTruthy();
  });

  it('should validate the form if the password is within the valid length', () => {
    component.contactForm.controls['password'].setValue('validPass1');
    component.contactForm.controls['confirmPassword'].setValue('validPass1');
    component.contactForm.controls['password'].markAsTouched();
    expect(component.contactForm.controls['password'].valid).toBeTrue();
    const errors = component.contactForm.controls['password'].errors;
    expect(errors).toBeNull();
  });

  // Pruebas para la coincidencia de contraseñas
  it('should invalidate the form if passwords do not match', () => {
    component.contactForm.controls['password'].setValue('validPass1');
    component.contactForm.controls['confirmPassword'].setValue('validPass2');
    component.contactForm.updateValueAndValidity();
    const errors = component.contactForm.errors;
    expect(errors).toBeTruthy();
    expect(errors?.['passwordMismatch']).toBeTruthy();
  });

  it('should validate the form if passwords match', () => {
    component.contactForm.controls['password'].setValue('validPass1');
    component.contactForm.controls['confirmPassword'].setValue('validPass1');
    component.contactForm.updateValueAndValidity();
    const errors = component.contactForm.errors;
    expect(errors).toBeNull();
  });
});
