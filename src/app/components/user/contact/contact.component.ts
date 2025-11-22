import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../../service/contact.service';
import { HttpClientModule } from '@angular/common/http';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

interface ContactResponse {
  success: boolean;
  message?: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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
  formErrors: FormErrors = {};
  isSubmitted: boolean = false;

  constructor(private contactService: ContactService) {}

  // Validation patterns
  private validationPatterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[\+]?[0-9\s\-\(\)]{10,}$/,
    name: /^[a-zA-Z\s]{2,50}$/
  };

  // Field validation functions - return string or undefined instead of null
  private validateName(): string | undefined {
    if (!this.contact.name.trim()) {
      return 'Name is required';
    }
    if (!this.validationPatterns.name.test(this.contact.name)) {
      return 'Name should contain only letters and spaces (2-50 characters)';
    }
    return undefined;
  }

  private validateEmail(): string | undefined {
    if (!this.contact.email.trim()) {
      return 'Email is required';
    }
    if (!this.validationPatterns.email.test(this.contact.email)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  }

  private validatePhone(): string | undefined {
    if (this.contact.phone && !this.validationPatterns.phone.test(this.contact.phone)) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  }

  private validateMessage(): string | undefined {
    if (!this.contact.message.trim()) {
      return 'Message is required';
    }
    if (this.contact.message.trim().length < 10) {
      return 'Message should be at least 10 characters long';
    }
    if (this.contact.message.trim().length > 1000) {
      return 'Message should not exceed 1000 characters';
    }
    return undefined;
  }

  private validateSubject(): string | undefined {
    if (this.contact.subject && this.contact.subject.trim().length > 100) {
      return 'Subject should not exceed 100 characters';
    }
    return undefined;
  }

  // Validate individual field
  validateField(fieldName: keyof ContactForm): void {
    if (!this.isSubmitted) return;

    switch (fieldName) {
      case 'name':
        this.formErrors.name = this.validateName();
        break;
      case 'email':
        this.formErrors.email = this.validateEmail();
        break;
      case 'phone':
        this.formErrors.phone = this.validatePhone();
        break;
      case 'subject':
        this.formErrors.subject = this.validateSubject();
        break;
      case 'message':
        this.formErrors.message = this.validateMessage();
        break;
    }
  }

  // Validate entire form
  private validateForm(): boolean {
    this.formErrors = {
      name: this.validateName(),
      email: this.validateEmail(),
      phone: this.validatePhone(),
      subject: this.validateSubject(),
      message: this.validateMessage()
    };

    return !Object.values(this.formErrors).some(error => error !== undefined);
  }

  // Check if field has error
  hasError(fieldName: keyof ContactForm): boolean {
    return !!this.formErrors[fieldName] && this.isSubmitted;
  }

  // Get error message for field
  getError(fieldName: keyof ContactForm): string {
    return this.formErrors[fieldName] || '';
  }

  sendMessage(): void {
    this.isSubmitted = true;

    if (!this.validateForm()) {
      this.errorMessage = 'Please fix the validation errors before submitting.';
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      name: this.contact.name.trim(),
      email: this.contact.email.trim(),
      phone: this.contact.phone?.trim() || '',
      subject: this.contact.subject?.trim() || '',
      message: this.contact.message.trim()
    };

    this.contactService.sendContactMessage(payload).subscribe({
      next: (response: ContactResponse) => {
        this.isLoading = false;
        this.isSubmitted = false;
        this.successMessage = 'Thank you for your message! We will respond as soon as possible.';
        
        // Reset form
        this.contact = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        };
        
        this.formErrors = {};
        setTimeout(() => this.successMessage = '', 5000);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'An error occurred while sending your message. Please try again later.';
        console.error('Error sending contact message:', error);
        setTimeout(() => this.errorMessage = '', 5000);
      }
    });
  }
}