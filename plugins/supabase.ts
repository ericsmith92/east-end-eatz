// plugins/supabase.ts
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig().public

  const supabaseUrl     = config.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey

  // One shared instance for server-side rendering *and* browser
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  nuxtApp.provide('supabase', supabase)
})
