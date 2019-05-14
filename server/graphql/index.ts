import { mergeSchemas } from 'graphql-tools';

import userSchema from './user';

const schema = mergeSchemas({
  schemas: [userSchema]
});
export default schema;
