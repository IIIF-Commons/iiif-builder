const { IIIFBuilder } = require('iiif-builder');

const builder = new IIIFBuilder();
const newManifest = builder.createManifest(
  'https://iiif.io/api/cookbook/recipe/0001-mvm-image/manifest.json',
  (manifest) => {
    manifest.addLabel('Image 1', 'en');
    manifest.createCanvas('https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1', (canvas) => {
      canvas.width = 1800;
      canvas.height = 1200;
      canvas.createAnnotation('https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image', {
        id: 'https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image',
        type: 'Annotation',
        motivation: 'painting',
        body: {
          id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
          type: 'Image',
          format: 'image/png',
          height: 1800,
          width: 1200,
        },
      });
    });
  }
);

console.log(JSON.stringify(builder.toPresentation3({ id: newManifest.id, type: 'Manifest' }), null, 4));
