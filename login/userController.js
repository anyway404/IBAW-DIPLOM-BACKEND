import userModel from "./userModel";

const getAllUsers = async () => {
  try {
    const users = await userModel.find();
    return users;
  } catch (error) {
    throw new Error("Error retrieving users from the database");
  }
};
export default getAllUsers;
