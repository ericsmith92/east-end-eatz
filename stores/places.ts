import { defineStore } from 'pinia'
import type { Place } from '~/types/Place'

export const usePlacesStore = defineStore('places', {
  state: () => ({
    list: [] as Place[] | any[],
    status: 'idle',
  }),

  actions: {
    async fetchAll() {
      this.status = 'loading'
      const supabase = useSupabaseClient()

      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('rating', { ascending: false })

      if (error) {
        console.error(error)
        this.status = 'error'
        return
      }

      this.list = data
      this.status = 'idle'
    },
  },
})
