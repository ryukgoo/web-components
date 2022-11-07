import { html } from 'lit';
import '../src/map/custom-map.js';

export default {
  title: 'CustomMap',
  component: 'custom-map',
  argTypes: {
    title: { control: 'text' },
  },
};

export const KakaoMap1 = () => html`
  <custom-map
    type="kakao"
    height="320"
    address="서울특별시 중구 을지로 29 18층 더존을지타워"
    address-info="true"
    content="더존을지타워"
    title="카카오맵"
    map-type="SKYVIEW"
    draggable
  >
  </custom-map>
`;

export const KakaoMap2 = () => html`
  <custom-map
    type="kakao"
    height="320"
    address="제주특별자치도 제주시 첨단로 242"
    address-info="true"
    content="카카오친구"
  >
  </custom-map>
`;

export const NaverMap1 = () => html`
  <custom-map
    type="naver"
    address="서울특별시 중구 을지로 29 18층 더존을지타워"
    content="더존"
    marker
  ></custom-map>
`;

export const NaverMap2 = () => html`
  <custom-map
    type="naver"
    address="제주특별자치도 제주시 첨단로 242"
    content="네이버"
    map-type="SKYVIEW"
    marker
  ></custom-map>
`;

export const GoogleMap1 = () => html`
  <custom-map
    type="google"
    address="서울특별시 중구 을지로 29 18층 더존을지타워"
    content="더존"
  ></custom-map>
`;

export const GoogleMap2 = () => html`
  <custom-map
    type="google"
    address="제주특별자치도 제주시 첨단로 242"
    content="구글"
    map-type="NORMAL"
  >
  </custom-map>
`;
