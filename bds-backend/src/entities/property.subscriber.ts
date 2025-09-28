import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
} from 'typeorm';
import { Property } from './property.entity';
import { User } from './user.entity';

@EventSubscriber()
export class PropertySubscriber implements EntitySubscriberInterface<Property> {
  listenTo() {
    return Property;
  }

  async afterInsert(event: InsertEvent<Property>) {
    if (event.entity.owner) {
      await event.manager
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set({ propertyCount: () => '"propertyCount" + 1' })
        .where('id = :id', { id: event.entity.owner.id })
        .execute();
    }
  }

  async afterRemove(event: RemoveEvent<Property>) {
    if (event.entity?.owner) {
      await event.manager
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set({ propertyCount: () => '"propertyCount" - 1' })
        .where('id = :id', { id: event.entity.owner.id })
        .execute();
    }
  }
}
