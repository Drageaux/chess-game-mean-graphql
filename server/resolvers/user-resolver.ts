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
import { User, UserModel } from '../entities/user';
import { UserInput } from './inputs/user-input';

@Resolver(of => User)
export class UserResolver {
  @Query(returns => User, { nullable: true })
  async findUser(@Arg('id') id: string): Promise<User> {
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
      const newUser = await new UserModel({ ...userInput } as User).save();
      await pubSub.publish('USER_ADDED', {
        email: newUser.email,
        userName: newUser.userName,
        id: newUser.id
      } as User);
      return true;
    } catch (e) {
      return e.message;
    }
  }

  @Subscription({ topics: 'USER_ADDED' })
  userAdded(@Root() payload: User): User {
    return payload;
  }
}
