import { FormControl } from '@angular/forms';

export interface IAgendaLoginProps {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
};

export interface ILoginAuthProps {
  access_token: string;
  refresh_token: string;
};
