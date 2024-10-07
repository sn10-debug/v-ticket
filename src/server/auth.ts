import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "@vibrance/env";

import CredentialsProvider from "next-auth/providers/credentials";

import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";

import { db } from "@vibrance/server/db";
import convert from "./pass";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: string;
            // ...other properties
            // role: UserRole;
        } & DefaultSession["user"];
    }

    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

export const authOptions: NextAuthOptions = {
    secret: env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        session: async ({ session, user }) => {
            if (session && session.user && user && user.id) {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: user.id,
                    },
                };
            }
            let queried_user = await db.user.findUnique({
                where: {
                    email: session.user.email!,
                },
            });
            session.user.role = queried_user?.role!;
            session.user.id = queried_user?.id!;
            return session;
        },
    },
    adapter: PrismaAdapter(db),
    jwt: {
        secret: env.NEXTAUTH_SECRET,
    },
    pages: {
        signIn: "/",
        error: "/error",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Enter your email" },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Enter your password",
                },
            },
            async authorize(credentials, req) {
                const user = await db.user.findUnique({
                    where: {
                        email: credentials!.email,
                    },
                });

                if (
                    user &&
                    user.password &&
                    user.password === convert(credentials!.password) &&
                    (user.role === "Admin" || user.role === "SuperAdmin")
                ) {
                    return user;
                } else {
                    return null;
                }
            },
        }),
    ],
} satisfies NextAuthOptions;

export const getServerAuthSession = () => getServerSession(authOptions);
