<script setup lang="ts">
import {useDataStore} from '@/data'
import type {Datapack} from '@/types'

const data = useDataStore()
</script>

<template>
  <input type="file" accept=".json" @change="handleFileUpload" />
  {{data.data}}
</template>
