# IIIF Builder

Helper for creating IIIF Manifests and Collections.


```
npm install iiif-builder
```
```
yarn add iiif-builder 
```

Or add a script tag.
```
<script src="https://cdn.jsdelivr.net/npm/iiif-builder/dist/index.umd.js"></script>
```
Note: This uses global variable. You can create a builder with `const builder = new IIIFBuilder.IIIFBuilder()`

## Example
```js
import { IIIFBuilder } from 'iiif-builder';

const builder = new IIIFBuilder();
const newManifest = builder.createManifest(
  'https://iiif.io/api/cookbook/recipe/0001-mvm-image/manifest.json',
  manifest => {
    manifest.addLabel('Image 1', 'en');
    manifest.createCanvas('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1', canvas => {
      canvas.width = 1800;
      canvas.height = 1200;
      canvas.createAnnotation(
        'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
        {
          id: 'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
          type: 'Annotation',
          motivation: 'painting',
          body: {
            id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
            type: 'Image',
            format: 'image/png',
            height: 1800,
            width: 1200
          }
        }
      );
    })
  }
);

const jsonManifest = builder.toPresentation3({id: newManifest.id, type: 'Manifest'});
```


## BaseEntityBuilder

Most of the Editing functionality comes from the `BaseEntityBuilder`. This is a class that other builder extend to provide the common IIIF properties together.

The base builder has the following class properties and constructor:
```ts
class BaseEntityBuilder {
  entity: T;
  protected modified: Set<string> = new Set();
  protected newInstances: BaseEntityBuilder<any>[] = [];
  protected editedInstances: BaseEntityBuilder<any>[] = [];
  protected embeddedInstances: any[] = [];
  
  constructor(builder: IIIFBuilder, entity: T);
}
```

The `entity` is `NormalizedResource`. This will be stored directly in vault. You can shallow clone one of the `emptyXYZ` from the `@iiif/parser` pacakge.

For example:
```
import { emptyCanvas } from '@iiif/parser';

const builder = new IIIFBuilder();
const canvas = new BaseEntityBuilder(builder, { ...emptyCanvas, id: 'http://example.org/my-canvas' });

canvas.setLabel( ... );
// ..etc
```

Each of the properties is useful for nesting these builders.

### base.modified
This is a list of keys of modified properties. For example, if you did:
```
canvas.setLabel({ en: ['...'] });
```
Then the value of `canvas.modified` would be: `['label']`

### base.newInstances
This is a list of `BaseEntityBuilder` classes for nested items. When you save the resource, all of these will be recursively checked and the changes applied.

For example, this is the helper for creating an embedded Canvas in the `ManifestBuilder`.
```ts
createCanvas(id: string, callback: (canvas: CanvasInstanceBuilder) => void) {
  // We create the builder for the canvas.
  const canvasBuilder = new CanvasInstanceBuilder(this.builder, { ...emptyCanvas, id });
  
  // We pass that to the callback provided (where the user will be setting canvas properties)
  callback(canvasBuilder);
  
  // We push the new instance, so it will be detected.
  this.newInstances.push(canvasBuilder);
  
  // We mark the `entity.items` as modified.
  this.modified.add('items');
  
  // And finally we directly modify the entity with our new Canvas.
  this.entity.items = [
    ...this.entity.items,
    {
      id,
      type: 'Canvas',
    },
  ];
}
```

### base.editedInstances
This is similar to the new instances, but assumes that the resource already exists in the Vault, and only changes that have been made should be
applied.

Here is the helper for editing an existing Canvas in the ManifestBuilder:
```ts
editCanvas(id: string, callback: (canvas: CanvasInstanceBuilder) => void) {
  // We grab the canvas from the Vault instance.
  const canvasToEdit = this.builder.vault.get<CanvasNormalized>({ id, type: 'Canvas' });
  
  // We create a new builder, with a shallow-clone of the properties
  const canvasBuilder = new CanvasInstanceBuilder(this.builder, { ...canvasToEdit });
  
  // We pass it back for editing
  callback(canvasBuilder);
  
  // And finally we push to newInstances (? - this might be a bug or a quirk!)
  this.newInstances.push(canvasBuilder);
}
```

### base.embeddedInstances
This is for non-builder resources. For example, there is builder for "ContentResources" like images. So when you add a thumbnail:
```
addThumbnail(resource: ContentResource) {
  this.modified.add('thumbnail');
  this.entity.thumbnail = [...this.entity.thumbnail, this.addEmbeddedInstance(resource, 'ContentResource')];
}
```
We can use the `addEmbeddedInstance` and then this will be created when you build. It returns a Ref that can be used for convenience.

This is a useful shortcut for simple types that don't need a full builder.
