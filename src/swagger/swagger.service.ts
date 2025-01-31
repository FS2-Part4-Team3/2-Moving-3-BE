import { FilteredDriverOutputDTO } from '#auth/types/filtered.driver.dto.js';
import { FilteredUserOutputDTO } from '#auth/types/filtered.user.dto.js';
import { swaggerConfig } from '#configs/swagger.config.js';
import { QuestionEntity } from '#questions/types/question.types.js';
import { INestApplication, Injectable } from '@nestjs/common';
import { OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

@Injectable()
export class SwaggerService {
  private document: OpenAPIObject;

  setupSwagger(app: INestApplication) {
    this.document = SwaggerModule.createDocument(app, swaggerConfig, {
      extraModels: [FilteredUserOutputDTO, FilteredDriverOutputDTO, QuestionEntity],
    });

    SwaggerModule.setup('api-docs', app, this.document);

    return this.document;
  }

  getSwaggerJson() {
    return this.document;
  }

  saveSwaggerJson() {
    const docsDir = path.join(process.cwd(), 'docs');
    if (!fs.existsSync(path.dirname(docsDir))) {
      fs.mkdirSync(path.dirname(docsDir), { recursive: true });
    }

    const jsonPath = path.join(docsDir, 'swagger-spec.json');
    fs.writeFileSync(jsonPath, JSON.stringify(this.document, null, 2));

    const yamlPath = path.join(docsDir, 'swagger-spec.yaml');
    const yamlContent = yaml.dump(this.document);
    fs.writeFileSync(yamlPath, yamlContent);
  }
}
