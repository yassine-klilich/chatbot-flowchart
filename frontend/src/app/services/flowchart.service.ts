import { Injectable } from '@angular/core';
import { BrowserJsPlumbInstance } from '@jsplumb/browser-ui';
import { Subject } from 'rxjs';
import { Chatbot, OperatorType } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class FlowchartService {
  chats: Chatbot[] = [
    // {
    //   _id: '123',
    //   name: 'Chat 001',
    //   operators: [
    //     {
    //       _id: '100',
    //       type: 'message',
    //       title: '',
    //       data: {
    //         content: 'Hello there :)',
    //       },
    //     },
    //     {
    //       _id: '200',
    //       type: 'message',
    //       title: 'help',
    //       data: {
    //         content: 'How can I help you ?',
    //       },
    //       parentOperator: '100',
    //     },
    //   ],
    // },
    // {
    //   _id: '456',
    //   name: 'Chat 002',
    //   operators: [
    //     {
    //       _id: '100',
    //       type: 'message',
    //       title: 'Welcome',
    //       data: {
    //         content: 'Hello there, how can I help you ?',
    //       },
    //     },
    //     {
    //       _id: '200',
    //       type: 'collect',
    //       title: 'Welcome',
    //       data: {
    //         content: 'Hello there, how can I help you ?',
    //       },
    //       parentOperator: '100'
    //     },
    //     {
    //       _id: '300',
    //       type: 'end',
    //       title: 'Welcome',
    //       data: {
    //         content: 'Hello there, how can I help you ?',
    //       },
    //       parentOperator: '200'
    //     },
    //   ],
    // },
    // {
    //   _id: '789',
    //   name: 'Chat 003',
    //   operators: [
    //     {
    //       _id: '100',
    //       type: 'message',
    //       title: 'Welcome',
    //       data: {
    //         content: 'Hello there, how can I help you ?',
    //       },
    //     },
    //   ],
    // },
  ];

  instance!: BrowserJsPlumbInstance;
  changes: Subject<any> = new Subject();
  remove: Subject<any> = new Subject();
  readonly operatorTypes: Record<OperatorType, OperatorType[]> = {
    message: ['message', 'collect', 'end'],
    collect: ['message', 'collect', 'end'],
    api: [],
    assistant: [],
    end: [],
  };

  deleteChat(chat: Chatbot) {
    const index = this.chats.indexOf(chat);
    if (index > -1) {
      this.chats.splice(index, 1);
    }
  }
}
