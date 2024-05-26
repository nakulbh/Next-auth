export interface User {
  id: string;
  email: string;
  password: string;
  isVerified: Boolean;
  isAdmin: Boolean;
  forgotPasswordToken: String;
  forgotPasswordTokenExpiry: Date;
  verifyToken: String;
  verifyTokenExpiry: Date;
  createdAt: Date;
  updatedAt: Date;
}
