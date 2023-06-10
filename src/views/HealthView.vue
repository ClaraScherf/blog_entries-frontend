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
</template>

<script>

export default {
  name: 'HealthView',
  data () {
    return {
      blog_entries: [

        /* {
          id: 1,
          date: '01.06.2023',
          calories: 2500,
          steps: 10000,
          diary_entry: 'Top!',
          emojis: 0
        },
        {
          id: 2,
          date: '02.06.2023',
          calories: 2500,
          steps: 4500,
          diary_entry: 'Top!',
          emojis: 2
        } */
      ]
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
