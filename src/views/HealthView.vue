<template>
  <br>
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
  // nimmt das Array der Datumsinformationen und gibt das formartierte Datum zurück
  methods: {
    formatDate (date) {
      const parsedDate = new Date(date)
      const day = parsedDate.getDate().toString().padStart(2, '0')
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
      const year = parsedDate.getFullYear()
      return `${day}.${month}.${year}`
    },
    // nimmt eine Zahl entgegen und gibt das entsprechende Emoji zurück
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
    // sortiert Einträge nach der Sortierrichtung
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
    // sendet für den ausgewählten Eintrag eine DELETE-Anfrage an den Server
    async deleteSelectedEntries () {
      // iteriert über das blog_entries Array
      for (const entry of this.blog_entries) {
        // für jeden ausgewählten Eintrag wird ein requestOptions Objekt für eine DELETE Anfrage erstellt
        if (entry.selected) {
          const requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          }
          // mit fetch wird eine DELETE-Anfrage an die API-URL gesendet
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
  // zeigt die Blog-Einträge nach dem Laden der Komponente an und sortiert sie nach dem Datum
  mounted () {
    const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries'
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    }
    // GET-Anfrage wird an API Endpunkt geschickt
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
