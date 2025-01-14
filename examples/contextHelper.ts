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

import type { ExpressContext } from 'apollo-server-express';
import type { Context } from './Context';
import { AuthenticationError } from '../src';
import { User } from './User';

export async function contextHelper({ req }: ExpressContext): Promise<Context> {
  let user: Omit<User, 'secret'> | undefined;
  const authorizationHeader =
    req.headers && 'Authorization' in req.headers
      ? 'Authorization'
      : 'authorization';

  if (req.headers && req.headers[authorizationHeader]) {
    const parts = (req.headers[authorizationHeader] as string).split(' ');

    if (parts.length === 2) {
      const scheme = parts[0];
      const credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        const token = credentials;

        try {
          const decodedToken = token as unknown as
            | Omit<User, 'secret'>
            | undefined; // Decode token: jwt.verify({...})
          user = decodedToken;
        } catch (error) {
          throw new AuthenticationError();
        }
      }
    } else {
      throw new AuthenticationError(
        "Token format is 'Authorization: Bearer [token]'"
      );
    }
  }

  return { user };
}
