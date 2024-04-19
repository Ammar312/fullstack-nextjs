import { Resend } from "resend";
import { ApiResponse } from "@/types/ApiResponse";
import verificationEmailTemplate from "@/template/VerificationEmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "ammar.ul.mustafa3@gmail.com",
      to: email,
      subject: "Verification Code",
      react: verificationEmailTemplate({ username, verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
};
