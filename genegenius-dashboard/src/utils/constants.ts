export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  MASTER: "master",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const APPROVAL_TOKEN_EXPIRY_DAYS = 7;
