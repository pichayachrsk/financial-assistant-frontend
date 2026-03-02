'use server';

import { authApi } from '@/lib/api';
import { LoginRequest, RegisterRequest, User } from '@/types';
import axios from 'axios';
import { cookies } from 'next/headers';

const TOKEN_NAME = 'finbot_token';
const USER_NAME = 'finbot_user';

type LoginActionResult = 
  | { success: true; user: User; error?: never } 
  | { success: false; error: string; user?: never };

export async function loginAction(data: LoginRequest): Promise<LoginActionResult> {
  try {
    const response = await authApi.login(data);
		console.log(response)
    const { access_token, user } = response.data;

    const cookieStore = await cookies();
    cookieStore.set(TOKEN_NAME, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    cookieStore.set(USER_NAME, JSON.stringify(user), {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return { success: true, user };
  } catch (error: unknown) {
    let message = 'Authentication failed';
		console.log(error)
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.detail || message;
    }
    return { success: false, error: message };
  }
}

type RegisterActionResult = 
  | { success: true; error?: never } 
  | { success: false; error: string };

export async function registerAction(data: RegisterRequest): Promise<RegisterActionResult> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  console.log(`[AuthAction] Calling Register API: ${API_URL}/auth/register`);
  
  try {
    await authApi.register(data);
    return { success: true };
  } catch (error: unknown) {
    let message = 'Registration failed';
    if (axios.isAxiosError(error)) {
      message = error.response?.data?.detail || message;
    }
    return { success: false, error: message };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_NAME);
  cookieStore.delete(USER_NAME);
}

export async function getSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_NAME)?.value;
    const userStr = cookieStore.get(USER_NAME)?.value;
    
    let user: User | null = null;
    if (userStr) {
        try {
            user = JSON.parse(userStr);
        } catch { }
    }

    return { token: !!token, user };
}

export async function getToken() {
    const cookieStore = await cookies();
    return cookieStore.get(TOKEN_NAME)?.value;
}
