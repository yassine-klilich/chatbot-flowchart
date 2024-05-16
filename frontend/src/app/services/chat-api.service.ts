import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperatorScript } from './flowchart.service';

@Injectable({
  providedIn: 'root',
})
export class ChatApiService {
  private apiUrl = 'http://127.0.0.1:5000/chats';

  constructor(private http: HttpClient) {}

  getChats(): Observable<Chat[]> {
    return this.http.get<Chat[]>(this.apiUrl);
  }

  getChat(id: string): Observable<Chat> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Chat>(url);
  }

  addChat(book: Chat): Observable<Chat> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Chat>(this.apiUrl, book, { headers });
  }

  updateChat(id: string, book: Chat): Observable<Chat> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Chat>(url, book, { headers });
  }

  deleteChat(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}

export interface Chat {
  _id?: string;
  name: string;
  operators: OperatorScript[];
}
