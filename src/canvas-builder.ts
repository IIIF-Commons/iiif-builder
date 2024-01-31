import { Annotation } from '@iiif/presentation-3';
import { CanvasNormalized } from '@iiif/presentation-3-normalized';
import { AnnotationPageInstanceBuilder } from './annotation-page-builder';
import { BaseEntityBuilder } from './base-entity-builder';
import { IIIFBuilder } from './iiif-builder';
import { emptyAnnotationPage } from '@iiif/parser';

export class CanvasInstanceBuilder extends BaseEntityBuilder<CanvasNormalized> {
  firstAnnotationPage?: AnnotationPageInstanceBuilder;

  constructor(builder: IIIFBuilder, entity: CanvasNormalized) {
    super(builder, entity);
  }

  createAnnotationPage(
    id: string,
    callback: (annotationPage: AnnotationPageInstanceBuilder) => void,
    isAnnotationsProperty = false
  ) {
    const annotationPageBuilder = new AnnotationPageInstanceBuilder(
      this.builder,
      { ...emptyAnnotationPage, id },
      this.entity.id
    );
    callback(annotationPageBuilder);
    this.newInstances.push(annotationPageBuilder);
    if (!this.firstAnnotationPage && !isAnnotationsProperty) {
      this.firstAnnotationPage = annotationPageBuilder;
    }

    const canvasPageProperty = isAnnotationsProperty ? 'annotations' : 'items';

    this.modified.add(canvasPageProperty);
    this.entity[canvasPageProperty] = [
      ...this.entity[canvasPageProperty],
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
