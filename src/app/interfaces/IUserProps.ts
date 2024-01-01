export interface IAuthProps {
  jwt: string;
};

export interface IUserProps {
  id: number;
  username: string;
  email: string;
  blocked: boolean;
  firstName: string;
  middleName: string;
  lastName: string;
  birthdate: string;
  userId: string;
  biography: string;
  contactNumber: string;
  designation: string;
};
