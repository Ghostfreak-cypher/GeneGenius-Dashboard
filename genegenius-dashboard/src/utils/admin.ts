import User from "@/models/User";
import { USER_ROLES } from "./constants";

interface IUser {
  _id: string;
  email: string;
  role: string;
}

export async function findAdminUsers(): Promise<IUser[]> {
  return await User.find({
    role: { $in: [USER_ROLES.ADMIN, USER_ROLES.MASTER] },
  });
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await User.findById(userId);
  if (!user) return false;
  return user.role === USER_ROLES.ADMIN || user.role === USER_ROLES.MASTER;
}

export async function getAdminEmail(): Promise<string> {
  // First try to get from environment
  if (process.env.ADMIN_EMAIL) {
    return process.env.ADMIN_EMAIL;
  }

  // Otherwise, find the first admin/master user's email
  const admins = await findAdminUsers();
  if (admins.length > 0) {
    return admins[0].email;
  }

  // Fallback to sender email
  return process.env.EMAIL_USER || "admin@genegenius.com";
}
