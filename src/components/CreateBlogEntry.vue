<template>
  <div class="container">
    <form class="text-start needs-validation" novalidate id="blogentry-create-form">
    <div class="section">
      <label for="date" class="form-label">Datum:</label>
      <input type="date" class="form-control" id="date" v-model="date" required>
      <div class="invalid-feedback">Bitte Datum eintragen.</div>
    </div>
    <div class="section">
      <label class="label">🍎 Kalorienaufnahme:</label>
      <input v-model="calories" type="number" class="form-control" required>
      <div class="invalid-feedback">Bitte Kalorien eintragen.</div>
    </div>
    <div class="section">
      <label class="label">🏃 Schrittanzahl:</label>
      <input v-model="steps" type="number" class="form-control" required>
      <div class="invalid-feedback">Bitte Schritte eintragen.</div>
    </div>
    <div class="section">
      <label class="form-label">😃 Emojis:</label>
      <select v-model="emojis" class="form-select" required>
        <option value="">Bitte wähle ein Emoji aus</option>
        <option value="0">😄</option>
        <option value="1">😐</option>
        <option value="2">😔</option>
      </select>
      <div class="invalid-feedback">Bitte Emoji auswählen.</div>
    </div>
    <div class="section">
      <label class="label">📓 Tagebuch-Eintrag:</label>
      <textarea v-model="diaryEntry" class="form-control" required></textarea>
      <div class="invalid-feedback">Bitte Tagebuch-Eintrag erfassen.</div>
    </div>
      <div v-if="this.serverValidationMessages">
        <ul>
          <li v-for="(message, index) in serverValidationMessages" :key="index" style="color: red">
            {{ message }}
          </li>
        </ul>
      </div>
    <div class="section">
    <button @click="createBlogEntry" id="button" class="button" type="submit">
      <i class="bi bi-calendar-plus-fill"></i> Eintrag erstellen
    </button>
    </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateBlogEntry',
  data () {
    return {
      date: '',
      calories: '',
      steps: '',
      diaryEntry: '',
      emojis: '',
      serverValidationMessages: []
    }
  },
  emits: ['created'],
  methods: {
    async createBlogEntry () {
      this.serverValidationMessages = []
      const valid = this.validate()
      if (valid) {
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

        const response = await fetch(endpoint, requestOptions)
        await this.handleResponse(response)
      }
    },
    async handleResponse (response) {
      if (response.ok) {
        this.$emit('created', response.headers.get('location'))
        document.getElementById('button').click()
      } else if (response.status === 400) {
        response = await response.json()
        response.errors.forEach(error => {
          this.serverValidationMessages.push(error.defaultMessage)
        })
      } else {
        this.serverValidationMessages.push('Unknown error occurred')
      }
    },
    validate () {
      let valid = true
      // Fetch all the forms we want to apply custom Bootstrap validation styles to
      const forms = document.querySelectorAll('.needs-validation')

      // Loop over them and prevent submission
      Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
          if (!form.checkValidity()) {
            valid = false
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
      return valid
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
  align-items: center;
  margin-bottom: 16px;
}

.label {
  font-size: 18px;
  margin-bottom: 8px;
}

.button {
  padding: 8px 16px;
  font-size: 18px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background-color: #0056b3;
}

.label {
  font-size: 18px;
  margin-bottom: 8px;
}

</style>
