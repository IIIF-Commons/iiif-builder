import { emptyCollection, emptyManifest } from '@iiif/parser';
import { entityActions, mappingActions } from '@iiif/vault/actions';
import { Reference, ManifestNormalized, CollectionNormalized } from '@iiif/presentation-3';
import { Vault } from '@iiif/vault';
import { BaseEntityBuilder } from './base-entity-builder';
import { ManifestInstanceBuilder } from './manifest-builder';
import { CollectionInstanceBuilder } from './collection-builder';

export class IIIFBuilder {
  vault: Vault;

  constructor(vault?: Vault | undefined) {
    this.vault = vault || new Vault();
  }

  processBuilder(entityBuilder: BaseEntityBuilder<any>, isNew: boolean) {
    const entity = entityBuilder.entity;
    const modified = entityBuilder.getModifiedFields();
    const store = this.vault.getStore();
    const entities: any = {
      Manifest: {},
      Annotation: {},
      AnnotationCollection: {},
      AnnotationPage: {},
      Canvas: {},
      Collection: {},
      ContentResource: {},
      Range: {},
      Selector: {},
      Service: {},
    };
    const mappings: {
      [id: string]: string;
    } = {};

    if (isNew) {
      mappings[entity.id] = entity.type;
      entities[entity.type][entity.id] = entity;
    }

    // Always nested entities first.
    const nestedEntities = entityBuilder.getNestedEntities();
    if (nestedEntities.length) {
      for (const nestedEntity of nestedEntities) {
        mappings[nestedEntity.id] = (entities[nestedEntity.type] as any) ? nestedEntity.type : 'ContentResource';
        ((entities[nestedEntity.type] as any)
          ? (entities[nestedEntity.type] as any)
          : (entities.ContentResource as any))[nestedEntity.id] = nestedEntity;
      }
    }

    if (nestedEntities.length || isNew) {
      store.dispatch(
        entityActions.importEntities({
          entities,
        })
      );
      store.dispatch(mappingActions.addMappings({ mapping: mappings }));
    }

    // And then modifications.
    for (const modifiedField of modified) {
      if (!entities[modifiedField.type][modifiedField.id]) {
        store.dispatch(entityActions.modifyEntityField(modifiedField as any));
      }
    }

    entityBuilder.dispose();
  }

  createCollection(id: string, callback: (collection: CollectionInstanceBuilder) => void) {
    const entityBuilder = new CollectionInstanceBuilder(this, { ...emptyCollection, id });

    callback(entityBuilder);

    this.processBuilder(entityBuilder, true);

    return this.vault.get<CollectionNormalized>({ id, type: 'Collection' });
  }

  editCollection(id: string, callback: (manifest: CollectionInstanceBuilder) => void | false) {
    const collectionToEdit = this.vault.get<CollectionNormalized>({ id, type: 'Collection' });
    const entityBuilder = new CollectionInstanceBuilder(this, { ...collectionToEdit });
    callback(entityBuilder);

    this.processBuilder(entityBuilder, false);

    return this.vault.get<CollectionNormalized>({ id, type: 'Collection' });
  }

  createManifest(id: string, callback: (manifest: ManifestInstanceBuilder) => void) {
    const entityBuilder = new ManifestInstanceBuilder(this, { ...emptyManifest, id });

    callback(entityBuilder);

    this.processBuilder(entityBuilder, true);

    return this.vault.get<ManifestNormalized>({ id, type: 'Manifest' });
  }

  editManifest(id: string, callback: (manifest: ManifestInstanceBuilder) => void | false) {
    const manifestToEdit = this.vault.get<ManifestNormalized>({ id, type: 'Manifest' });
    const entityBuilder = new ManifestInstanceBuilder(this, { ...manifestToEdit });
    callback(entityBuilder);

    this.processBuilder(entityBuilder, false);

    return this.vault.get<ManifestNormalized>({ id, type: 'Manifest' });
  }

  toPresentation3(entity: Reference) {
    return this.vault.toPresentation3(entity as any);
  }

  toPresentation2(entity: Reference) {
    return this.vault.toPresentation2(entity as any);
  }
}
