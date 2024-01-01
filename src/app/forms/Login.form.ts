import { Validators, FormControl } from '@angular/forms';

export const LoginForm = {
  email: new FormControl('', { validators: [Validators.required] }),
  password: new FormControl('', { validators: [Validators.required] }),
};
