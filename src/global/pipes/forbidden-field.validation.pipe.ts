import { BadRequestException } from '#exceptions/http.exception.js';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ForbiddenFieldsPipe implements PipeTransform {
  private readonly forbiddenFields = ['id', 'createdAt', 'updatedAt'];

  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const foundForbiddenFields = this.forbiddenFields.filter(field => Object.prototype.hasOwnProperty.call(value, field));

    if (foundForbiddenFields.length > 0) {
      throw new BadRequestException('요청 바디에 허용되지 않는 필드가 포함되어 있습니다');
    }

    return value;
  }
}
