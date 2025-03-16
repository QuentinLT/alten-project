import { Component } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  styleUrls: ["./contact-form.component.scss"],
  standalone: true,
  imports: [FormsModule, ButtonModule],
})
export class ContactFormComponent {
  email: string = "";
  message: string = "";
  messageEnvoye: boolean = false;
  showErrors: boolean = false;

  public sendMessage() {
    if (!this.email || !this.message) {
      this.showErrors = true;
      this.messageEnvoye = false;
    } else {
    this.messageEnvoye = true;
    this.showErrors = false;
    this.email = "";
    this.message = "";
    }
  }
}
