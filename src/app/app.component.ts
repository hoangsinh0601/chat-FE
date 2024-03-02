import { Component, OnInit } from '@angular/core';
import { WebsocketService } from '@services/websocket';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly _wsService: WebsocketService) {}

  ngOnInit(): void {
    this._wsService.connect().subscribe({
      next: () => {
        console.log('connected to socket server');
      },
      error: () => {
        console.log('unabled to connect to socket server');
      },
    });
  }
}
