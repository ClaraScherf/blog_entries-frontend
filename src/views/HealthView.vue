<template>
  <br>
  <h1>Health Blog Einträge</h1>
  <br>
  <BlogEntriesTable :blog_entries="blog_entries" @delete-selected-entries="handleDeletedEntries" @loaded-entries="handleLoadedEntries"/>
</template>

<script>
import BlogEntriesTable from '@/components/BlogEntriesTable'

export default {
  name: 'HealthView',
  components: {
    BlogEntriesTable
  },
  data () {
    return {
      blog_entries: []
    }
  },
  methods: {
    handleDeletedEntries (deletedIds) {
      this.blog_entries = this.blog_entries.filter(entry => !deletedIds.includes(entry.id))
    },
    handleLoadedEntries (loadedEntries) {
      this.blog_entries = loadedEntries
    }
  }
}
</script>

<style scoped>
</style>
