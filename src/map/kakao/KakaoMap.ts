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

class KakaoMap implements MapInterface {
  private MAP_TYPE = MAP_TYPE.KAKAO;

  private DEFAULT_ZOOM = 3;

  private _map: kakao.maps.Map | undefined;

  private _zoom = this.DEFAULT_ZOOM;

  private _marker: kakao.maps.Marker | undefined;

  private _infoWindow: kakao.maps.CustomOverlay | undefined;

  private URL = (key: string) =>
    `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&libraries=services&autoload=false`;

  private CUSTOM_OVERLAY_CONTENT = function (content: string) {
    return `<div class='custom-overlay'>${content}</div>`;
  };

  async loadService(key: string): Promise<void> {
    await DynamicLoadUtils.syncLoadScript(this.MAP_TYPE, this.URL(key));
    return new Promise<void>(resolve => {
      try {
        kakao.maps.load(() => {
          resolve();
        });
      } catch {
        resolve();
      }
    });
  }

  createMap(container: HTMLElement, options: MapOptions): void {
    try {
      const center = new kakao.maps.LatLng(
        options.center.latitude,
        options.center.longitude
      );
      const kakaoMapOptions = {
        center: center,
        mapTypeId: this._convertMapType(
          options.mapType ?? MAP_VIEW_TYPE.NORMAL
        ),
        level: this._zoom,
        draggable: !!options.draggable,
        scrollwheel: false,
      } as kakao.maps.MapOptions;
      this._map = new kakao.maps.Map(container, kakaoMapOptions);
      this._map.setCopyrightPosition(
        kakao.maps.CopyrightPosition.BOTTOMRIGHT,
        true
      );
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  addInfoWindow(position: LatLng, content: string): void {
    try {
      this.removeInfoWindow();
      this._infoWindow = new kakao.maps.CustomOverlay({
        position: position.asKakao(),
        content: this.CUSTOM_OVERLAY_CONTENT(content),
        yAnchor: 2.45,
      });

      if (this._map) this._infoWindow.setMap(this._map);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  removeInfoWindow(): void {
    this._infoWindow?.setMap(null);
  }

  addMarker(position: LatLng): void {
    this.removeMarker();
    try {
      const markerImageUrl = MapResources.MARKER_IMAGE_URI;
      const markerImageSize = new kakao.maps.Size(32, 36);
      const markerImageOptions = {
        offset: new kakao.maps.Point(16, 32),
      };

      const markerImage = new kakao.maps.MarkerImage(
        markerImageUrl,
        markerImageSize,
        markerImageOptions
      );

      this._marker = new kakao.maps.Marker({
        position: position.asKakao(),
        image: markerImage,
      });
      if (this._map) {
        this._marker.setMap(this._map);
      }
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
    this._map?.setCenter(center.asKakao());
  }

  getZoom(): number {
    return this._zoom;
  }

  setZoom(zoom: number): void {
    this._zoom = zoom;
    this._map?.setLevel(this._zoom);
  }

  getDefaultZoom(): number {
    return this.DEFAULT_ZOOM;
  }

  zoomIn(): void {
    const level = this._map?.getLevel() ?? this.DEFAULT_ZOOM;
    this._map?.setLevel(level - 1);
  }

  zoomOut(): void {
    const level = this._map?.getLevel() ?? this.DEFAULT_ZOOM;
    this._map?.setLevel(level + 1);
  }

  setAddress(address: string, content: string | undefined): void {
    try {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

          if (this._map) {
            const latLng = new LatLng(coords);
            this.addMarker(latLng);
            if (content) this.addInfoWindow(latLng, content);
            this._map.setCenter(coords);
          }
        }
      });
    } catch (e) {
      console.log(`${this.MAP_TYPE} ${ERROR_MAP.NOT_LOADED_LIBRARY}`, e);
    }
  }

  private _convertMapType = (type: MAP_VIEW_TYPE): kakao.maps.MapTypeId => {
    switch (type) {
      case MAP_VIEW_TYPE.NORMAL:
        return kakao.maps.MapTypeId.NORMAL;
      case MAP_VIEW_TYPE.SKYVIEW:
        return kakao.maps.MapTypeId.SKYVIEW;
      case MAP_VIEW_TYPE.HYBRID:
        return kakao.maps.MapTypeId.HYBRID;
      default:
        return kakao.maps.MapTypeId.NORMAL;
    }
  };

  private _revertMapType = (
    type: kakao.maps.MapTypeId | undefined
  ): MAP_VIEW_TYPE => {
    switch (type) {
      case kakao.maps.MapTypeId.HYBRID:
        return MAP_VIEW_TYPE.HYBRID;
      case kakao.maps.MapTypeId.SKYVIEW:
        return MAP_VIEW_TYPE.SKYVIEW;
      default:
        return MAP_VIEW_TYPE.NORMAL;
    }
  };

  isLoaded(): boolean {
    try {
      return kakao.maps !== undefined && kakao.maps.Map !== undefined;
    } catch {
      return false;
    }
  }
}

export default KakaoMap;
