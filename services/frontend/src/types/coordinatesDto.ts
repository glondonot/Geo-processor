export interface Point {
  lat: number;
  lng: number;
}

export interface Centroid {
  lat: number;
  lng: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeoResponse {
  centroid: Centroid;
  bounds: Bounds;
}