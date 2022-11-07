import { MapInterface } from './MapInterface.js';
import { LatLng, MAP_TYPE, MAP_VIEW_TYPE, MapOptions } from './MapTypes.js';
import KakaoMap from './kakao/KakaoMap.js';
import GoogleMap from './google/GoogleMap.js';
import NaverMap from './naver/NaverMap.js';

class MapImpl implements MapInterface {
  private readonly _type: MAP_TYPE = MAP_TYPE.NAVER;

  private readonly _element: HTMLElement;

  private readonly _options: MapOptions;

  private _map: MapInterface | undefined;

  static async createInstance<T extends MapInterface>(
    creator: new () => T,
    key: string
  ): Promise<T> {
    // eslint-disable-next-line new-cap
    const instance = new creator();
    await instance.loadService(key);
    return new Promise<T>(resolve => {
      resolve(instance);
    });
  }

  constructor(type: MAP_TYPE, element: HTMLElement, options: MapOptions) {
    this._type = type;
    this._element = element;
    this._options = options;

    this._createMap().then(() => {
      this._map?.createMap(this._element, this._options);

      if (this._options.marker) {
        this._map?.addMarker(this._options.center);
        this._map?.addInfoWindow(
          this._options.center,
          this._options.content ?? ''
        );
      }
      if (this._options.address) {
        this._map?.setAddress(this._options.address, this._options.content);
      }
    });
  }

  async loadService(key: string): Promise<void> {
    return this._map?.loadService(key);
  }

  createMap(container: HTMLElement, options: MapOptions): void {
    this._map?.createMap(container, options);
  }

  removeMap() {
    this._removeMap();
  }

  private async _createMap() {
    this._removeMap();

    if (this._type === MAP_TYPE.KAKAO) {
      this._map = await MapImpl.createInstance(KakaoMap, this._options.key);
    } else if (this._type === MAP_TYPE.NAVER) {
      this._map = await MapImpl.createInstance(NaverMap, this._options.key);
    } else if (this._type === MAP_TYPE.GOOGLE) {
      this._map = await MapImpl.createInstance(GoogleMap, this._options.key);
    }
  }

  private _removeMap() {
    this._map = undefined;
    this._element.style.background = '';
    this._element.style.position = '';
    Array.from(this._element.children).forEach($child => {
      $child.remove();
    });
  }

  addInfoWindow(position: LatLng, content: string): void {
    this._map?.addInfoWindow(position, content);
  }

  removeInfoWindow(): void {
    this._map?.removeInfoWindow();
  }

  addMarker(position: LatLng): void {
    this._map?.addMarker(position);
  }

  removeMarker(): void {
    this._map?.removeMarker();
  }

  getMapType(): MAP_VIEW_TYPE {
    return this._map?.getMapType() ?? MAP_VIEW_TYPE.NORMAL;
  }

  setMapType(mapTypeId: MAP_VIEW_TYPE): void {
    this._map?.setMapType(mapTypeId);
  }

  getCenter(): LatLng {
    return this._map?.getCenter() ?? this._options.center;
  }

  setCenter(center: LatLng): void {
    this._map?.setCenter(center);
  }

  getZoom(): number {
    return this._map?.getZoom() ?? this._map?.getDefaultZoom() ?? 0;
  }

  setZoom(zoom: number): void {
    this._map?.setZoom(zoom);
  }

  zoomIn(): void {
    this._map?.zoomIn();
  }

  zoomOut(): void {
    this._map?.zoomOut();
  }

  setAddress(address: string, content: string): void {
    this._map?.setAddress(address, content);
  }

  toFullScreen(): void {
    this._map?.toFullScreen();
  }

  isLoaded(): boolean {
    return this._map?.isLoaded() ?? false;
  }

  getDefaultZoom(): number {
    throw new Error('Method not implemented.');
  }
}

export default MapImpl;
