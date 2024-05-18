import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Chatbot } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class ChatbotApiService {
  http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:5000/chatbots';

  constructor() {}

  getChatbots(): Observable<Chatbot[]> {
    return this.http.get<Chatbot[]>(this.apiUrl);
  }

  getChatbot(id: string): Observable<Chatbot> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Chatbot>(url);
  }

  postChatbot(chatbot: Chatbot): Observable<Chatbot> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Chatbot>(this.apiUrl, chatbot, { headers });
  }

  putChatbot(id: string, chatbot: Chatbot): Observable<Chatbot> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Chatbot>(url, chatbot, { headers });
  }

  deleteChatbot(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
