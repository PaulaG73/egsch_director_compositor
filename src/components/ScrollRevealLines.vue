<template>
  <p
    ref="rootRef"
    class="typewriter"
    :class="{
      'typewriter--done': done,
      'typewriter--typing': typing,
    }"
  >
    <!-- Reserva altura real para que no “salte” la sección -->
    <span class="typewriter__ghost" aria-hidden="true">{{ text }}</span>
    <span class="typewriter__live">
      <span class="typewriter__words">{{ displayed }}</span><span
        v-if="typing"
        class="typewriter__cursor"
        aria-hidden="true"
      >|</span>
    </span>
  </p>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  /** Si es false, espera (p. ej. a que entre la sección). */
  active: {
    type: Boolean,
    default: true,
  },
  /** ms entre palabras */
  wordDelay: {
    type: Number,
    default: 52,
  },
})

const rootRef = ref(null)
const wordIndex = ref(0)
const started = ref(false)
const done = ref(false)
const typing = ref(false)
const reduceMotion = ref(false)

const words = computed(() => props.text.trim().split(/\s+/).filter(Boolean))

const displayed = computed(() => {
  if (done.value || reduceMotion.value) return props.text
  if (wordIndex.value <= 0) return ''
  return words.value.slice(0, wordIndex.value).join(' ')
})

let observer = null
let typeTimer = null

function clearTypeTimer() {
  if (typeTimer != null) {
    clearTimeout(typeTimer)
    typeTimer = null
  }
}

function finish() {
  clearTypeTimer()
  wordIndex.value = words.value.length
  typing.value = false
  done.value = true
  started.value = true
}

function typeNextWord() {
  if (wordIndex.value >= words.value.length) {
    typing.value = false
    done.value = true
    return
  }
  wordIndex.value += 1
  if (wordIndex.value >= words.value.length) {
    typing.value = false
    done.value = true
    return
  }
  typeTimer = window.setTimeout(typeNextWord, props.wordDelay)
}

function startTyping() {
  if (started.value || done.value) return
  started.value = true

  if (reduceMotion.value || !words.value.length) {
    finish()
    return
  }

  // Si ya pasó de largo el párrafo, mostrar completo
  const el = rootRef.value
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.bottom < window.innerHeight * 0.22) {
      finish()
      return
    }
  }

  typing.value = true
  wordIndex.value = 0
  typeTimer = window.setTimeout(typeNextWord, 180)
}

function setupObserver() {
  observer?.disconnect()
  observer = null

  const el = rootRef.value
  if (!el || typeof IntersectionObserver === 'undefined') {
    if (props.active) startTyping()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting || !props.active) continue
        startTyping()
        observer?.unobserve(entry.target)
      }
    },
    {
      threshold: 0.28,
      rootMargin: '0px 0px -12% 0px',
    },
  )
  observer.observe(el)
}

function resetAndPrepare() {
  clearTypeTimer()
  observer?.disconnect()
  observer = null
  started.value = false
  done.value = false
  typing.value = false
  wordIndex.value = 0

  if (reduceMotion.value) {
    finish()
    return
  }

  nextTick(() => {
    if (props.active) setupObserver()
  })
}

watch(
  () => props.active,
  (isActive) => {
    if (isActive) {
      nextTick(() => {
        if (!started.value) setupObserver()
      })
    }
  },
)

watch(
  () => props.text,
  () => {
    resetAndPrepare()
  },
)

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  nextTick(() => {
    if (reduceMotion.value) {
      finish()
      return
    }
    if (props.active) setupObserver()
  })
})

onUnmounted(() => {
  clearTypeTimer()
  observer?.disconnect()
  observer = null
})
</script>

<style scoped>
.typewriter {
  margin: 0;
  width: 100%;
  position: relative;
  text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
}

.typewriter__ghost {
  display: block;
  visibility: hidden;
  pointer-events: none;
}

.typewriter__live {
  position: absolute;
  inset: 0;
  text-align: justify;
  text-wrap: pretty;
  hyphens: auto;
}

.typewriter__cursor {
  display: inline-block;
  margin-left: 0.08em;
  color: var(--ms-accent-on-dark);
  font-weight: 400;
  animation: typewriter-blink 0.9s steps(1, end) infinite;
}

@keyframes typewriter-blink {
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .typewriter__cursor {
    display: none;
    animation: none;
  }
}
</style>
