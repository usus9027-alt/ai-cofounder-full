import { NextResponse } from 'next/server'

type CheckResult = {
  ok: boolean
  status?: number
  error?: string
}

async function checkOpenAI(apiKey?: string): Promise<CheckResult> {
  if (!apiKey) return { ok: false, error: 'OPENAI_API_KEY missing' }
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : res.statusText }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

async function checkSupabase(url?: string, anonKey?: string): Promise<CheckResult> {
  if (!url || !anonKey) return { ok: false, error: 'Supabase URL or ANON key missing' }
  // Use auth settings endpoint which is public to verify reachability/auth
  const endpoint = `${url.replace(/\/$/, '')}/auth/v1/settings`
  try {
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
      cache: 'no-store',
    })
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : res.statusText }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

async function checkPinecone(apiKey?: string): Promise<CheckResult> {
  if (!apiKey) return { ok: false, error: 'PINECONE_API_KEY missing' }
  try {
    const res = await fetch('https://api.pinecone.io/actions/whoami', {
      method: 'GET',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      cache: 'no-store',
    })
    return { ok: res.ok, status: res.status, error: res.ok ? undefined : res.statusText }
  } catch (e: any) {
    return { ok: false, error: String(e?.message || e) }
  }
}

export async function GET() {
  const env = {
    OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    PINECONE_API_KEY: Boolean(process.env.PINECONE_API_KEY),
    PINECONE_ENVIRONMENT: Boolean(process.env.PINECONE_ENVIRONMENT),
    PINECONE_INDEX_NAME: Boolean(process.env.PINECONE_INDEX_NAME),
  }

  const [openai, supabase, pinecone] = await Promise.all([
    checkOpenAI(process.env.OPENAI_API_KEY),
    checkSupabase(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    // Pinecone can be optional; if no key, report missing but not fatal
    checkPinecone(process.env.PINECONE_API_KEY),
  ])

  return NextResponse.json(
    {
      ok: openai.ok && supabase.ok, // pinecone is optional
      env,
      services: {
        openai,
        supabase,
        pinecone,
      },
      timestamp: new Date().toISOString(),
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}


