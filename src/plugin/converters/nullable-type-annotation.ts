import {
  NullableTypeAnnotation,
  TSUnionType,
  isTSNullKeyword,
  tsNullKeyword,
  tsUndefinedKeyword,
  tsUnionType,
} from '@babel/types';
import { convertFlowType } from './flow-type';

import { insertIf } from '../../util/array';

export function convertNullableTypeAnnotation(node: NullableTypeAnnotation): TSUnionType {
  const type = convertFlowType(node.typeAnnotation);

  return tsUnionType([
    ...insertIf(!isTSNullKeyword(type), type),
    tsNullKeyword(),
    tsUndefinedKeyword(),
  ]);
}