import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router } from "@angular/router";
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
} from "@angular/forms";
import { lastValueFrom, map } from "rxjs";
import { PrimengModule } from "@modules/index";
import { IAgendaLoginProps, ILoginAuthProps, IAuthProps } from "@interfaces/index";
import { LoginForm } from "@forms/index";
import { AgendaService, StrapiService } from "@api/index";
import { LocalstorageService } from '@services/index';
import { MY_JOURNEY_AUTH_CONSTANT } from '@constants/index';

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    ReactiveFormsModule,
    FormsModule,
    RouterOutlet,
  ],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private router = inject(Router);
  private agendaService = inject(AgendaService);
  private strapiService = inject(StrapiService);
  private localStorageService = inject(LocalstorageService);
  
  private formBuilder = inject(FormBuilder);

  public loginFormGroup = new FormGroup<IAgendaLoginProps>(LoginForm);

  ngOnInit() {};

  async onSubmit() {
    const { email, password } = this.loginFormGroup.value;
    const body = { identifier: email, password };

    // const authResult = await lastValueFrom(
    //   this.agendaService.login(body).pipe(
    //     map((result: ILoginAuthProps) => {
    //       if (result) {
    //         console.log(result);
    //         return;
    //       }
    //     })
    //   )
    // );

    const strapiAuthResult = await lastValueFrom(
      this.strapiService.login(body).pipe(
        map((result: IAuthProps) => {
          if (result) {
           this.localStorageService.setItem(MY_JOURNEY_AUTH_CONSTANT, result);
            this.router.navigate(['/']);
          }
        })
      )
    );
  }

  constructor() {
    this.loginFormGroup = this.formBuilder.group(LoginForm);
  }
}
