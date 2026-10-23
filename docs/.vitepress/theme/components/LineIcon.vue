<script setup>
defineProps({ name: { type: String, default: 'book' } })
const paths = {
 close: 'm6 6 12 12M18 6 6 18',
 search: 'M21 21l-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
 lock: 'M6 10h12v11H6V10zm3 0V6a3 3 0 0 1 6 0v4',
 person: 'M4 21v-3a8 8 0 0 1 16 0v3M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 chart: 'M4 4v16h16M8 15l4-5 4 3 4-8',
 network: 'M12 3v5m0 8v5M3 12h5m8 0h5M7 7l3 3m4 4 3 3M7 17l3-3m4-4 3-3',
 fitness: 'M3 8v8m3-11v14m12-14v14m3-11v8M6 12h12',
 balance: 'M12 3v18M5 6h14M5 6l-3 8h6L5 6zm14 0-3 8h6l-3-8zM8 21h8',
 book: 'M3 4h7a2 2 0 0 1 2 2v15a3 3 0 0 0-3-2H3V4zm18 0h-7a2 2 0 0 0-2 2v15a3 3 0 0 1 3-2h6V4z',
 code: 'm8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16',
 project: 'M3 7h7l2 2h9v11H3V7zm0 0V4h7l2 3',
 tools: 'm14 6 4 4M3 21l9-9m2-10a6 6 0 0 0-7 7l-5 5a3 3 0 0 0 4 4l5-5a6 6 0 0 0 7-7l-4 4-4-4 4-4z',
 bookmark: 'M6 3h12v18l-6-4-6 4V3z',
 globe: 'M3 12h18M12 3c-6 5-6 13 0 18m0-18c6 5 6 13 0 18',
 rss: 'M4 4a16 16 0 0 1 16 16M4 10a10 10 0 0 1 10 10M4 17v3h3',
 message: 'M4 4h16v12H8l-4 4V4z',
 moon: 'M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11z'
}
</script>
<template><svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle v-if="name === 'globe'" cx="12" cy="12" r="9" /><path :d="paths[name] || paths.book" /></svg></template>
