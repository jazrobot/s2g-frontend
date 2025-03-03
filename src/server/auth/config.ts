import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";
// import { env } from "@/env";
import { authApi } from "@/lib/axios";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    // GoogleProvider({
    //   clientId: env.GOOGLE_CLIENT_ID,
    //   clientSecret: env.GOOGLE_CLIENT_SECRET,
    //   authorization: {
    //     url: "https://accounts.google.com/o/oauth2/auth",
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code",
    //       scope: "openid email profile",
    //     },
    //   },
    // }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        // Validate inputs are present and of type string
        if (
          !credentials ||
          typeof credentials.email !== "string" ||
          typeof credentials.password !== "string"
        ) {
          return null;
        }

        try {
          // Using axios to post form data
          const response = await authApi.post(
            "/auth/login",
            new URLSearchParams({
              username: credentials.email,
              password: credentials.password,
            }).toString(),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
              },
            },
          );

          const data = response.data as {
            access_token: string;
            token_type: string;
          };

          return {
            id: credentials.email,
            email: credentials.email,
            accessToken: data.access_token,
          };
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // If we have a user, it means they just signed in
      if (user) {
        token.accessToken = (user as { accessToken: string }).accessToken;
      }

      // // If we have a Google account, exchange the token with our backend
      // if (account?.provider === "google") {
      //   try {
      //     console.log("account", account);
      //     const response = await authApi.get(
      //       `/oauth/google/callback?code=${account.access_token}`,
      //       {
      //         headers: {
      //           Accept: "application/json",
      //         },
      //       },
      //     );

      //     const data: { access_token: string } = response.data as {
      //       access_token: string;
      //     };

      //     token.accessToken = data.access_token;
      //   } catch (error) {
      //     console.error("Error exchanging Google token:", error);
      //   }
      // }

      return token;
    },
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub!,
        accessToken: token.accessToken as string,
      },
    }),
  },
  pages: {
    signIn: "/auth/login",
  },
} satisfies NextAuthConfig;
