import { Validators } from '@angular/forms';

export const LoginForm = {
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(6)]],
};
