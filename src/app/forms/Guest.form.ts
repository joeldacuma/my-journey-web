import { Validators, FormControl } from "@angular/forms";

export const GuestForm = {
    name: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    nickName: new FormControl('', {
      validators: [
        Validators.required,
      ],
    }),
    birthDate: new FormControl('', {
        validators: [
          Validators.required,
        ],
      }),
    gender: new FormControl('', {
        validators: [
          Validators.required,
        ],
      }),
    email: new FormControl('', {
        validators: [
          Validators.required,
        ],
    }),
    address: new FormControl('', {
        validators: [
          Validators.required,
        ],
    }),
    mobile: new FormControl('', {
        validators: [
          Validators.required,
        ],
    }),
    remarks: new FormControl('', {
        validators: [],
    }),
    invitedByMemberName: new FormControl('', {
        validators: [],
    }),
  };