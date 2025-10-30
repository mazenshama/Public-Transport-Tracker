import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
 contact = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  sendMessage() {
    console.log('Message sent:', this.contact);
    alert('Your message has been sent!');
  }
}
