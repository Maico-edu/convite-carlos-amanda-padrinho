<script setup>
import { ref } from 'vue'
import EnvelopeScreen from './components/EnvelopeScreen.vue'
import InvitationPage from './components/InvitationPage.vue'

const opened = ref(false)

function scrollTop() {
  window.scrollTo(0, 0)
}
</script>

<template>
  <Transition name="screen" mode="out-in" @enter="scrollTop">
    <EnvelopeScreen v-if="!opened" key="envelope" @opened="opened = true" />
    <InvitationPage v-else key="invitation" @back="opened = false" />
  </Transition>
</template>
