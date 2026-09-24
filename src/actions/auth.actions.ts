"use server";

import { signIn, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin" || error.type === "CallbackRouteError") {
        return { error: "Invalid email or password" };
      }
      return { error: "An error occurred during login" };
    }
    throw error;
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/login" });
}
