import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database.types'

export const useSupabaseClient = () => useNuxtApp().$supabase as SupabaseClient<Database>
