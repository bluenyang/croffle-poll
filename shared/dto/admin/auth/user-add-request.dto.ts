export interface UserAddRequestDto {
  email: string;
  password: string;
  nickname: string;
  role: 'ADMIN' | 'MEMBER';
}
