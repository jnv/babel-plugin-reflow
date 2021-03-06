import {
  Flow,
  isInterfaceTypeAnnotation,
  TSInterfaceDeclaration,
  TSTypeAliasDeclaration,
  tsTypeAliasDeclaration,
  TypeAlias,
} from '@babel/types';
import { NodePath } from '@babel/traverse';

import { ConverterState } from '../types';
import { convertFlowType } from './flow-type';
import { convertInterfaceTypeAlias, TypeAliasForInterfaceType } from './interface';
import { convertTypeParameterDeclaration } from './type-parameter';

export function convertTypeAlias(
  node: TypeAlias,
  path: NodePath<Flow>,
  state: ConverterState,
): TSTypeAliasDeclaration | TSInterfaceDeclaration {
  const typeParameters = convertTypeParameterDeclaration(node.typeParameters, state);
  const typeAnnotation = convertFlowType(node.right, state, path);

  // A type alias for an interface type is not allowed in TypeScript. Replace
  // the type alias with an equivalent interface declaration in this case.
  if (isInterfaceTypeAnnotation(node.right)) {
    return convertInterfaceTypeAlias(node as TypeAliasForInterfaceType, state);
  }

  return tsTypeAliasDeclaration(node.id, typeParameters, typeAnnotation);
}
