import { IIIFBuilder } from '../src';
import { ContentResource } from '@iiif/presentation-3';

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
      {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/manifest.json",
        "items": [
          {
            "height": 1200,
            "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1",
            "items": [
              {
                "id": "https://iiif.io/api/cookbook/recipe/0001-mvm-image/canvas/p1/annotation-page",
                "items": [
                  {
                    "body": {
                      "format": "image/png",
                      "height": 1800,
                      "id": "http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png",
                      "type": "Image",
                      "width": 1200,
                    },
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
        "label": {
          "en": [
            "Image 1",
          ],
        },
        "type": "Manifest",
      }
    `);
  });

  test('Canvas with choice', () => {
    const builder = new IIIFBuilder();
    const manifest = builder.createManifest(
      'https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/manifest.json',
      (manifest) => {
        manifest.addLabel('John Dee performing an experiment before Queen Elizabeth I.', 'en');
        manifest.createCanvas('https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/canvas/p1', (canvas) => {
          canvas.height = 1271;
          canvas.width = 2000;
          canvas.createAnnotation(
            'https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/annotation/p0001-image',
            {
              id: 'https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/annotation/p0001-image',
              type: 'Annotation',
              motivation: 'painting',
              body: {
                type: 'Choice',
                items: [
                  {
                    id: 'https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-natural/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    width: 2000,
                    height: 1271,
                    label: {
                      en: ['Natural Light'],
                    },
                  } as ContentResource,
                  {
                    id: 'https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-xray/full/max/0/default.jpg',
                    type: 'Image',
                    format: 'image/jpeg',
                    width: 2000,
                    height: 1271,
                    label: {
                      en: ['X-Ray'],
                    },
                  } as ContentResource,
                ],
              },
            }
          );
        });
      }
    );

    expect(builder.toPresentation3(manifest)).toMatchInlineSnapshot(`
      {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "id": "https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/manifest.json",
        "items": [
          {
            "height": 1271,
            "id": "https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/canvas/p1",
            "items": [
              {
                "id": "https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/canvas/p1/annotation-page",
                "items": [
                  {
                    "body": {
                      "items": [
                        {
                          "format": "image/jpeg",
                          "height": 1271,
                          "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-natural/full/max/0/default.jpg",
                          "label": {
                            "en": [
                              "Natural Light",
                            ],
                          },
                          "type": "Image",
                          "width": 2000,
                        },
                        {
                          "format": "image/jpeg",
                          "height": 1271,
                          "id": "https://iiif.io/api/image/3.0/example/reference/421e65be2ce95439b3ad6ef1f2ab87a9-dee-xray/full/max/0/default.jpg",
                          "label": {
                            "en": [
                              "X-Ray",
                            ],
                          },
                          "type": "Image",
                          "width": 2000,
                        },
                      ],
                      "type": "Choice",
                    },
                    "id": "https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/annotation/p0001-image",
                    "motivation": "painting",
                    "target": "https://preview.iiif.io/cookbook/3333-choice/recipe/0033-choice/canvas/p1",
                    "type": "Annotation",
                  },
                ],
                "type": "AnnotationPage",
              },
            ],
            "type": "Canvas",
            "width": 2000,
          },
        ],
        "label": {
          "en": [
            "John Dee performing an experiment before Queen Elizabeth I.",
          ],
        },
        "type": "Manifest",
      }
    `);
  });
});
