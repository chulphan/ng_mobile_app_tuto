import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Page } from "tns-core-modules/ui/page";
import { Color } from "tns-core-modules/color";
import { View } from "tns-core-modules/ui/core/view";
import {TextField} from 'tns-core-modules/ui/text-field'
import { UserService } from "../../shared/user/user.service";
import { User } from "../../shared/user/user";
import { setHintColor } from '../../utils/hint-util'

@Component({
  selector: "gr-main",
  providers: [UserService],
  templateUrl: "./login.component.html",
  styleUrls: ["./login-common.css", "./login.css"]
})
export class LoginComponent implements OnInit {
  public user: User;
  public isLogginIn = true;

  constructor(
    private router: Router,
    private userService: UserService,
    private page: Page
  ) {
    this.user = new User();
    this.user.email = "chkim@test.com";
    this.user.password = "a12345678";
  }

  ngOnInit() {
    this.page.actionBarHidden = true;
    this.page.backgroundImage = "res://bg_login";
  }

  public submit() {
    if (!this.user.isValidEmail()) {
      alert("Enter a valid email address.");
      return;
    }
    if (this.isLogginIn) {
      this.login();
    } else {
      this.signUp();
    }
  }

  public toggleDisplay() {
    this.isLogginIn = !this.isLogginIn;
    this.setTextFieldColors();
    const container = <View>this.page.getViewById("container");
    container.animate({
      backgroundColor: this.isLogginIn
        ? new Color("white")
        : new Color("#301217"),
      duration: 200
    });
  }

  private login() {
    this.userService
      .login(this.user)
      .subscribe(
        () => this.router.navigate(["/list"]),
        error => alert("Unfortunately we could not find your account")
      );
  }

  private signUp() {
    this.userService.register(this.user).subscribe(
      () => {
        alert("Your account was successfully created.");
        this.toggleDisplay();
      },
      () => {
        alert("Unfortunately we were unable to create your account.");
      }
    );
  }

  private setTextFieldColors() {
    const emailTextField = <TextField>this.page.getViewById('email');
    const passwordTextField = <TextField>this.page.getViewById('password');

    const mainTextColor = new Color(this.isLogginIn ? 'black' : '#C4AFB4');
    emailTextField.color = mainTextColor;
    passwordTextField.color = mainTextColor;

    const hintColor = new Color(this.isLogginIn ? '#ACA6A7' : '#C4AFB4');
    setHintColor({ view: emailTextField, color: hintColor });
    setHintColor({ view: passwordTextField, color: hintColor });
  }
}
