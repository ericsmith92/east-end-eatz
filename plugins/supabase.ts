import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig().public

  const supabaseUrl = config.supabaseUrl
  const supabaseAnonKey = config.supabaseAnonKey

  const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey)

  nuxtApp.provide('supabase', supabase)
})
