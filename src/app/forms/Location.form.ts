import { Validators, FormControl } from "@angular/forms";

export const LocationForm = {
  name: new FormControl('', {
    validators: [Validators.required],
  }),
  address: new FormControl('', {
    validators: [Validators.required],
  }),
};