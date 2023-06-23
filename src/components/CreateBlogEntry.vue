<template>
  <div class="home">
    <form class="mx-auto was-validated" style="width: 300px; padding-top: 50px;">
      <div class="mb-4">
        <label for="moodScore" class="form-label" required>Was ist deine Schrittanzahl heute?</label>
        <select class="form-select" required aria-label="Auswahl Schrittanzahl" form-select-padding-y="400" form-select-padding-x="400" id="schrittScore" v-model="schrittScore">
          <option selected value="">Wähle deine Schrittanzahl</option>
          <option value=1>unter 1000</option>
          <option value=2>über 1000 - 2000</option>
          <option value=3>über 2000 - 3000</option>
          <option value=4>über 3000 - 4000</option>
          <option value=5>über 5000</option>
        </select>
        <div class="invalid-feedback">Bitte wähle eine Option.</div>
      </div>
      <div class="mb-3">
        <label for="eventsToday" class="form-label" required>Wie viele Kalorien hast du heute zu dir genommen?</label>
        <select class="form-select" required aria-label="Auswahl Kalorienaufnahme" id="caloriesToday" v-model="caloriesToday">
          <option selecte value="">Wähle...</option>
          <option value="sehr wenig">unter 500</option>
          <option value="wenig">500 - 1000</option>
          <option value="okay">1000 - 1500</option>
          <option value="gut">1500 - 2000</option>
          <div class="invalid-feedback">Enter feedback.</div>
        </select>
      </div>
      <div class="mb-3">
        <label for="date" class="form-label" required>Date</label>
        <input type="date" class="form-control" id="date" aria-describedby="date" required v-model="date">
        <div class="invalid-feedback">Enter date.</div>
      </div>
      <button type="submit" class="btn btn-primary" @click.prevent="createBlogEntry">Submit</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateBlogEntry',
  data () {
    return {
      schrittScore: 0,
      date: '',
      caloriesToday: ''
    }
  },
  methods: {
    async createBlogEntry () {
      const myHeaders = new Headers()
      myHeaders.append('Content-Type', 'application/json')

      const raw = JSON.stringify({
        entryDate: this.date,
        schrittScore: parseInt(this.schrittScore),
        caloriesToday: this.caloriesToday
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
      console.log(this.date)
      console.log(this.caloriesToday)
      // window.location.reload() // i use this because @click gives network error, while .prevent wont
    }
  }

}
</script>
