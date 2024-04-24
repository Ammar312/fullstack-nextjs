import connectDatabase from "@/lib/connectDB";
import userModel from "@/models/User";

export const POST = async (request: Request) => {
  await connectDatabase();
  try {
    console.log("request: ", request);
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({
      username: decodedUsername,
    });
    if (!user) {
      return Response.json(
        { success: false, message: "User Not found" },
        { status: 404 }
      );
    }
    const isCodeValid = code === user.verifyCode;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        { success: true, message: "Account verified!" },
        { status: 200 }
      );
    } else if (!isCodeValid) {
      return Response.json(
        { success: false, message: "Invalid Code" },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message:
            "Verification code has expired. Please sign up again to get a new code.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error Verify Code", error);
    return Response.json(
      { success: false, message: "Error verify code" },
      {
        status: 500,
      }
    );
  }
};
