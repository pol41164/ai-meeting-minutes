import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true },
);

export type User = InferSchemaType<typeof UserSchema>;

export const UserModel: Model<User> =
  (models.User as Model<User>) || model<User>("User", UserSchema);
