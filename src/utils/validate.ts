import { User } from "@prisma/client";
import { authenticator } from "otplib";

export function hasOTP(user: User, otp: string) {
  if (user.otpSecret !== null) {
    const isValid = authenticator.verify({
      secret: user.otpSecret,
      token: otp,
    });

    if (!otp) {
      throw new Error("OTP is required");
    }

    if (!isValid) {
      throw new Error("Invalid TOTP");
    }
  }
}
