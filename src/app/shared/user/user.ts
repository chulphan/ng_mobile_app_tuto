import * as EmailValidator from "email-validator";

export class User {
  email: string;
  password: string;

  public isValidEmail() {
    return EmailValidator.validate(this.email);
  }
}
