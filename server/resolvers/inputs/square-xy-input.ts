import { InputType, Field, Int } from 'type-graphql';

import { File, Square } from '../../entities/square';

@InputType()
export class SquareXYInput implements Partial<Square> {
  @Field()
  file: File;

  @Field(type => Int)
  rank: number;
}
