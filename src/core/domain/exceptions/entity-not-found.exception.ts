import { NotFoundException } from '@nestjs/common';

export class EntityNotFoundException extends NotFoundException {
  constructor(entityName: string, id?: string) {
    super({
      message: `${entityName}${id ? ` with id ${id}` : ''} not found`,
      code: 'ENTITY_NOT_FOUND',
      details: { entityName, entityId: id }
    });
  }
}
