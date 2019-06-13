import { registerEnumType } from 'type-graphql';

// lookup-enum type, easier for JS forward and reverse accessing
export enum File {
  'a' = 1,
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h'
}
registerEnumType(File, {
  name: 'File', // mandatory
  description: 'The column notation of a Square on a Board'
});
