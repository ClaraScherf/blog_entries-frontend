<template>
  <div class="container">
    <div class="mb-3">
      <label for="date" class="form-label" required>Datum</label>
      <input type="date" class="form-control" id="date" aria-describedby="date" required v-model="date">
      <div class="invalid-feedback">Datum eintragen</div>
    </div>
    <div class="section">
      <label class="label">🍎 Kalorienaufnahme:</label>
      <input v-model="calories" type="number" class="input">
    </div>
    <div class="section">
      <label class="label">🏃 Schrittanzahl:</label>
      <input v-model="steps" type="number" class="input">
    </div>
    <div class="section">
      <label class="label">😃 Emojis:</label>
      <select v-model="emojis" class="dropdown">
        <option value="">Bitte wähle ein Emoji aus</option>
        <option value="0">😄</option>
        <option value="1">😐</option>
        <option value="2">😔</option>
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
      date: '',
      calories: '',
      steps: '',
      diaryEntry: '',
      emojis: ''
    }
  },
  methods: {
    createBlogEntry () {
      const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries'

      const headers = new Headers()
      headers.append('Content-Type', 'application/json')

      const payload = JSON.stringify({
        date: this.date,
        steps: this.steps,
        calories: this.calories,
        emojis: this.emojis,
        diaryEntry: this.diaryEntry
      })

      const requestOptions = {
        method: 'POST',
        headers: headers,
        body: payload,
        redirect: 'follow'
      }

      fetch(endpoint, requestOptions)
        .catch(error => console.log('error', error))
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
