import { Validators, FormControl } from "@angular/forms";

export const CategoryForm = {
  name: new FormControl('', {
    validators: [Validators.required],
  }),
};