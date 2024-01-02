import { Validators, FormControl } from "@angular/forms";

export const LoginForm = {
  email: new FormControl('', {
    validators: [Validators.required, Validators.email],
  }),
  password: new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(8)
    ],
  }),
};
