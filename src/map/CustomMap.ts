import { css, html, LitElement, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  DEFAULT_HEIGHT,
  DEFAULT_LATITUDE,
  DEFAULT_LONGITUDE,
  LatLng,
  MAP_TYPE,
  MAP_VIEW_TYPE,
  MapOptions,
} from './MapTypes.js';
import MapImpl from './MapImpl.js';

class CustomMap extends LitElement {
  static styles = css`
    @include reset();

    :host {
      @include default();
    }

    :host([address-info]) {
      .address {
        display: block;
      }
    }

    :host([full-screen]) {
      .map {
        .view-all {
          display: block;
        }
      }
    }

    .map {
      position: relative;
      height: 178px; //default height
      #map {
        border: 1px solid #e0e0e0;
        border-radius: 6px;
      }

      span {
        display: none;
        width: 100%;
        padding: 10px 0;
        color: black;
        @include font15();
        text-align: center;
        letter-spacing: -0.75px;
      }

      .view-all {
        @include reset-button();

        position: absolute;
        z-index: 1;
        top: 20px;
        right: 20px;
        display: none;
        width: 28px;
        height: 28px;
        padding: 5px;
        border: 0.5px solid black;
        border-radius: 4px;
        box-shadow: 0 0 2px 0 rgba(76, 75, 94, 0.4);

        &:active {
          border-color: black;
          background-color: black;
        }

        span {
          @include blind();
        }
      }
    }

    .address {
      display: none;
      padding: 8px 0 0 28px;
      min-height: 32px;
      color: black;
      @include font13();
    }

    .empty {
      position: absolute;
      z-index: 10;
      top: 0;
      left: 0;
      display: none;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      border-radius: 6px;
      border: 1px solid #e0e0e0;

      &:before {
        content: '';
        display: block;
        width: 100%;
        height: 40px;
      }

      span {
        display: none;
        width: 100%;
        padding: 10px 0;
        color: black;
        @include font15();
        text-align: center;
        letter-spacing: -0.75px;
      }
    }

    .custom-overlay {
      position: relative;
      padding: 3px 12px;
      color: black;
      border: 1px solid black;
      border-radius: 4px;
      background-color: #ffffff;
      @include font13();

      &:after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 50%;
        display: block;
        width: 14px;
        height: 10px;
        margin-left: -7px;
        background: {
          size: 14px 10px;
        }
      }
    }

    .layer-map {
      position: relative;
      width: 100%;
      height: 100%;

      .map-info {
        position: absolute;
        z-index: 10;
        left: 0;
        bottom: 20px;
        width: 100%;
        padding: 0 20px;

        .map-address {
          width: 100%;
          padding: 9px;
          border: 1px solid white;
          border-radius: 4px;
          background-color: #ffffff;

          & + .map-zoom {
            top: -75px;
          }
        }

        .map-zoom {
          position: absolute;
          top: -55px;
          right: 20px;
          width: 28px;
          height: 55px;
          border-radius: 4px;
          box-shadow: 0 0 2px 0 rgba(76, 75, 94, 0.4);

          button {
            @include reset-button();
            display: block;
            width: 100%;
            border: 1px solid black;
            background: #ffffff no-repeat center center / 18px 18px;

            &:active {
              background-color: black;
            }

            &.zoom-in {
              height: 27px;
              border-bottom: none;
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
            }

            &.zoom-out {
              height: 28px;
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
            }

            span {
              @include blind();
            }
          }
        }
      }
    }

    // /* fd */
    :host([fd]) {
      .empty {
        span {
          display: block;
        }
      }
    }
  `;

  static ID_MAP = 'map';

  static ID_MAP_POPUP = 'map-popup';

  static MAP_KEYS: { [name: string]: string } = {
    kakao: '63d71937771a13103e003a817d7b3804',
    google: 'AIzaSyBYto1g6B3FB8xqkf2AgKqJgWx7L0JkQNY',
    naver: 'prkr08s6zg',
  };

  private KEY = (type: string) => CustomMap.MAP_KEYS[type];

  @state()
  isDefault = false;

  @state()
  active = false;

  /**
   * 지도 height 필수
   */
  @property({ type: Number })
  height = DEFAULT_HEIGHT;

  /**
   * 지도 타입 필수
   */
  @property({ type: String, reflect: true })
  type = MAP_TYPE.NAVER;

  /**
   * 지도 view 타입 필수
   * NORMAL | SKYVIEW | HYBRID
   */
  @property({
    type: String,
    attribute: 'map-type',
    converter: value => value as MAP_VIEW_TYPE,
  })
  mapType = MAP_VIEW_TYPE.NORMAL;

  /**
   * 위도
   */
  @property({ type: Number, reflect: true })
  latitude = DEFAULT_LATITUDE;

  /**
   * 경도
   */
  @property({ type: Number, reflect: true })
  longitude = DEFAULT_LONGITUDE;

  /**
   * 주소로 입력 및 주소 상세창 text
   */
  @property({ type: String, reflect: true })
  address = '';

