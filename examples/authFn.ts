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

import type { AuthFn } from '../src';
import type { Context } from './Context';

export const authFn: AuthFn<Context> = (
  { context: { user } },
  { roles, permissions }
) => {
  if (!user) {
    // No user
    return false;
  }

  if (roles.length === 0 && permissions.length === 0) {
    // Only authentication required
    return true;
  }

  // Roles
  const rolesMatch: boolean =
    roles.length === 0 ? true : user.roles.some((role) => roles.includes(role));
  // Permissions
  const permissionsMatch: boolean =
    permissions.length === 0
      ? true
      : user.permissions.some((permission) => permissions.includes(permission));
  // Roles & Permissions
  return rolesMatch && permissionsMatch;
};
