import  zod  from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const UserZodSchema = zod.object({
    id: zod.string().optional(),
    Name: zod.string().min(2, "Name must be at least 2 characters long"),
    email: zod.string().email(),
    number: zod.number().min(1000000000, "Phone number must be at least 10 digits long").max(9999999999, "Phone number must be at most 10 digits long").optional(),
    Username: zod.string().min(3, "Username must be at least 3 characters long").regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
    createdAt: zod.date(),
    updatedAt: zod.date(),
    profileimage: zod.string().optional(),
    role: zod.string().optional(),
    hotelId: zod.string().optional(),
    googleId: zod.string().optional(),
    isVerified: zod.boolean().optional(),
    otp: zod.number().optional(),
    otpExpiry: zod.date().optional(),
    refreshToken: zod.string().optional(),

})  

export type UserType = zod.infer<typeof UserZodSchema>;

interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateJWT(): string;
}

interface UserModel extends mongoose.Model<UserType, {}, UserMethods> {}

const UserSchema = new mongoose.Schema<UserType, UserModel, UserMethods>({
  Name: { type: String, required: true, minlength: 2 },
  email: { type: String, required: true },
  number: { type: Number, min: 1000000000, max: 9999999999 },
  Username: { type: String, required: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  profileimage: { type: String },
  role: { type: String ,
    default: "user",
     enum: ["user", "admin" , "superadmin", "hotelAdmin"]
   },
  hotelId: { type: String },
  googleId: { type: String },
  isVerified: { type: Boolean },
  otp: { type: Number },
  otpExpiry: { type: Date },
  refreshToken: { type: String },
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;

  // Skip hashing for OAuth users
  if (this.password === "oauth_google_user") {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    console.error("Error hashing password:", err);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  // OAuth users cannot login with password
  if (this.password === "oauth_google_user") {
    return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateJWT = function () {
  const payload = { id: this._id, email: this.email, role: this.role };
  const secret: string = process.env.JWT_SECRET as string;
  const data = process.env.JWT_EXPIRES_IN as string;

  return jwt.sign(payload, secret, { expiresIn: "7D" });
};

// problem of ts cannnolt give expires in as process.env.JWT_EXPIRES_IN as string so we have to hardcode it here

export const UserModel = mongoose.model<UserType, UserModel>(
  "User",
  UserSchema,
);