  /**
   * 주소상세창 표시 여부
   */
  @property({ type: Boolean, reflect: true, attribute: 'address-info' })
  addressInfo = false;

  /**
   * 마커 + 정보창 표시 여부
   */
  @property({ type: Boolean, reflect: true })
  marker = false; // default: false

  /**
   * 정보창 title
   */
  @property({ type: String, reflect: true })
  content = '';

  /**
   * 전체화면 title
   */
  @property({ type: String, reflect: true })
  title = '';

  /**
   * 전체화면시 drag 가능여부
   */
  @property({ type: Boolean, reflect: true })
  draggable = false;

  // @query('dews-popup')
  // _popup: Popup | undefined;

  private _map: MapImpl | undefined;

  private _mapPopup: MapImpl | undefined;

  protected firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);

    this._createMap();
  }

  protected updated(_changedProperties: PropertyValues) {
    super.updated(_changedProperties);

    if (_changedProperties.has('type')) {
      this._createMap();
    }
    if (_changedProperties.has('mapType')) {
      this._map?.setMapType(this.mapType);
    }
    if (
      _changedProperties.has('latitude') ||
      _changedProperties.has('longitude')
    ) {
      this._map?.setCenter(new LatLng(this.latitude, this.longitude));
    }
    if (_changedProperties.has('address')) {
      if (this.address.length !== 0)
        this._map?.setAddress(this.address, this.content);
    }
    if (_changedProperties.has('content')) {
      const center = new LatLng(this.latitude, this.longitude);
      this._map?.addMarker(center);
      this._map?.addInfoWindow(center, this.content);
    }
    if (_changedProperties.has('marker')) {
      if (this.marker) {
        const center = new LatLng(this.latitude, this.longitude);
        this._map?.addMarker(center);
        this._map?.addInfoWindow(center, this.content);
      } else {
        this._map?.removeInfoWindow();
        this._map?.removeMarker();
      }
    }
  }

  private _createMap() {
    if (this.hasAttribute('fd')) {
      this.isDefault = true;
      return;
    }

    this._map?.removeMap();

    const element = this.shadowRoot?.getElementById(
      CustomMap.ID_MAP
    ) as HTMLDivElement;
    const options = {
      key: this.KEY(this.type),
      center: new LatLng(this.latitude, this.longitude),
      mapType: this.mapType,
      marker: this.marker,
      content: this.content,
      address: this.address,
      draggable: false,
    } as MapOptions;
    this._map = new MapImpl(this.type, element, options);
  }

  private _removeMap() {
    this._map?.removeMap();
    this._map = undefined;
  }

  private _createMapPopup() {
    // ...?
    this._mapPopup?.removeMap();

    const element = this.shadowRoot?.getElementById(
      CustomMap.ID_MAP_POPUP
    ) as HTMLDivElement;
    const options = {
      key: this.KEY(this.type),
      center: new LatLng(this.latitude, this.longitude),
      mapType: this.mapType,
      marker: this.marker,
      content: this.content,
      address: this.address,
      draggable: this.draggable,
    } as MapOptions;
    this._mapPopup = new MapImpl(this.type, element, options);
  }

  private clickFullScreen() {
    // this._popup?.open();
    // this._createMapPopup();
  }

  private zoomIn() {
    this._mapPopup?.zoomIn();
  }

  private zoomOut() {
    this._mapPopup?.zoomOut();
  }

  protected render(): unknown {
    return html`
      <!--suppress CssInvalidPropertyValue -->
      <div class="map" style="height:${this.height}px;">
        <!--suppress CssInvalidPropertyValue -->
        <div id="map" style="width:100%; height:${this.height}px;"></div>
        <!--suppress CssInvalidPropertyValue -->
        <button
          class="view-all will-touch"
          @click="${this.clickFullScreen}"
          style="display:${this.isDefault ? 'none' : 'block'};"
        >
          <span>전체보기</span>
        </button>

        <!--suppress CssInvalidPropertyValue -->
        <div class="empty" style="display:${this.isDefault ? 'flex' : 'none'};">
          <p>
            <span>Map영역 설정은 미리보기 후 지도 확인 가능합니다.</span>
          </p>
        </div>
      </div>
      <div class="address">${this.address}</div>

      <dews-popup
        class="popup"
        size="full"
        title="${this.title}"
        ?active="${this.active}"
        tabindex="-1"
        shrink
        map
      >
        <popup-content>
          <div class="layer-map">
            <div id="map-popup" style="width:100%; height:100%;"></div>
            <div class="map-info">
              <div class="map-address">
                서울특별시 중구 을지로 29 18층 더존을지타워 (우)04523
              </div>
              <div class="map-zoom">
                <button class="zoom-in will-touch" @click="${this.zoomIn}">
                  <span>zoom-in</span>
                </button>
                <button class="zoom-out will-touch" @click="${this.zoomOut}">
                  <span>zoom-out</span>
                </button>
              </div>
            </div>
          </div>
        </popup-content>
      </dews-popup>
    `;
  }
}

export default CustomMap;
