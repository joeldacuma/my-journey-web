import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, 
         FormsModule, 
         FormGroup, 
         FormBuilder } from '@angular/forms';
import { PrimengModule } from '@modules/index';

import { ILoginProps } from '@interfaces/index';

import { LoginForm } from '@forms/index';
import { AgendaService } from '@api/index';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private agendaService = inject(AgendaService);
  private formBuilder = inject(FormBuilder);
  public loginFormGroup = new FormGroup<ILoginProps>(LoginForm);

  ngOnInit() {}

  onSubmit() {
    if (this.loginFormGroup.invalid) {
     return
    }
    console.log(this.loginFormGroup.value);
  };

  constructor() {
   this.loginFormGroup = this.formBuilder.group(LoginForm);
  }
}
