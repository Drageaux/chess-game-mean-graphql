import { InputType, Field } from 'type-graphql';

import { User } from '../../entities/user';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  userName: string;

  @Field()
  email: string;
}
