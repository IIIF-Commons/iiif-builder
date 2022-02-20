import { CollectionNormalized } from '@iiif/presentation-3';
import { IIIFBuilder } from './iiif-builder';
import { BaseEntityBuilder } from './base-entity-builder';
import { emptyManifest } from '@iiif/parser';
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
}
