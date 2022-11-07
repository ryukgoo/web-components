// eslint-disable-next-line max-classes-per-file
import { MapInterface } from '../MapInterface.js';
import {
  ERROR_MAP,
  LatLng,
  MAP_TYPE,
  MAP_VIEW_TYPE,
  MapOptions,
} from '../MapTypes.js';
import DynamicLoadUtils from '../../utils/DynamicLoadUtils.js';
import { MapResources } from '../MapResources.js';
import StringUtils from '../../utils/StringUtils.js';

class GoogleMap implements MapInterface {
  private MAP_TYPE = MAP_TYPE.GOOGLE;

  private DEFAULT_ZOOM = 17;

  private URL = (key: string) =>
    `https://maps.googleapis.com/maps/api/js?key=${key}`;

  // eslint-disable-next-line no-undef
  private _map: google.maps.Map | undefined;

  private _marker: google.maps.Marker | undefined;

  private _customOverlay: google.maps.OverlayView | undefined;

  private CUSTOM_OVERLAY_CONTENT = (content: string) =>
    `<div class='custom-overlay'>${content}</div>`;

  async loadService(key: string): Promise<void> {
    const url = this.URL(key);
    return DynamicLoadUtils.syncLoadScript(this.MAP_TYPE, url);
  }

  createMap(container: HTMLElement, options: MapOptions): void {
    try {
      const googleMapOptions = {
        center: new google.maps.LatLng(
          options.center.latitude,
          options.center.longitude
        ),
        zoom: this.DEFAULT_ZOOM,
        mapTypeId: this._convertMapType(
          options.mapType ?? MAP_VIEW_TYPE.NORMAL
        ),
        disableDefaultUI: true,
        keyboardShortcuts: false,
        gestureHandling: options.draggable ? 'auto' : 'none',
      } as google.maps.MapOptions;
      this._map = new google.maps.Map(container, googleMapOptions);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  addInfoWindow(position: LatLng, content: string): void {
    try {
      /**
       * inner class로 위치를 변경할 경우, 에러 발생....
       */
      class GoogleCustomOverlay extends google.maps.OverlayView {
        position: google.maps.LatLng;

        content: HTMLElement;

        constructor(position: google.maps.LatLng, content: HTMLElement) {
          super();
          this.position = position;
          this.content = content;

          // Optionally stop clicks, etc., from bubbling up to the map.
          GoogleCustomOverlay.preventMapHitsAndGesturesFrom(this.content);
        }

        /** Called when the popup is added to the map. */
        onAdd() {
          this.content.style.position = 'absolute';
          this.getPanes()?.overlayLayer.appendChild(this.content);
        }

        /** Called when the popup is removed from the map. */
        onRemove() {
          this.content.parentElement?.removeChild(this.content);
        }

        /** Called each frame when the popup needs to draw itself. */
        draw() {
          const divPosition = this.getProjection().fromLatLngToDivPixel(
            this.position
          )!;

          // Hide the popup when it is far out of view.
          const display =
            Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
              ? 'block'
              : 'none';

          const contentWidth = this.content.offsetWidth;
          const contentHeight = this.content.offsetHeight;

          if (display === 'block') {
            const leftOffset = divPosition.x - contentWidth / 2;
            this.content.style.left = `${leftOffset}px`;
            const topOffset =
              divPosition.y -
              contentHeight -
              MapResources.MARKER_ICON.size.height -
              6;
            this.content.style.top = `${topOffset}px`;
          }

          if (this.content.style.display !== display) {
            this.content.style.display = display;
          }
        }
      }

      const htmlElement = StringUtils.STRING_TO_HTML(
        this.CUSTOM_OVERLAY_CONTENT(content)
      );
      const customOverlay = new GoogleCustomOverlay(
        position.asGoogle(),
        htmlElement
      );

      this.removeInfoWindow();
      if (this._map) customOverlay.setMap(this._map);
      this._customOverlay = customOverlay;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  removeInfoWindow(): void {
    this._customOverlay?.setMap(null);
  }

  addMarker(position: LatLng): void {
    this.removeMarker();
    try {
      this._marker = new google.maps.Marker({
        position: position.asGoogle(),
        map: this._map,
        icon: MapResources.MARKER_IMAGE_URI,
      });
    } catch (e) {
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  removeMarker(): void {
    this._marker?.setMap(null);
  }

  toFullScreen(): void {
    console.log(this.MAP_TYPE, 'toFullScreen');
  }

  getMapType(): MAP_VIEW_TYPE {
    return this._revertMapType(this._map?.getMapTypeId());
  }

  setMapType(mapTypeId: MAP_VIEW_TYPE): void {
    this._map?.setMapTypeId(this._convertMapType(mapTypeId));
  }

  getCenter(): LatLng {
    const center = this._map?.getCenter();
    return new LatLng(center);
  }

  setCenter(center: LatLng): void {
    this._map?.setCenter(center.asGoogle());
  }

  getZoom(): number {
    return this._map?.getZoom() ?? this.DEFAULT_ZOOM;
  }

  setZoom(zoom: number): void {
    this._map?.setZoom(zoom);
  }

  getDefaultZoom(): number {
    return this.DEFAULT_ZOOM;
  }

  zoomIn(): void {
    const zoomValue = this._map?.getZoom() ?? this.DEFAULT_ZOOM;
    this._map?.setZoom(zoomValue + 1);
  }

  zoomOut(): void {
    const zoomValue = this._map?.getZoom() ?? this.DEFAULT_ZOOM;
    this._map?.setZoom(zoomValue - 1);
  }

  setAddress(address: string, content: string): void {
    try {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address,
        },
        (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results) {
              const location = new LatLng(results[0].geometry.location);
              this.addMarker(location);
              this.addInfoWindow(location, content);
              this._map?.setCenter(results[0].geometry.location);
            }
          }
        }
      );
    } catch (e) {
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  private _convertMapType = (type: MAP_VIEW_TYPE): google.maps.MapTypeId => {
    switch (type) {
      case MAP_VIEW_TYPE.NORMAL:
        return google.maps.MapTypeId.ROADMAP;
      case MAP_VIEW_TYPE.SKYVIEW:
        return google.maps.MapTypeId.SATELLITE;
      case MAP_VIEW_TYPE.HYBRID:
        return google.maps.MapTypeId.HYBRID;
      default:
        return google.maps.MapTypeId.ROADMAP;
    }
  };

  private _revertMapType = (type: string | undefined): MAP_VIEW_TYPE => {
    switch (type) {
      case google.maps.MapTypeId.HYBRID:
        return MAP_VIEW_TYPE.HYBRID;
      case google.maps.MapTypeId.SATELLITE:
        return MAP_VIEW_TYPE.SKYVIEW;
      default:
        return MAP_VIEW_TYPE.NORMAL;
    }
  };

  isLoaded(): boolean {
    try {
      return google.maps !== undefined && google.maps.Map !== undefined;
    } catch {
      return false;
    }
  }
}

export default GoogleMap;
