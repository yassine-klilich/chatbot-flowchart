import { Injectable } from '@angular/core';
import { BrowserJsPlumbInstance, newInstance } from '@jsplumb/browser-ui';
import { Subject } from 'rxjs';
import { MessageComponent } from '../flowchart/widget/message/message.component';

@Injectable({
  providedIn: 'root',
})
export class FlowchartService {
  widgets: Widget[] = [
    {
      id: 100,
      type: 'message',
      content: 'Hello there, how can I help you ?',
      position: {
        top: 48,
        left: 188,
      },
    },
    {
      id: 200,
      type: 'collect',
      content: 'Hello there, how can I help you ?',
      position: {
        top: 250,
        left: 188,
      },
      parentWidget: 100,
    },
  ];
  instance!: BrowserJsPlumbInstance;
  changes: Subject<any> = new Subject();
  remove: Subject<any> = new Subject();
  readonly widgetTypes: Record<WidgetType, WidgetType[]> = {
    message: ['message', 'collect'],
    collect: ['message', 'collect'],
    api: [],
    assistant: [],
    end: [],
  };

  addWidget(widget: Widget) {
    this.widgets.push(widget);
  }

  removeWidget(widget: Widget) {
    const index = this.widgets.indexOf(widget);
    if (index > -1) {
      if (widget.parentWidget) {
        this.widgets.forEach((i) => {
          if (i.parentWidget == widget.id) {
            i.parentWidget = widget.parentWidget;
          }
        });
      }
      this.widgets.splice(index, 1);
    }
  }
}

export interface Widget {
  id: number;
  type: WidgetType;
  content: string;
  position: {
    top: number;
    left: number;
  };
  parentWidget?: number;
}

export type WidgetType = 'message' | 'collect' | 'api' | 'assistant' | 'end';
