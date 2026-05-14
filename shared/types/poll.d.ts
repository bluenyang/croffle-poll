type Poll = {
  id: number;
  title: string;
  description: string;
  creatorName: string; // 투표 생성자 이름
  isAnonymous: boolean;
  isMultipleChoice: boolean;
  allowCustomOptions: boolean;
  type: 'VOTE' | 'APPLICATION' | 'OPINION';
  status: 'ACTIVE' | 'CLOSED';
  closedAt: Date | null;
  createdAt: Date | null;
};
