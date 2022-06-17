import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Item, ItemDto } from '../item.interface';

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
    `,
  ],
})
export class ItemComponent implements OnInit {
  @Input() item: Item = {
    name: '',
    storedIn: '',
    dateBought: null,
    chiefDate: null,
    userDefinedDate: null,
    useBy: null,
    bestBefore: null,
    notifyOn: null,
    createdAt: null,
    comments: '',
  }; // TODO create a function which does this

  @Output() delete = new EventEmitter();

  @Output() edit = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
