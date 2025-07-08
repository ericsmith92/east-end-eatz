<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fallbackAvatar = '/img/avatar-placeholder.png'

async function signIn() {
  try {
    const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo },
    })

    if (error) {
      console.error(error)
    }
  } catch (err) {
    console.error(err)
  }
}

async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error(error)
    }
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <button
      v-if="user"
      @click="signOut"
      class="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
    >
      <img
        :src="user.user_metadata.avatar_url || fallbackAvatar"
        :alt="
          user.user_metadata.full_name ? `${user.user_metadata.full_name}'s avatar` : 'User avatar'
        "
        class="h-6 w-6 rounded-full"
      />
      <span class="hidden sm:inline">Sign out</span>
    </button>

    <button
      v-else
      @click="signIn"
      class="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Sign in
    </button>
  </div>
</template>
