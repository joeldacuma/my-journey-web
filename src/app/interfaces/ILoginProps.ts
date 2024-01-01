import { FormControl } from '@angular/forms';

export interface ILoginProps {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};