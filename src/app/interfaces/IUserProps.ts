export interface IAuthProps {
  jwt: string;
};

export interface IUserProps {
  id: number;
  name: string;
  nickName: string;
  address: string;
  mobile: string;
  email: string;
  birthDate: string;
  remarks: string;
  civilStatus: string;
  gender: number;
  invitedByMemberName: string;
  isActive: boolean;
  roleId: number;
};
