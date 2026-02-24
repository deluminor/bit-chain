import axiosInstance from '../axios';

export type RegisterRequest = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },
};
