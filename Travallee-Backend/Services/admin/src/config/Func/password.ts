import { UserModel } from "../../Model/User.model.js";

export const passwordCheck = async (
  password: string,
  userID: string
): Promise<{ success: boolean; message: string }> => {
  try {
    if (!userID || !password) {
      return {
        success: false,
        message: "User ID and password are required",
      };
    }


    const user = await UserModel.findById(userID);
    if (!user) {
      console.warn(`Password check failed: User not found for ID ${userID}`);
      return {
        success: false,
        message: "User not found",
      };
    }

    // Compare password
    const isCorrect = await user.comparePassword(password);
    if (!isCorrect) {
      console.warn(`Wrong password attempt for user ${userID}`);
      return {
        success: false,
        message: "Incorrect password",
      };
    }

    // Password is correct
    return {
      success: true,
      message: "Password verified successfully",
    };
  } catch (error: any) {
    console.error("Error checking password:", error);
    return {
      success: false,
      message: "Error verifying password",
    };
  }
};  