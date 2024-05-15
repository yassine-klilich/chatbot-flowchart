import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  chats = [
    {
      _id: '123',
      name: 'Chat 001'
    },
    {
      _id: '456',
      name: 'Chat 002'
    },
    {
      _id: '789',
      name: 'Chat 003'
    },
  ]
}
