import { Validators, FormControl } from "@angular/forms";

export const EventForm = {
  name: new FormControl('', {
    validators: [Validators.required],
  }),
  eventCategory: new FormControl('', {
    validators: [
      Validators.required,
    ],
  }),
  location: new FormControl('', {
    validators: [
      Validators.required,
    ],
  }),
  dateTimeStart: new FormControl('', {
    validators: [
      Validators.required,
    ],
  }),
};