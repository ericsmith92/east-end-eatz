import { defineStore } from 'pinia'
import type { Place } from '~/types/Place'

const PAGE_SIZE = 15

export const usePlacesStore = defineStore('places', {
  state: () => ({
    list: [] as Place[] | any[],
    status: 'idle' as 'idle' | 'loading' | 'error',
    offset: 0,
    totalCount: 0,
    userRatingsTotal: 300,
    pageSize: PAGE_SIZE,
  }),

  getters: {
    hasNextPage: state => state.offset + state.pageSize < state.totalCount + state.pageSize,
  },

  actions: {
    async fetchPage(start: number = 0) {
      this.status = 'loading'
      const supabase = useSupabaseClient()

      const end = start + this.pageSize - 1

      const { data, error, count } = await supabase
        .from('places')
        .select('*', { count: 'exact' })
        .range(start, end)
        .lt('user_ratings_total', this.userRatingsTotal)
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

    async getNextPage() {
      const nextOffset = this.offset + this.pageSize
      if (nextOffset >= this.totalCount) return
      await this.fetchPage(nextOffset)
    },

    async getPreviousPage() {
      const prevOffset = Math.max(0, this.offset - this.pageSize)
      if (this.offset === 0) return
      await this.fetchPage(prevOffset)
    },
  },
})
