import { IIIFBuilder } from '../src';

describe('Canvas builder', () => {
  test('Ensure array works as expected', () => {
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

    const vault = builder.vault;

    const jsonManifest = builder.toPresentation3({ id: newManifest.id, type: 'Manifest' });

    expect(jsonManifest).toMatchInlineSnapshot(`
      Object {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/manifest.json",
        "items": Array [
          Object {
            "height": 1200,
            "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1",
            "items": Array [
              Object {
                "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1/annotation-page",
                "items": Array [
                  Object {
                    "body": Array [
                      Object {
                        "format": "image/png",
                        "height": 1800,
                        "id": "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png",
                        "type": "Image",
                        "width": 1200,
                      },
                    ],
                    "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/annotation/p0001-image",
                    "motivation": "painting",
                    "target": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1",
                    "type": "Annotation",
                  },
                ],
                "type": "AnnotationPage",
              },
            ],
            "type": "Canvas",
            "width": 1800,
          },
        ],
        "label": Object {
          "en": Array [
            "Image 1",
          ],
        },
        "type": "Manifest",
      }
    `);
  });
});
