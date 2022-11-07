// eslint-disable-next-line max-classes-per-file
import { MapInterface } from '../MapInterface.js';
import {
  AddressItem,
  ERROR_MAP,
  LatLng,
  MAP_TYPE,
  MAP_VIEW_TYPE,
  MapOptions,
} from '../MapTypes.js';
import DynamicLoadUtils from '../../utils/DynamicLoadUtils.js';
import StringUtils from '../../utils/StringUtils.js';
import { MapResources } from '../MapResources.js';

class NaverMap implements MapInterface {
  private MAP_TYPE = MAP_TYPE.NAVER;

  private DEFAULT_ZOOM = 17;

  private _map: naver.maps.Map | undefined;

  private _zoom = this.DEFAULT_ZOOM;

  private _marker: naver.maps.Marker | undefined;

  private _customOverlay: naver.maps.OverlayView | undefined;

  private URL = (key: string) =>
    `//openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${key}&submodules=geocoder`;

  private MARKER_IMAGE_CONTENT = (uri: string) =>
    `<img src='${uri}'
          alt=''
          style='margin: 0px;
          padding: 0px;
          border: 0px;
          solid;
          transparent;
          display: block;
          max-width: none;
          max-height: none;
          -webkit-user-select: none;
          position: absolute;
          width: 32px;
          height: 36px;
          left: 0px;
          top: 0px;'>`;

  private CUSTOM_OVERLAY_CONTENT = (content: string) =>
    `<div class='custom-overlay'>${content}</div>`;

  async loadService(key: string): Promise<void> {
    await DynamicLoadUtils.syncLoadScript(
      this.MAP_TYPE,
      this.URL(key),
      () =>
        new Promise<void>(resolve => {
          if (naver.maps.onJsContentLoaded === null) {
            naver.maps.onJsContentLoaded = () => {
              resolve();
            };
          } else {
            resolve();
          }
        })
    );
    return new Promise<void>(resolve => {
      resolve();
    });
  }

  createMap(container: HTMLElement, options: MapOptions): void {
    try {
      const naverMapOptions = {
        center: new naver.maps.LatLng(
          options.center.latitude,
          options.center.longitude
        ),
        zoom: this._zoom,
        mapTypeId: this._convertMapType(
          options.mapType ?? MAP_VIEW_TYPE.NORMAL
        ),
        draggable: !!options.draggable,
        disableDoubleClickZoom: false,
        zoomControl: false,
        scrollWheel: false,
      } as naver.maps.MapOptions;
      this._map = new naver.maps.Map(container, naverMapOptions);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  addInfoWindow(position: LatLng, content: string): void {
    try {
      class NaverCustomOverlay extends naver.maps.OverlayView {
        _position: naver.maps.LatLng;

        _content: HTMLElement;

        constructor($position: naver.maps.LatLng, $content: HTMLElement) {
          super();
          this._position = $position;
          this._content = $content;
        }

        onAdd() {
          this._content.style.position = 'absolute';
          this.getPanes().overlayLayer.appendChild(this._content);
        }

        onRemove() {
          this._content.parentElement?.removeChild(this._content);
        }

        draw() {
          if (!this.getMap()) return;

          const pixelPosition = this.getProjection().fromCoordToOffset(
            this._position
          );
          const contentWidth = this._content.offsetWidth;
          const contentHeight = this._content.offsetHeight;

          this._content.style.left = `${pixelPosition.x - contentWidth / 2}px`;
          this._content.style.top = `${
            pixelPosition.y -
            contentHeight -
            MapResources.MARKER_ICON.size.height -
            2
          }px`;
        }
      }

      const htmlElement = StringUtils.STRING_TO_HTML(
        this.CUSTOM_OVERLAY_CONTENT(content)
      );
      const customOverlay = new NaverCustomOverlay(
        position.asNaver(),
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
      this._marker = new naver.maps.Marker({
        position: position.asNaver(),
        map: this._map!,
        icon: {
          content: this.MARKER_IMAGE_CONTENT(MapResources.MARKER_IMAGE_URI),
          size: new naver.maps.Size(32, 36),
          anchor: new naver.maps.Point(16, 32),
        },
      });
    } catch (e) {
      // eslint-disable-next-line no-console
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
    return this._revertMapType(
      this._map?.getMapTypeId() as naver.maps.MapTypeId
    );
  }

  setMapType(mapTypeId: MAP_VIEW_TYPE): void {
    this._map?.setMapTypeId(this._convertMapType(mapTypeId));
  }

  getCenter(): LatLng {
    const center = this._map?.getCenter();
    return new LatLng(center);
  }

  setCenter(center: LatLng): void {
    this._map?.setCenter(center.asNaver());
  }

  getZoom(): number {
    return this._zoom;
  }

  setZoom(zoom: number): void {
    this._zoom = zoom;
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
      naver.maps.Service.geocode(
        {
          query: address,
        },
        (status, response) => {
          if (status === naver.maps.Service.Status.OK && response.result) {
            const item = response.result.items.pop() as AddressItem;
            const point = new naver.maps.LatLng(item.point.y, item.point.x);

            if (this._map) {
              const latLng = new LatLng(point);
              this.addMarker(latLng);
              this.addInfoWindow(latLng, content);
              this._map.setCenter(point);
            }
          }
        }
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  private _convertMapType = (type: MAP_VIEW_TYPE): naver.maps.MapTypeId => {
    switch (type) {
      case MAP_VIEW_TYPE.NORMAL:
        return naver.maps.MapTypeId.NORMAL;
      case MAP_VIEW_TYPE.SKYVIEW:
        return naver.maps.MapTypeId.SATELLITE;
      case MAP_VIEW_TYPE.HYBRID:
        return naver.maps.MapTypeId.HYBRID;
      default:
        return naver.maps.MapTypeId.NORMAL;
    }
  };

  private _revertMapType = (
    type: naver.maps.MapTypeId | undefined
  ): MAP_VIEW_TYPE => {
    switch (type) {
      case naver.maps.MapTypeId.HYBRID:
        return MAP_VIEW_TYPE.HYBRID;
      case naver.maps.MapTypeId.SATELLITE:
        return MAP_VIEW_TYPE.SKYVIEW;
      default:
        return MAP_VIEW_TYPE.NORMAL;
    }
  };

  isLoaded(): boolean {
    try {
      return naver.maps !== undefined && naver.maps.Map !== undefined;
    } catch {
      return false;
    }
  }
}

export default NaverMap;
