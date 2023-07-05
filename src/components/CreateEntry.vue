<template>
  <button class="btn btn-success sticky-button" data-bs-toggle="offcanvas" data-bs-target="#persons-create-offcanvas" aria-controls="#persons-create-offcanvas">
    <i class="bi bi-person-plus-fill"></i>
  </button>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="persons-create-offcanvas" aria-labelledby="offcanvas-label">
    <div class="offcanvas-header">
      <h5 id="offcanvas-label">Neuer Eintrag</h5>
      <button type="button" id="close-offcanvas" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="mb-3">
      <label for="date" class="form-label" required>Datum</label>
      <input type="date" class="form-control" id="date" aria-describedby="date" required v-model="date">
      <div class="invalid-feedback">Datum eintragen</div>
    </div>
    <div class="offcanvas-body">
      <form class="text-start needs-validation" id="persons-create-form" novalidate>
        <div class="mb-3">
          <label for="first-name" class="form-label">Kalorien</label>
          <input type="text" class="form-control" id="first-name" v-model="calories" required>
          <div class="invalid-feedback">
            Bitte Kalorien eintragen.
          </div>
        </div>
        <div class="mb-3">
          <label for="last-name" class="form-label">Schritte</label>
          <input type="text" class="form-control" id="last-name" v-model="steps" required>
          <div class="invalid-feedback">
            Bitte Anzahl der Schritte eintragen.
          </div>
        </div>
        <div class="section">
          <label class="label">Tagebuch-Eintrag:</label>
          <textarea v-model="diaryEntry" class="textarea"></textarea>
          <div class="invalid-feedback">
            Bitte Tagebuch-Eintrag verfassen.
          </div>
        </div>
        <div class="mb-3">
          <label for="gender" class="form-label">Emoji</label>
          <select id="gender" class="form-select" v-model="emojis" required>
            <option value="" selected disabled>Choose...</option>
            <option value="0">😄</option>
            <option value="1">😐</option>
            <option value="2">😔</option>
          </select>
          <div class="invalid-feedback">
            Bitte Emoji auswählen
          </div>
        </div>
        <div class="mt-5">
          <button class="btn btn-primary me-3" type="submit" @click.prevent="createEntry">Erstellen</button>
          <button class="btn btn-danger" type="reset">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateEntry',
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
    createEntry () {
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

<style scoped>
.sticky-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 30px;
}
</style>
