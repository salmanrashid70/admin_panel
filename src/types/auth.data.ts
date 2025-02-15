export interface CloudinaryImage {
    asset_id: string;
    public_id: string;
    version: number;
    signature: string;
    width: number;
    height: number;
    format: string;
    resource_type: string;
    url: string;
    secure_url: string;
    folder: string;
};

export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
    image?: CloudinaryImage;
}

export type AuthContextType = {
  user: User | null;
  isCheckingAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
