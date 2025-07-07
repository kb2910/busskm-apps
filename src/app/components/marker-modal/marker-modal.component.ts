import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-marker-modal',
  templateUrl: './marker-modal.component.html',
  styleUrls: ['./marker-modal.component.scss'],
})
export class MarkerModalComponent implements OnInit {
  @Input() title!: string;
  @Input() description!: string;
  @Input() parada!: any;

  constructor() { }

  ngOnInit() {}

}
