import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

// Solo usar server-side. Nunca exponer el service role key al cliente.
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
