import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Chatbot, OpenAIMessage } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class ChatbotApiService {
  http = inject(HttpClient);

  private apiUrl = 'http://127.0.0.1:5000';

  constructor() {}

  getChatbots(): Observable<Chatbot[]> {
    return this.http.get<Chatbot[]>(`${this.apiUrl}/api`);
  }

  getChatbot(id: string): Observable<Chatbot> {
    const url = `${this.apiUrl}/api/${id}`;
    return this.http.get<Chatbot>(url);
  }

  postChatbot(chatbot: Chatbot): Observable<Chatbot> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Chatbot>(`${this.apiUrl}/api`, chatbot, { headers });
  }

  putChatbot(id: string, chatbot: Chatbot): Observable<Chatbot> {
    const url = `${this.apiUrl}/api/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Chatbot>(url, chatbot, { headers });
  }

  updateChatbotName(id: string, name: string): Observable<Chatbot> {
    const url = `${this.apiUrl}/api/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Chatbot>(url, { name }, { headers });
  }

  deleteChatbot(id: string): Observable<void> {
    const url = `${this.apiUrl}/api/${id}`;
    return this.http.delete<void>(url);
  }

  evaluateMessage(messages: OpenAIMessage[]) {
    const url = `${this.apiUrl}/openai`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(url, { messages }, { headers });
  }
}
