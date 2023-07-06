<template>
  <h1>Health Blog Einträge</h1>
  <br>
  <table class="table">
    <thead>
    <tr>
      <th scope="col">Aktion</th>
      <th scope="col" @click="sortEntries('date')">
        Datum
        <i class="bi bi-caret-up-fill" :class="{ 'text-muted': !(sortKey === 'date' && sortOrder === 1) }"></i>
        <i class="bi bi-caret-down-fill" :class="{ 'text-muted': !(sortKey === 'date' && sortOrder === -1) }"></i>
      </th>
      <th scope="col" @click="sortEntries('calories')">
        Kalorien
        <i class="bi bi-caret-up-fill" :class="{ 'text-muted': !(sortKey === 'calories' && sortOrder === 1) }"></i>
        <i class="bi bi-caret-down-fill" :class="{ 'text-muted': !(sortKey === 'calories' && sortOrder === -1) }"></i>
      </th>
      <th scope="col" @click="sortEntries('steps')">
        Schritte
        <i class="bi bi-caret-up-fill" :class="{ 'text-muted': !(sortKey === 'steps' && sortOrder === 1) }"></i>
        <i class="bi bi-caret-down-fill" :class="{ 'text-muted': !(sortKey === 'steps' && sortOrder === -1) }"></i>
      </th>
      <th scope="col">Eintrag</th>
      <th scope="col">Emoji</th>
    </tr>
    </thead>
    <tbody class="table-group-divider0" v-for="blog_entry in blog_entries" :key="blog_entry.id">
    <tr>
      <td><input type="checkbox" v-model="blog_entry.selected"></td>
      <th scope="row">{{ formatDate(blog_entry.date) }}</th>
      <td>{{ blog_entry.calories }}</td>
      <td>{{ blog_entry.steps }}</td>
      <td>{{ blog_entry.diaryEntry }}</td>
      <td>{{ emoji(blog_entry.emojis) }}</td>
    </tr>
    </tbody>
  </table>
  <div class="delete-button-container">
    <button type="button" class="btn btn-danger" @click="deleteSelectedEntries">Löschen</button>
  </div>
</template>

<script>

export default {
  name: 'HealthView',
  data () {
    return {
      blog_entries: [],
      sortKey: '',
      sortOrder: 1
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
    },
    sortEntries (key) {
      if (this.sortKey === key) {
        this.sortOrder *= -1
      } else {
        this.sortOrder = 1
      }
      this.sortKey = key

      this.blog_entries.sort((a, b) => {
        if (key === 'date') {
          const aDate = new Date(a[key][0], a[key][1] - 1, a[key][2])
          const bDate = new Date(b[key][0], b[key][1] - 1, b[key][2])
          return this.sortOrder * (aDate - bDate)
          // eslint-disable-next-line brace-style
        }
        // Normale numerische Sortierung für 'calories' und 'steps'
        else {
          return this.sortOrder * (a[key] - b[key])
        }
      })
    },
    async deleteSelectedEntries () {
      for (const entry of this.blog_entries) {
        if (entry.selected) {
          const requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          }

          await fetch(process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries/' + entry.id, requestOptions)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to delete entry ${entry.id}`)
              }
            })
            .catch(error => console.log('error', error))
        }
      }

      // Nachdem die Einträge auf dem Server gelöscht wurden, aktualisieren wir die Ansicht
      this.blog_entries = this.blog_entries.filter(entry => !entry.selected)
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
      .then(result => {
        // eslint-disable-next-line camelcase
        result.forEach(blog_entry => {
          // Hinzufügen der 'selected' Eigenschaft zu jedem Eintrag
          blog_entry.selected = false
          this.blog_entries.push(blog_entry)
        })
        // Sortieren der Einträge nach dem Datum
        this.sortEntries('date')
      })
      .catch(error => console.log('error', error))
  }
}
</script>

<style scoped>
.delete-button-container {
  display: flex;
  justify-content: flex-start;
  padding-left: 25px;
}
</style>
