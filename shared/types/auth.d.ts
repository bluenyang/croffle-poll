declare module '#auth-utils' {
  interface User {
    id: string;
    email: string;
    nickname: string;
    role: 'ADMIN' | 'MEMBER';
  }
}

export {};
