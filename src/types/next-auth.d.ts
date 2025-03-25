declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
  }

  interface Session {
    user: User;
  }
} 