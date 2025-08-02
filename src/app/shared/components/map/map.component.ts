import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { icon, latLng, LeafletMouseEvent, Marker, marker, MarkerOptions, tileLayer } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { Coordinate } from './coordinate';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  ngOnInit(): void {
   this.layers = this.InitialCoordinates.map(value => {
    const newMarker = marker([value.latitude, value.longitude], this.markerOptions);
    if(value.text){
      newMarker.bindPopup(value.text,{autoClose:false,autoPan:false});
    }
    return newMarker;
    });
  }

  @Input()
  readOnly = false;
  @Input()
  InitialCoordinates: Coordinate[] = [];
  @Output()
  selectedCoordinate = new EventEmitter<Coordinate>();
  markerOptions: MarkerOptions = {
    icon: icon({
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      iconUrl: 'assets/marker-icon.png',
      iconRetinaUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
    })
  }
options = {
	layers: [
		tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
      { maxZoom: 18, 
        attribution: '...' })
	],
	zoom: 14,
	center: latLng(21.882895506128584, -102.29063229803444)
}
layers: Marker<any>[] = [];
clickHandler(event: LeafletMouseEvent){
  if(this.readOnly){
    return;
  }
  const latitude = event.latlng.lat;
  const longitude = event.latlng.lng;
  this.layers = [];
  this.layers.push(marker([latitude,longitude], this.markerOptions));
  this.selectedCoordinate.emit({
    text: 'Ubicación seleccionada',
    latitude: latitude,
    longitude: longitude
  });
}
}
