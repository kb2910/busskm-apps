import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  center = { lat: 40.7128, lng: -74.0060 };

  constructor() { }

  ngOnInit() {
  }

}
