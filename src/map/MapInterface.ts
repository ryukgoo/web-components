import { LatLng, MAP_VIEW_TYPE, MapOptions } from './MapTypes.js';

export interface MapInterface {
  isLoaded(): boolean;
  loadService(key: string): Promise<void>;
  createMap(container: HTMLElement, options: MapOptions): void;
  getMapType(): MAP_VIEW_TYPE;
  setMapType(mapTypeId: MAP_VIEW_TYPE): void;
  getCenter(): LatLng;
  setCenter(center: LatLng): void;
  getDefaultZoom(): number;
  getZoom(): number;
  setZoom(zoom: number): void;
  zoomIn(): void;
  zoomOut(): void;
  setAddress(address: string, content: string | undefined): void;
  addInfoWindow(position: LatLng, content: string): void;
  removeInfoWindow(): void;
  addMarker(position: LatLng): void;
  removeMarker(): void;
  toFullScreen(): void;
}
