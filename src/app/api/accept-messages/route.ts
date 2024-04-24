import { getServerSession } from "next-auth";
import userModel from "@/models/User";
import connectDatabase from "@/lib/connectDB";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";

export const POST = async (request: Request) => {
  await connectDatabase();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessages } = await request.json();
  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessages: acceptMessages,
      },
      { new: true }
    );
    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Unable to find user to update message acceptance status",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error updating message acceptance status" },
      { status: 500 }
    );
  }
};
export const GET = async (request: Request) => {
  await connectDatabase();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || !session?.user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }
  const userId = user._id;
  try {
    const foundUser = await userModel.findById(user._id);

    if (!foundUser) {
      // User not found
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return the user's message acceptance status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving message acceptance status:", error);
    return Response.json(
      { success: false, message: "Error retrieving message acceptance status" },
      { status: 500 }
    );
  }
};
