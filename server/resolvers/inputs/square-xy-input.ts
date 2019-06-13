import { InputType, Field, Int } from 'type-graphql';

import { Square } from '../../entities/square';
import { File } from '../../entities/enums';

@InputType()
export class SquareXYInput implements Partial<Square> {
  @Field(type => File)
  file: File;

  @Field(type => Int)
  rank: number;
}
