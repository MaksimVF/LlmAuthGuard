export declare const jwtConfig: {
    secret: string;
    expiresIn: string;
    issuer: string;
    audience: string;
    algorithm: "HS256";
};
export declare const cookieConfig: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "strict";
    maxAge: number;
};
export declare const validateJWTSecret: () => void;
//# sourceMappingURL=jwt.d.ts.map