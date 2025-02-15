import { CloudinaryImage, User } from '@/types/auth.data';
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface AdminUser extends Omit<User, 'id'>, Document { 
    password: string;
    accessToken?: string;
    refreshToken?: string;
}

const CloudinaryImageSchema = new Schema<CloudinaryImage>({
    asset_id: { type: String, required: true },
    public_id: { type: String, required: true },
    version: { type: Number, required: true },
    signature: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    resource_type: { type: String, required: true },
    url: { type: String, required: true },
    secure_url: { type: String, required: true },
    folder: { type: String, required: true }
});

const AdminUserSchema: Schema<AdminUser> = new Schema({
    name: { 
        type: String, 
        required: true,
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
    },
    role: { 
        type: String, 
        required: true,
        enum: ['admin', 'editor'],
        default: 'editor'
    },
    isEmailVerified: { 
        type: Boolean, 
        required: true,
        default: false 
    },
    password: {
        type: String,
        required: true
    },
    accessToken: { type: String, required: false, default: null },
    refreshToken: { type: String, required: false, default: null},
    image: {
        type: CloudinaryImageSchema,
        required: false,
        default: null
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
         transform: function(doc, ret) {
            ret.id = ret._id.toString(); // Convert _id to string
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

// Add virtual 'id' field to match User interface
AdminUserSchema.virtual('id').get(function(this: AdminUser & { _id: mongoose.Types.ObjectId }) {
    return this._id.toString(); // Convert ObjectId to string
});

AdminUserSchema.pre<AdminUser>("save", async function (next): Promise<void> {

    if (!this.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds
        // Hash the password with the salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error); // Pass the error to Mongoose
    }
});

AdminUserSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

AdminUserSchema.methods.generateAccessToken = function (): string {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: this.role
        },
        process.env.JWT_ACCESS_SECRET_TOKEN as string,
        {
            expiresIn: '1d'
        }
    );
}

AdminUserSchema.methods.generateRefreshToken = function (): string {
    return jwt.sign(
        {
            id: this._id
        },
        process.env.JWT_REFRESH_SECRET_TOKEN as string,
        {
            expiresIn: '2d'
        }
    );
}

export default mongoose.models.AdminUser || mongoose.model<AdminUser>('AdminUser', AdminUserSchema);