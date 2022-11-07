export const DEFAULT_LATITUDE = 37.5666103;
export const DEFAULT_LONGITUDE = 126.9810422;
export const DEFAULT_HEIGHT = 268;

// eslint-disable-next-line no-shadow
export enum ERROR_MAP {
  NOT_LOADED_LIBRARY = 'Library can not load',
}

// eslint-disable-next-line no-shadow
export enum MAP_TYPE {
  KAKAO = 'kakao',
  NAVER = 'naver',
  GOOGLE = 'google',
}

// eslint-disable-next-line no-shadow
export enum MAP_VIEW_TYPE {
  NORMAL = 'NORMAL',
  SKYVIEW = 'SKYVIEW',
  HYBRID = 'HYBRID',
}

interface Point {
  x: number;
  y: number;
}

export class LatLng {
  private _latitude: number | undefined;

  private _longitude: number | undefined;

  constructor();

  // eslint-disable-next-line no-undef
  constructor(latLng?: kakao.maps.LatLng);

  constructor(latLng?: naver.maps.LatLng | naver.maps.Point);

  constructor(latLng?: google.maps.LatLng);

  constructor(latitude: number, longitude: number);

  constructor(
    latitude?:
      | number
      | kakao.maps.LatLng
      | naver.maps.LatLng
      | naver.maps.Point
      | google.maps.LatLng
      | undefined,
    longitude?: number | undefined
  ) {
    if (typeof latitude === 'number' && typeof longitude === 'number') {
      this._latitude = latitude;
      this._longitude = longitude;
    } else if (latitude instanceof kakao.maps.LatLng) {
      this._latitude = latitude.getLat();
      this._longitude = latitude.getLng();
    } else if (latitude instanceof naver.maps.LatLng) {
      this._latitude = latitude.lat();
      this._longitude = latitude.lng();
    } else if (latitude instanceof naver.maps.Point) {
      const latLng = naver.maps.TransCoord.fromNaverToLatLng(latitude);
      this._latitude = latLng.lat();
      this._longitude = latLng.lng();
    } else if (latitude instanceof google.maps.LatLng) {
      this._latitude = latitude.lat();
      this._longitude = latitude.lng();
    }
  }

  get latitude(): number {
    return this._latitude ?? 0;
  }

  set latitude(value: number) {
    this._latitude = value;
  }

  get longitude(): number {
    return this._longitude ?? 0;
  }

  set longitude(value: number) {
    this._longitude = value;
  }

  asKakao(): kakao.maps.LatLng {
    return new kakao.maps.LatLng(this._latitude ?? 0, this._longitude ?? 0);
  }

  asNaver(): naver.maps.LatLng {
    return new naver.maps.LatLng(this._latitude ?? 0, this._longitude ?? 0);
  }

  asGoogle(): google.maps.LatLng {
    return new google.maps.LatLng(this._latitude ?? 0, this._longitude ?? 0);
  }
}

export class LatLngBounds {
  private _sw: LatLng;

  private _ne: LatLng;

  constructor(sw: LatLng, ne: LatLng) {
    this._sw = sw;
    this._ne = ne;
  }

  get sw(): LatLng {
    return this._sw;
  }

  set sw(value: LatLng) {
    this._sw = value;
  }

  get ne(): LatLng {
    return this._ne;
  }

  set ne(value: LatLng) {
    this._ne = value;
  }

  asKakao(): kakao.maps.LatLngBounds {
    return new kakao.maps.LatLngBounds(this._sw.asKakao(), this._ne.asKakao());
  }

  asNaver(): naver.maps.LatLngBounds {
    return new naver.maps.LatLngBounds(this._sw.asNaver(), this._ne.asNaver());
  }
}

export interface AddressItem {
  address: string;
  addrdetail: Record<string, unknown>;
  isRoadAddress: boolean;
  point: Point;
}

export interface MapOptions {
  key: string;
  center: LatLng;
  address?: string;
  mapType?: MAP_VIEW_TYPE;
  zoom?: boolean;
  marker?: boolean;
  content?: string;
  draggable?: boolean;
}
