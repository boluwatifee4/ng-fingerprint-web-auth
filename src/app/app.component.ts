import { Component } from '@angular/core';
import { WebAuthnService } from './core/services/webauthn.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fingerprint-ng';

  message: string | null = null;
  isSuccess: boolean = false;

  constructor(private webAuthnService: WebAuthnService) { }

  async register() {
    try {
      const credential = await this.webAuthnService.register();
      this.message = "Registration successful!";
      this.isSuccess = true;
    } catch (err) {
      this.message = "Registration failed. Please try again.";
      this.isSuccess = false;
    }
  }

  async login() {
    try {
      const credential = await this.webAuthnService.authenticate();
      this.message = "Authentication successful!";
      this.isSuccess = true;
    } catch (err) {
      this.message = "Authentication failed. Please try again.";
      this.isSuccess = false;
    }
  }
}
