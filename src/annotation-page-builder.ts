import { Annotation, AnnotationPageNormalized } from '@iiif/presentation-3';
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

    if (this.defaultAnnotationTarget) {
      annotation.target = this.defaultAnnotationTarget;
    }

    const body = Array.isArray(annotation.body) ? annotation.body : [annotation.body];

    annotation.body = body.map((singleBody) => this.addEmbeddedInstance(singleBody, 'ContentResource'));

    const annotationRef = this.addEmbeddedInstance(annotation, 'Annotation');

    this.modified.add('items');
    this.entity.items = [...this.entity.items, annotationRef];
  }
}
