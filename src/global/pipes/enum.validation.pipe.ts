import { BadRequestException } from '#exceptions/http.exception.js';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class EnumValidationPipe<T extends Record<string, string>> implements PipeTransform<string> {
  constructor(private readonly enumType: T) {}

  transform(value: string): T[keyof T] {
    const enumValues = Object.values(this.enumType);

    if (!enumValues.includes(value as T[keyof T])) {
      throw new BadRequestException(`${enumValues.join(', ')} 중 하나의 값이 필요합니다.`);
    }

    return value as T[keyof T];
  }
}
