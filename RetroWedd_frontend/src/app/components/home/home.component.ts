import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home.component.html',
})
export default class HomeComponent implements OnInit {
  countdown = signal({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  weddingDate = new Date('2026-06-27');
  private intervalId: any;

  updateCountdown() {
    const now = new Date();
    const diff = this.weddingDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.countdown.set({ days: '00', hours: '00', minutes: '00', seconds: '00' });
      clearInterval(this.intervalId);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    //valor con dos dígitos
    const formattedDays = String(days).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    this.countdown.set({
      days: formattedDays,
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds
    });
  }

  ngOnInit(): void {
    this.updateCountdown();
    this.intervalId = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
