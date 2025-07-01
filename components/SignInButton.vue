<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const fallbackAvatar = 'https://placehold.co/40x40?text=U'

function signIn() {
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

async function signOut() {
  await supabase.auth.signOut()
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
        alt=""
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
