<template>
  <div class="container">
    <div class="section">
      <label class="label">🏃 Schrittanzahl:</label>
      <input v-model="schrittScore" type="number" class="input">
    </div>

    <div class="section">
      <label class="label">🍎 Kalorienaufnahme:</label>
      <input v-model="caloriesToday" type="number" class="input">
    </div>

    <div class="section">
      <label class="label">😃 Emojis:</label>
      <select v-model="selectedEmoji" class="dropdown">
        <option value="">Bitte wähle ein Emoji aus</option>
        <option value="😄">😄</option>
        <option value="😐">😐</option>
        <option value="😔">😔</option>
      </select>
    </div>

    <div class="section">
      <label class="label">📓 Tagebuch-Eintrag:</label>
      <textarea v-model="diaryEntry" class="textarea"></textarea>
    </div>

    <button @click="createBlogEntry" class="button">Eintrag erstellen</button>
  </div>
</template>
<style>
.label {
  font-size: 18px;
  margin-bottom: 8px;
}

.dropdown {
  font-size: 16px;
  padding: 8px;
}
</style>

<script>
export default {
  name: 'CreateBlogEntry',
  data () {
    return {
      schrittScore: 0,
      caloriesToday: '',
      emoji: '',
      diaryEntry: ''
    }
  },
  methods: {
    async createBlogEntry () {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        schrittScore: parseInt(this.schrittScore),
        caloriesToday: this.caloriesToday,
        emoji: this.emoji,
        diaryEntry: this.diaryEntry
      })

      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      }
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries'
      fetch(endpoint, requestOptions)
        .then(response => response.text())
        .then(result => window.location.reload())
        .catch(error => console.log('error', error))
      console.log(this.schrittScore)
      console.log(this.caloriesToday)
      console.log(this.emoji)
      console.log(this.diaryEntry)
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
}

.label {
  font-size: 18px;
  margin-bottom: 8px;
}

.input,
.dropdown,
.textarea {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}
</style>
