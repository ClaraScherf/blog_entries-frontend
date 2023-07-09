<template>
  <div>
    <br>
    <h1>Statistiken</h1>
    <div class="top-container">
      <div class="dashboard">
        <div class="tile-row">
          <div class="tile">
            <div class="tile-content">
              <h3>Kalorien</h3>
              <h6>Gesamt</h6>
            </div>
            <div class="tile-data">
            <p>{{ formatNumber(totalCalories) }}</p>
            </div>
          </div>
          <div class="tile">
            <div class="tile-content">
              <h3>Schritte</h3>
              <h6>Gesamt</h6>
            </div>
            <div class="tile-data">
            <p>{{ formatNumber(totalSteps) }}</p>
            </div>
          </div>
        </div>
        <div class="tile-row">
          <div class="tile">
            <div class="tile-content">
              <h3>Kalorien</h3>
              <h6>Durchschnitt</h6>
            </div>
            <div class="tile-data">
              <p>{{ formatNumber(averageCalories) }}</p>
            </div>
          </div>
          <div class="tile">
            <div class="tile-content">
              <h3>Schritte</h3>
              <h6>Durchschnitt</h6>
            </div>
            <div class="tile-data">
              <p>{{ formatNumber(averageSteps) }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-box">
        <div class="chart-header">
          <p>Prozentualer Anteil der Emojis</p>
        </div>
        <canvas ref="emojiChart"></canvas>
      </div>
    </div>
    <div class="chart-container">
      <div class="bar-chart">
        <div class="chart-header">
          <p>Kalorien über Zeit</p>
        </div>
        <canvas ref="caloriesChart"></canvas>
      </div>
      <div class="bar-chart">
        <div class="chart-header">
          <p>Schritte über Zeit</p>
        </div>
        <canvas ref="stepsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
// Endpunkt des API-Backends
const endpoint = process.env.VUE_APP_BACKEND_BASE_URL + '/api/v1/blog-entries'
// Definiert die Daten
export default {
  data () {
    return {
      totalCalories: 0,
      totalSteps: 0,
      averageCalories: 0,
      averageSteps: 0,
      emojiCounts: {},
      blogEntries: []
    }
  },
  // Abruf der Blog-Einträge
  mounted () {
    this.fetchBlogEntries()
  },
  // ruft die Blog-Einträge über den Endpunkt ab
  methods: {
    fetchBlogEntries () {
      fetch(endpoint)
        .then((response) => response.json())
        .then((entries) => {
          // Sortiert die Einträge nach Datum aufsteigend
          entries.sort((a, b) => new Date(a.date) - new Date(b.date))

          this.blogEntries = entries
          this.totalCalories = entries.reduce((total, entry) => total + entry.calories, 0)
          this.totalSteps = entries.reduce((total, entry) => total + entry.steps, 0)
          this.averageCalories = this.totalCalories / entries.length
          this.averageSteps = this.totalSteps / entries.length
          this.calculateEmojiCounts(entries)
          this.renderEmojiChart()
          this.renderCaloriesChart()
          this.renderStepsChart()
        })
        .catch((error) => {
          console.error('Fehler beim Abrufen der Einträge:', error)
        })
    },
    // zählt die Häufigkeit der Emojis
    calculateEmojiCounts (entries) {
      this.emojiCounts = {
        0: 0,
        1: 0,
        2: 0
      }
      // durchläuft jeden Blog-Eintrag(entries)
      entries.forEach((entry) => {
        // prüft ob der Emoji in EmojiCount enthalten ist
        if (entry.emojis in this.emojiCounts) {
          // Wenn ja, erhöht um 1
          this.emojiCounts[entry.emojis]++
        }
      })
    },
    // erzeugt aus den Blog-Einträgen ein Diagramm, um die Emojis zu visualisieren
    renderEmojiChart () {
      const chartData = Object.values(this.emojiCounts)
      const chartColors = ['#cceebc', '#ffdca9', '#f7a4a4']
      const emojiLabels = ['😄', '😐', '😔']

      // erzeugt neues Chart-Objekt
      // eslint-disable-next-line no-new
      new Chart(this.$refs.emojiChart.getContext('2d'), {
        type: 'pie',
        data: {
          labels: emojiLabels,
          datasets: [
            {
              data: chartData,
              backgroundColor: chartColors
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const dataset = data.datasets[tooltipItem.datasetIndex]
                const value = dataset.data[tooltipItem.index]
                const total = dataset.data.reduce((acc, curr) => acc + curr)
                const percent = ((value / total) * 100).toFixed(2)
                const emoji = emojiLabels[tooltipItem.index]
                return `${value} (${percent}%) ${emoji}`
              }
            }
          },
          legend: {
            position: 'left'
          }
        }
      })
    },
    // erzeugt aus den Blog-Einträgen ein Diagramm, um Kalorienwerte zu visualisieren
    renderCaloriesChart () {
      const ctx = this.$refs.caloriesChart.getContext('2d')
      const dates = this.blogEntries.map((entry) => this.formatDate(entry.date))
      const calories = this.blogEntries.map((entry) => entry.calories)
      // erzeugt neues Chart-Objekt
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Aufgenommene Kalorien',
              data: calories,
              backgroundColor: '#f3aa60'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    },
    renderStepsChart () {
      const ctx = this.$refs.stepsChart.getContext('2d')
      const dates = this.blogEntries.map((entry) => this.formatDate(entry.date))
      const steps = this.blogEntries.map((entry) => entry.steps)
      // erzeugt neues Chart-Objekt
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [
            {
              label: 'Schritte',
              data: steps,
              backgroundColor: '#8cc0de'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      })
    },
    // Datum im Format TT.MM.JJJJ
    formatDate (date) {
      const parsedDate = new Date(date)
      const day = parsedDate.getDate().toString().padStart(2, '0')
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
      const year = parsedDate.getFullYear()
      return `${day}.${month}.${year}`
    },
    // Formartiert Zahlen mit max. 2 Dezimalstellen
    formatNumber (number) {
      const isWholeNumber = number % 1 === 0
      const roundedNumber = Math.round(number * 10) / 10

      return roundedNumber.toLocaleString('de-DE', {
        maximumFractionDigits: isWholeNumber ? 0 : 2,
        minimumFractionDigits: isWholeNumber ? 0 : 2
      })
    }
  }
}
// CSS
</script>

<style scoped>
.top-container {
  display: flex;
  justify-content: space-between;
}

.dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 45%;
}

.tile-row {
  display: flex;
  justify-content: space-around;
}

.tile {
  flex: 1;
  display: flex;
  padding: 20px;
  margin: 10px;
  text-align: center;
  align-items: stretch;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  background-color: rgba(40, 44, 52, 0.05); /* Hintergrundfarbe geändert */
  color: #2c3e50; /* Schriftfarbe geändert */
}

.tile-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
}

.tile-data {
  display: flex;
  font-size: 2em;
  font-weight: 800;
  justify-content: center;
  align-items: center;
}

.chart-header {
  text-align: center;
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.chart-box {
  width: 50%;
  padding: 50px;
}

.bar-chart {
  width: 50%;
  padding: 50px;
}

canvas {
  width: 80%;
  height: 20vh;
}
</style>
