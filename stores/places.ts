import { defineStore } from 'pinia'
import type { Place } from '~/types/Place'

const PAGE_SIZE = 15

interface PlacesState {
  list: Place[] | any[]
  current: Place | any | null
  status: 'idle' | 'loading' | 'error'
  offset: number
  totalCount: number
  userRatingsTotal: number
  pageSize: number
}

export const usePlacesStore = defineStore('places', {
  state: (): PlacesState => ({
    list: [],
    current: null,
    status: 'idle',
    offset: 0,
    totalCount: 0,
    userRatingsTotal: 300,
    pageSize: PAGE_SIZE,
  }),

  getters: {
    hasNextPage: state => state.totalCount - state.offset > state.pageSize,
  },

  actions: {
    async fetchPlace(id: number) {
      this.status = 'loading'
      const supabase = useSupabaseClient()

      const { data, error } = await supabase.from('places').select('*').eq('id', id).single()

      if (error) {
        console.error(error)
        this.status = 'error'
        return
      }

      this.current = data
      this.status = 'idle'
    },

    async fetchPage(start: number = 0) {
      this.status = 'loading'
      const supabase = useSupabaseClient()

      const end = start + this.pageSize - 1

      const { data, error, count } = await supabase
        .from('places')
        .select('*', { count: 'exact' })
        .range(start, end)
        .lt('user_ratings_total', this.userRatingsTotal)
        .gte('rating', 4)
        .order('rating', { ascending: false })

      if (error) {
        console.error(error)
        this.status = 'error'
        return
      }

      this.list = data || []
      this.totalCount = count || 0
      this.offset = start
      this.status = 'idle'
    },

    async getNextPage(fetchCallback?: (start: number) => Promise<void>) {
      const callback = fetchCallback || this.fetchPage
      const nextOffset = this.offset + this.pageSize
      if (nextOffset >= this.totalCount) return
      await callback(nextOffset)
    },

    async getPreviousPage(fetchCallback?: (start: number) => Promise<void>) {
      const callback = fetchCallback || this.fetchPage
      const prevOffset = Math.max(0, this.offset - this.pageSize)
      if (this.offset === 0) return
      await callback(prevOffset)
    },

    async fetchBasedOnTerm(term: string, start: number = 0) {
      this.status = 'loading'

      if (!term) {
        await this.fetchPage(start)
        return
      }

      const supabase = useSupabaseClient()
      const end = start + this.pageSize - 1

      const { data, error, count } = await supabase
        .from('places')
        .select('*', { count: 'exact' })
        .range(start, end)
        .ilike('name', `%${term}%`)

      if (error) {
        console.error(error)
        this.status = 'error'
        return
      }

      this.list = data || []
      this.totalCount = count || 0
      this.offset = start
      this.status = 'idle'
    },
  },
})
