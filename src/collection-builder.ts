import { CollectionNormalized } from '@iiif/presentation-3-normalized';
import { IIIFBuilder } from './iiif-builder';
import { BaseEntityBuilder } from './base-entity-builder';
import { emptyCollection, emptyManifest } from '@iiif/parser';
import { ManifestInstanceBuilder } from './manifest-builder';

export class CollectionInstanceBuilder extends BaseEntityBuilder<CollectionNormalized> {
  constructor(builder: IIIFBuilder, entity: CollectionNormalized) {
    super(builder, entity);
  }

  createManifest(id: string, callback: (manifest: ManifestInstanceBuilder) => void) {
    const manifestInstanceBuilder = new ManifestInstanceBuilder(this.builder, { ...emptyManifest, id });
    callback(manifestInstanceBuilder);
    this.newInstances.push(manifestInstanceBuilder);
    this.modified.add('items');
    this.entity.items = [...this.entity.items, manifestInstanceBuilder.entity];
  }

  createCollection(id: string, callback: (manifest: CollectionInstanceBuilder) => void) {
    const collectionInstanceBuilder = new CollectionInstanceBuilder(this.builder, { ...emptyCollection, id });
    callback(collectionInstanceBuilder);
    this.newInstances.push(collectionInstanceBuilder);
    this.modified.add('items');
    this.entity.items = [...this.entity.items, collectionInstanceBuilder.entity];
  }
}
