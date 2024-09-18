import { IUser } from "@/models/userModel";
import { getSession, signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import { notFound } from "next/navigation";

export async function userLogin(data: { email: string, password: string }) {
    const { email, password } = data;

    const result = await signIn("credentials", {
        redirect: false,
        email,
        password
    });

    if (result?.error) throw new Error(result.error); 
    return result;
}


export async function userLogout() {
    await signOut();
}

export async function requestUser(email: string): Promise<any> {
    const session = await getSession();
    
    if (!session || !session.user) {
        throw new Error("Unauthorized: No session found");
    }

    const res = await fetch(`${process.env.EDITOR_API_URL}/api/auth/requestuser/${email}`);

    if (!res.ok) {
        throw new Error("Failed to fetch user by email");
    }

    const user = await res.json();

    if (!user) {
        notFound();
    }

    return user;
}

export const deleteUserAccount = async (userData: { userId: string, password: string, passwordConfirm: string }) => {
    if (userData.password !== userData.passwordConfirm) {
        throw new Error("Passwords do not match");
    }

    const response = await fetch('/api/auth/deleteaccount', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'user-id': userData.userId,
        },
        body: JSON.stringify({ password: userData.password }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Something went wrong');
    }

    await signOut({ redirect: false });

    return response.json();
};

export async function updateUserPassword(newData: { id: string, passwordCurrent: string, newPassword: string, passwordConfirm: string }) {
    try {
        const { id, passwordCurrent, newPassword, passwordConfirm } = newData;

        const res = await fetch(`${process.env.EDITOR_API_URL}/api/users/${id}/update-password`, {
            method: "PATCH",
            body: JSON.stringify({ passwordCurrent, newPassword, passwordConfirm }),
            headers: {
                "Content-type": "application/json",
            }
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to update password");
        }

        await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password
        });

        return data;
    } catch (error) {
        throw error;
    }
}