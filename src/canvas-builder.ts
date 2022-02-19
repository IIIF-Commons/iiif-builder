import { emptyAnnotationPage } from '@iiif/parser';
import { Annotation, CanvasNormalized } from '@iiif/presentation-3';
import { AnnotationPageInstanceBuilder } from './annotation-page-builder';
import { IIIFBuilder } from './iiif-builder';
import { BaseEntityBuilder } from './base-entity-builder';

export class CanvasInstanceBuilder extends BaseEntityBuilder<CanvasNormalized> {
  firstAnnotationPage?: AnnotationPageInstanceBuilder;

  constructor(builder: IIIFBuilder, entity: CanvasNormalized) {
    super(builder, entity);
  }

  createAnnotationPage(id: string, callback: (annotationPage: AnnotationPageInstanceBuilder) => void) {
    const annotationPageBuilder = new AnnotationPageInstanceBuilder(
      this.builder,
      { ...emptyAnnotationPage, id },
      this.entity.id
    );
    callback(annotationPageBuilder);
    this.newInstances.push(annotationPageBuilder);
    if (!this.firstAnnotationPage) {
      this.firstAnnotationPage = annotationPageBuilder;
    }

    this.modified.add('items');
    this.entity.items = [
      ...this.entity.items,
      {
        id,
        type: 'AnnotationPage',
      },
    ];
  }

  createAnnotation(id: string, annotation: Annotation) {
    if (!this.firstAnnotationPage) {
      this.createAnnotationPage(`${this.entity.id}/annotation-page`, (annotationPage) => {
        annotationPage.createAnnotation(annotation);
      });
    } else {
      this.firstAnnotationPage.createAnnotation(annotation);
    }
  }
}
