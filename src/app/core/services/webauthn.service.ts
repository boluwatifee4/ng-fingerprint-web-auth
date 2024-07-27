import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebAuthnService {

  constructor() { }

  // Utility function to generate a random challenge
  private generateRandomBuffer(length: number): Uint8Array {
    const randomBuffer = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuffer);
    return randomBuffer;
  }

  async register() {
    const challenge = this.generateRandomBuffer(32);

    const publicKey:any = {
      challenge: challenge,
      rp: { name: "YourApp" },
      user: {
        id: this.generateRandomBuffer(16),
        name: "user@example.com",
        displayName: "User"
      },
      pubKeyCredParams: [{ alg: -7, type: "public-key" }],
      authenticatorSelection: {
        authenticatorAttachment: "platform",
        userVerification: "required"
      }
    };

    try {
      const credential = await navigator.credentials.create({ publicKey });
      this.storeCredential(credential, challenge);
      return credential;
    } catch (err) {
      console.error("Registration failed", err);
      throw err;
    }
  }

  async authenticate() {
    const storedCredential = this.getStoredCredential();
    if (!storedCredential) {
      throw new Error("No stored credential found");
    }

    const publicKey:any = {
      challenge: new Uint8Array(storedCredential.challenge),
      allowCredentials: [{
        id: new Uint8Array(storedCredential.rawId),
        type: "public-key"
      }],
      userVerification: "required"
    };

    try {
      const credential = await navigator.credentials.get({ publicKey });
      return credential;
    } catch (err) {
      console.error("Authentication failed", err);
      throw err;
    }
  }

  private storeCredential(credential: any, challenge: Uint8Array) {
    const credentialData = {
      rawId: Array.from(new Uint8Array(credential.rawId)),
      challenge: Array.from(challenge)
    };
    localStorage.setItem('webauthn_credential', JSON.stringify(credentialData));
  }

  private getStoredCredential(): any {
    const storedCredential = localStorage.getItem('webauthn_credential');
    return storedCredential ? JSON.parse(storedCredential) : null;
  }
}
