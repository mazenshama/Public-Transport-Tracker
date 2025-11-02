import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  sendMessage(): void {
    if (this.contact.name && this.contact.email && this.contact.message) {
      console.log('Message sent:', this.contact);
      alert('Thank you for your message! We will respond as soon as possible.');
      
      // Reset form
      this.contact = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      };
    } else {
      alert('Please fill in all required fields (Name, Email, and Message).');
    }
  }
}