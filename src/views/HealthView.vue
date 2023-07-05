<template>
  <h1>Health Blog Einträge</h1>
  <br>
  <table class="table">
    <thead>
    <tr>
      <th scope="col">Datum</th>
      <th scope="col">Kalorien</th>
      <th scope="col">Schritte</th>
      <th scope="col">Eintrag</th>
      <th scope="col">Emoji</th>
    </tr>
    </thead>
    <tbody class="table-group-divider0" v-for="blog_entry in blog_entries" :key="blog_entry.id">
    <tr>
      <th scope="row">{{ formatDate(blog_entry.date) }}</th>
      <td>{{ blog_entry.calories }}</td>
      <td>{{ blog_entry.steps }}</td>
      <td>{{ blog_entry.diaryEntry }}</td>
      <td>{{ emoji(blog_entry.emojis) }}</td>
    </tr>
    </tbody>
  </table>
  <create-entry></create-entry>
</template>

<script>

import CreateEntry from '@/components/CreateEntry.vue'

export default {
  name: 'HealthView',
  components: { CreateEntry },
  data () {
    return {
      blog_entries: []
    }
  },
  methods: {
    formatDate (dateArray) {
      const [year, month, day] = dateArray
      return `${day}.${month}.${year}`
    },
    emoji (number) {
      switch (number) {
        case 0:
          return '😄'
        case 1:
          return '😐'
        case 2:
          return '😔'
        default:
          return ''
      }
    }
  },
  mounted () {
    const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries'
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }

    fetch(endpoint, requestOptions)
      .then(response => response.json())
      // eslint-disable-next-line camelcase
      .then(result => result.forEach(blog_entry => {
        this.blog_entries.push(blog_entry)
      }))
      .catch(error => console.log('error', error))
  }
}
</script>

<style scoped>

</style>
