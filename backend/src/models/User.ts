import { model, Schema } from "mongoose";

export type User = {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new Schema<User>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must contain at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false, // not permit a return by request
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = model<User>("User", userSchema);

export default UserModel;
