import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Item } from '../item.interface';

@Component({
  selector: 'fresh-item',
  templateUrl: './item.component.html',
  styles: [
    `
      mat-expansion-panel {
        margin: 5px 0;
      }
      .stored-in-text {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
      .date-title-text {
        color: rgba(255, 255, 255, 0.7);
      }
      mat-panel-description.right-aligned {
        flex-grow: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemComponent {
  @Input() item: Item = {
    name: '',
    storedIn: '',
    dateBought: null,
    primaryDate: null,
    userDefinedDate: null,
    useBy: null,
    bestBefore: null,
    notifyOn: null,
    createdAt: null,
    comments: '',
  };

  @Output() delete = new EventEmitter();

  @Output() edit = new EventEmitter();

  primaryDateColor(primaryDate: Date) {
    const today = new Date();
    const diffInMs = today.valueOf() - primaryDate.valueOf();
    const diffInDays = diffInMs / 1000 / 60 / 60 / 24;

    if (diffInDays < -7) {
      return '';
    }
    return '#ff8c95'; // TODO make this dynamic
  }
}
