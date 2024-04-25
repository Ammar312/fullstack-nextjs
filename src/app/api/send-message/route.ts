import userModel from "@/models/User";
import connectDatabase from "@/lib/connectDB";
import { Message } from "@/models/User";

export const POST = async (request: Request) => {
  await connectDatabase();
  console.log("request: ", request);
  const { username, content } = await request.json();
  try {
    const user = await userModel
      .findOne({
        username,
        isVerified: true,
      })
      .exec();
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        { success: false, message: "User not accepting messages" },
        { status: 403 }
      );
    }
    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding message:", error);
    return Response.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
};
