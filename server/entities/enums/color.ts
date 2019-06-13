import { registerEnumType } from 'type-graphql';

export enum Color {
  White = 'white',
  Black = 'black'
}
registerEnumType(Color, {
  name: 'Color',
  description: 'The basic team colors'
});
