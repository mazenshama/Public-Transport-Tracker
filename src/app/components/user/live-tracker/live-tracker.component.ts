import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-live-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './live-tracker.component.html',
  styleUrl: './live-tracker.component.css'
})
export class LiveTrackerComponent {
 buses = [
    { number: 12, description: 'ayhaga dlwaaty' },
    { number: 12, description: 'ayhaga dlwaaty' },
    { number: 12, description: 'ayhaga dlwaaty' },
    { number: 12, description: 'ayhaga dlwaaty' },
    { number: 12, description: 'ayhaga dlwaaty' },
  ];
}
