import { defineStore } from 'pinia'

export const usePlacesStore = defineStore('places', {
  state: () => ({
    list: [],
    status: 'idle'  // idle | loading | error
  }),

  actions: {
    async fetchAll () {
      this.status = 'loading'
      const supabase = useSupabaseClient()

      //@ts-ignore
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
    }
  }
})
