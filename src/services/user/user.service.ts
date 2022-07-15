import { db } from "../../utils/database/db.server";
import type { User } from "@prisma/client";
import bcrypt from "bcrypt";

type UserRequest = Omit<User, "id" | "createdAt" | "updatedAt">;
type UserResponse = Partial<
  Omit<User, "createdAt" | "updatedAt" | "password">
> & {
  //
};

const saltRound: number = 10;

// create user
export const createUser = async (user: UserRequest): Promise<UserResponse> => {
  const { name, email, phone, password: _password } = user;

  const password = await bcrypt.hash(_password, saltRound); // Encrypt

  return db.user.create({
    data: {
      name,
      email,
      phone,
      password,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  });
};

// get user by email
export const getUserByEmail = (email: string): Promise<UserResponse | null> => {
  return db.user.findUnique({
    where: {
      email,
    },
  });
};

// get user by phone
export const getUserByPhone = (phone: string): Promise<UserResponse | null> => {
  return db.user.findUnique({
    where: {
      phone,
    },
  });
};
