import { Validators, FormControl } from "@angular/forms";

export const EventForm = {
  name: new FormControl('', {
    validators: [Validators.required],
  }),
  eventCategoryId: new FormControl('', {
    validators: [
      Validators.required,
    ],
  }),
  locationId: new FormControl('', {
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