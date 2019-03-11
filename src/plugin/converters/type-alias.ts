import { NodePath } from '@babel/traverse';
import { TypeAlias, TSTypeAliasDeclaration, tsTypeAliasDeclaration } from '@babel/types';

import { convertFlowType } from './flow-type';
import { convertTypeParameterDeclaration } from './type-parameter';

export function convertTypeAlias(path: NodePath<TypeAlias>): TSTypeAliasDeclaration {
  const { id } = path.node;
  const typeParameterPath = path.get('typeParameters');
  const typeAnnotation = convertFlowType(path.get('right'));

  const typeParameters = typeParameterPath.isTypeParameterDeclaration()
    ? convertTypeParameterDeclaration(typeParameterPath)
    : null;

  return tsTypeAliasDeclaration(id, typeParameters, typeAnnotation);
}
