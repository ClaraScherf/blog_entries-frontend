<template>
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
  name: 'BlogEntriesTable',
  props: ['blog_entries'],
  data () {
    return {
      blogEntries: [],
      sortKey: '',
      sortOrder: -1
    }
  },
  watch: {
    blog_entries (newEntries) {
      this.blogEntries = newEntries
      this.sortOrder = -1
      this.$nextTick(() => {
        this.sortEntries('date')
      })
    }
  },
  async created () {
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
          blog_entry.selected = false
          this.blogEntries.push(blog_entry)
        })
        this.sortEntries('date')
        this.$emit('loaded-entries', this.blogEntries)
      })
      .catch(error => console.log('error', error))
  },
  methods: {
    formatDate (date) {
      const parsedDate = new Date(date)
      const day = parsedDate.getDate().toString().padStart(2, '0')
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
      const year = parsedDate.getFullYear()
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
      // If the key is different from the current sortKey, reset sortOrder to default
      if (this.sortKey !== key) {
        this.sortOrder = -1
      } else {
        // Otherwise, toggle sortOrder
        this.sortOrder *= -1
      }

      this.sortKey = key

      this.blogEntries.sort((a, b) => {
        if (key === 'date') {
          const aDate = new Date(a[key])
          const bDate = new Date(b[key])
          return this.sortOrder * (aDate - bDate)
        } else {
          return this.sortOrder * (a[key] - b[key])
        }
      })
    },
    async deleteSelectedEntries () {
      const toDelete = this.blogEntries.filter(entry => entry.selected).map(entry => entry.id)
      for (const id of toDelete) {
        const requestOptions = {
          method: 'DELETE',
          redirect: 'follow'
        }

        await fetch(process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries/' + id, requestOptions)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to delete entry ${id}`)
            }
          })
          .catch(error => console.log('error', error))
      }
      this.$emit('delete-selected-entries', toDelete)
    }
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
