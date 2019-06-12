import { ObjectId } from 'mongodb';
import {
  Resolver,
  Arg,
  Query,
  Mutation,
  Subscription,
  PubSub,
  Publisher,
  PubSubEngine,
  Root
} from 'type-graphql';
import { InstanceType } from 'typegoose';
import { User, UserModel } from '../entities/user';
import { UserInput } from './inputs/user-input';
import { ObjectIdScalar } from '../graphql/object-id-scalar';

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User, { nullable: true })
  async findUser(
    @Arg('id', type => ObjectIdScalar) id: ObjectId
  ): Promise<User> {
    return await UserModel.findById(id);
  }

  @Query(returns => [User])
  async getUsers(): Promise<User[]> {
    return await UserModel.find({});
  }

  @Mutation(returns => Boolean)
  async addUser(
    @PubSub() pubSub: PubSubEngine,
    @Arg('user') userInput: UserInput
  ): Promise<boolean> {
    try {
      const newUser: InstanceType<User> = await new UserModel({
        ...userInput
      } as User).save();

      pubSub.publish('USER_ADDED', { data: newUser });
      return true;
    } catch (e) {
      return e.message;
    }
  }

  @Subscription({ topics: 'USER_ADDED' })
  userAdded(@Root() payload: { data: User }): User {
    return payload.data;
  }
}
