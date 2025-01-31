import { ProviderCreateDTO } from '#auth/types/provider.types.js';

export interface GoogleCreateDTO extends ProviderCreateDTO {}

export interface KakaoCreateDTO extends ProviderCreateDTO {
  phoneNumber: string;
}

export interface NaverCreateDTO extends ProviderCreateDTO {}
