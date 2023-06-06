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
      <th scope="row">{{ blog_entry.date }}</th>
      <td>{{ blog_entry.calories }}</td>
      <td>{{ blog_entry.steps }}</td>
      <td>{{ blog_entry.diary_entry }}</td>
      <td>{{ blog_entry.emojis }}</td>
    </tr>
    </tbody>
  </table>
</template>

<script>

// #TODO: Methode erstellen, um Emojis korrekt darzustellen;
export default {
  name: 'HealthView',
  data () {
    return {
      blog_entries: [
        {
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
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
