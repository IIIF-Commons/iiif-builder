import { IIIFBuilder } from '../src';

describe('Collection builder', () => {
  test('Collection of collections', () => {
    const builder = new IIIFBuilder();

    const collection = builder.createCollection('https://example.org/collection-1', (col1) => {
      col1.label = { en: ['Embedded Collection 1'] };
      col1.createCollection('httsp://example.org/collection-2', (col2) => {
        col2.label = { en: ['Embedded Collection 1'] };
      });
      col1.createCollection('httsp://example.org/collection-3', (col3) => {
        col3.label = { en: ['Embedded Collection 2'] };
      });

      expect(col1.getNestedEntities()).toHaveLength(2);
    });

    expect(builder.toPresentation3(collection)).toMatchInlineSnapshot(`
      Object {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "id": "https://example.org/collection-1",
        "items": Array [
          Object {
            "id": "httsp://example.org/collection-2",
            "label": Object {
              "en": Array [
                "Embedded Collection 1",
              ],
            },
            "type": "Collection",
          },
          Object {
            "id": "httsp://example.org/collection-3",
            "label": Object {
              "en": Array [
                "Embedded Collection 2",
              ],
            },
            "type": "Collection",
          },
        ],
        "label": Object {
          "en": Array [
            "Embedded Collection 1",
          ],
        },
        "type": "Collection",
      }
    `);
  });

  test('Collection builder (Issue #2)', () => {
    const { id, label, summary, homepage, items } = {
      id: 'https://example.org/collection-1',
      label: 'Top collection',
      summary: 'This is a summary',
      homepage: 'https://example.org/homepage',
      items: [
        {
          id: 'https://example.org/collection-2',
          label: 'Embedded collection 1',
          summary: 'Collection 2 (embedded)',
          homepage: 'https://example.org/homepage#2',
        },
        {
          id: 'https://example.org/collection-3',
          label: 'Embedded collection 2',
          summary: 'Collection 3 (embedded)',
          homepage: 'https://example.org/homepage#3',
        },
      ],
    };

    const builder = new IIIFBuilder();
    const built = builder.createCollection(id, (collection) => {
      collection.addLabel(label, 'none');
      collection.addSummary(summary, 'none');
      collection.setHomepage({
        id: homepage,
      });
      items.forEach((item) => {
        collection.createCollection(item.id, (manifest) => {
          manifest.addLabel(item.label, 'none');
          manifest.addSummary(item.summary, 'none');
          manifest.setHomepage({
            id: homepage,
          });
          manifest.addThumbnail({
            id: 'http://localhost:5001/...',
          });
        });
      });
    });

    expect(builder.toPresentation3(built)).toMatchInlineSnapshot(`
      Object {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "homepage": Array [
          Object {
            "id": "https://example.org/homepage",
          },
        ],
        "id": "https://example.org/collection-1",
        "items": Array [
          Object {
            "id": "https://example.org/collection-2",
            "label": Object {
              "none": Array [
                "Embedded collection 1",
              ],
            },
            "summary": Object {
              "none": Array [
                "Collection 2 (embedded)",
              ],
            },
            "thumbnail": Array [
              Object {
                "id": "http://localhost:5001/...",
              },
            ],
            "type": "Collection",
          },
          Object {
            "id": "https://example.org/collection-3",
            "label": Object {
              "none": Array [
                "Embedded collection 2",
              ],
            },
            "summary": Object {
              "none": Array [
                "Collection 3 (embedded)",
              ],
            },
            "thumbnail": Array [
              Object {
                "id": "http://localhost:5001/...",
              },
            ],
            "type": "Collection",
          },
        ],
        "label": Object {
          "none": Array [
            "Top collection",
          ],
        },
        "summary": Object {
          "none": Array [
            "This is a summary",
          ],
        },
        "type": "Collection",
      }
    `);
  });
});
