// This file augments the next-auth types to be more compatible with our usage

import 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isAdmin: boolean;
    }
  }

  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    isAdmin: boolean;
  }
} 