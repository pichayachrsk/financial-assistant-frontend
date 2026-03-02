import axios from 'axios';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(request, path);
}

async function handleProxy(request: NextRequest, path: string[]) {
  if (!path || !Array.isArray(path)) {
    console.error('[Proxy] Path is missing or invalid');
    return NextResponse.json({ detail: 'Invalid path' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('finbot_token')?.value;

  const url = `${API_BASE_URL}/${path.join('/')}`;
  console.log(`[Proxy] Forwarding request to: ${url}`);
  const searchParams = request.nextUrl.searchParams;
  const targetUrl = searchParams.toString() ? `${url}?${searchParams.toString()}` : url;

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body = request.method !== 'GET' ? await request.json().catch(() => ({})) : undefined;

    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers,
    });

    return NextResponse.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status || 500;
      const data = err.response?.data || { detail: 'Internal Server Error' };
      return NextResponse.json(data, { status });
    }
    return NextResponse.json({ detail: 'Internal Server Error' }, { status: 500 });
  }
}
