import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

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

  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  private apiUrl = environment.apiBaseUrl || 'https://localhost:7000';

  constructor(private http: HttpClient) {}

  sendMessage(): void {
    if (!this.contact.name || !this.contact.email || !this.contact.message) {
      this.errorMessage = 'Please fill in all required fields (Name, Email, and Message).';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      name: this.contact.name.trim(),
      email: this.contact.email.trim(),
      phone: this.contact.phone?.trim() || null,
      subject: this.contact.subject?.trim() || null,
      message: this.contact.message.trim()
    };

    this.http.post<{ success: boolean; message?: string }>(`${this.apiUrl}/api/admin/contacts`, payload)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.successMessage = 'Thank you for your message! We will respond as soon as possible.';
            // Reset form
            this.contact = {
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: ''
            };
            setTimeout(() => this.successMessage = '', 5000);
          } else {
            this.errorMessage = response.message || 'Failed to send message. Please try again.';
            setTimeout(() => this.errorMessage = '', 5000);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'An error occurred while sending your message. Please try again later.';
          console.error('Error sending contact message:', error);
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
  }
}