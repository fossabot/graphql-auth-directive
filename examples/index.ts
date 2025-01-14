/*
 * MIT License
 *
 * Copyright (c) 2022-2022 Carlo Corradini
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// eslint-disable-next-line import/no-extraneous-dependencies
import { makeExecutableSchema } from '@graphql-tools/schema';
// eslint-disable-next-line import/no-extraneous-dependencies
import { ApolloServer } from 'apollo-server';
import { buildAuthDirective } from '../src';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { authFn } from './authFn';
import { contextHelper } from './contextHelper';

// Build auth directive
const authDirective = buildAuthDirective({ auth: authFn });

// Build schema
let schema = makeExecutableSchema({
  typeDefs: [authDirective.typeDefs, typeDefs],
  resolvers
});
schema = authDirective.transformer(schema);

// Build server
const server = new ApolloServer({ schema, context: contextHelper });

// Start server
async function main() {
  const serverInfo = await server.listen({
    port: 8080,
    host: '0.0.0.0'
  });
  // eslint-disable-next-line no-console
  console.info(`Server started at ${serverInfo.url}`);
}
main();
