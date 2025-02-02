import { UserType } from '#types/common.types.js';

export interface ProviderInfo {
  provider: string;
  providerId: string;
}

export interface GoogleAuthType {
  email: string;
  name: string;
  photo: string;
  provider: string;
  id: string;
  userType: UserType;
  accessToken?: string;
  refreshToken?: string;
}

export interface KakaoAuthType {
  email: string;
  name: string;
  photo: string;
  provider: string;
  id: string;
  userType: UserType;
  phoneNumber: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface NaverAuthType {
  email: string;
  name: string;
  photo: string;
  nickname: string;
  provider: string;
  id: string;
  userType: UserType;
  accessToken?: string;
  refreshToken?: string;
}

export interface ProviderCreateDTO {
  email: string;
  name: string;
  image: string;
  provider: string;
  providerId: string;
}
