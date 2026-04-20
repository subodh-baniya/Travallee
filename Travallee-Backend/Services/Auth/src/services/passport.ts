import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// @ts-ignore
import { apiError, asyncHandler, apiResponse , UserModel } from "@packages";

export const passportGoogle = passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
        },
        
        async function (
            accessToken: string,
            refreshToken: string,
            profile: any,
            cb: (err: any, user?: any) => void,
        ) {
            const userData = {
                googleId: profile.id,
                Username: profile.displayName,
                email: profile.emails?.[0].value,
                Name: profile.displayName,
                password: "oauth_google_user", 
                role: "user",
            };
            const user = await UserModel.findOne({ googleId: profile.id });
            if (!user) {
                const newUser = await UserModel.create(userData);
                return cb(null, newUser);
            }
            return cb(null, user);
        },
    ),
);


passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});
