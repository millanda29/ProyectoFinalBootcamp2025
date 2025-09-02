import User from "../models/User.js";

const getAllUsers = async () => {
  return await User.find().select("-passwordHash");
};

const getUserById = async (id) => {
  return await User.findById(id).select("-passwordHash");
};

export default { getAllUsers, getUserById };
