import { CollectionNormalized, Reference} from '@iiif/presentation-3';
import { IIIFBuilder } from './iiif-builder';
import { BaseEntityBuilder } from './base-entity-builder';

export class CollectionInstanceBuilder extends BaseEntityBuilder<CollectionNormalized> {
  constructor(builder: IIIFBuilder, entity: CollectionNormalized) {
    super(builder, entity);
  }

  addMember(member: Reference<'Manifest' | 'Collection'> & {label?: string}) {
    this.modified.add('items');
    this.entity.items = [
      ...(this.entity.items || []),
      member,
    ];
  }
}
