export type RequestResetDto = {
  email: string;
};

export type ResetPasswordDto = {
  token: string;
  newPassword: string;
};