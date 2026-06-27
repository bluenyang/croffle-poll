export interface UserAddRequestDto {
  email: string;
  nickname: string;
  role: 'ADMIN' | 'MEMBER';
}
