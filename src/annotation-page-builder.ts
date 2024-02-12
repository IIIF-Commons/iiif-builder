import { Annotation } from '@iiif/presentation-3';
import { AnnotationPageNormalized } from '@iiif/presentation-3-normalized';
import { IIIFBuilder } from './iiif-builder';
import { BaseEntityBuilder } from './base-entity-builder';

export class AnnotationPageInstanceBuilder extends BaseEntityBuilder<AnnotationPageNormalized> {
  defaultAnnotationTarget?: string;
  constructor(builder: IIIFBuilder, entity: AnnotationPageNormalized, defaultAnnotationTarget?: string) {
    super(builder, entity);
    this.defaultAnnotationTarget = defaultAnnotationTarget;
  }

  createAnnotation(annotation: Annotation) {
    // Extract annotation body + target as reference
    if (this.defaultAnnotationTarget && !annotation.target) {
      annotation.target = this.defaultAnnotationTarget;
    }

    const [annotationRef] = this.importRawJson<'Annotation'>(annotation);
    this.modified.add('items');
    this.entity.items = [...this.entity.items, annotationRef];
  }
}
