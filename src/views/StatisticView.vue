<template>
  <div>
    <br>
    <h1>Statistiken</h1>
    <div class="dashboard">
      <div class="tile bg-primary">
        <h4 class="text-white">Kalorien Gesamt</h4>
        <p class="text-white">{{ formatNumber(totalCalories) }}</p>
      </div>
      <div class="tile bg-secondary">
        <h4>Schritte Gesamt</h4>
        <p>{{ formatNumber(totalSteps) }}</p>
      </div>
      <div class="tile bg-info">
        <h4>Kalorien Durchschnitt</h4>
        <p>{{ formatNumber(averageCalories) }}</p>
      </div>
      <div class="tile bg-success">
        <h4>Schritte Durchschnitt</h4>
        <p>{{ formatNumber(averageSteps) }}</p>
      </div>
    </div>
    <div class="chart-container">
      <div class="chart-box">
        <div class="chart-header">
          <p>Prozentualer Anteil der Emojis</p>
        </div>
        <canvas ref="emojiChart"></canvas>
      </div>
      <div class="chart-box">
        <div class="chart-header">
          <p>Kalorien über Zeit</p>
        </div>
        <canvas ref="caloriesChart"></canvas>
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
      const chartColors = ['#FF6384', '#36A2EB', '#FFCE56']
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
      const maxCalories = Math.max(...calories) + 200
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
              backgroundColor: '#007bff'
              // borderColor: 'rgba(75, 192, 192, 1)',
              // borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                max: maxCalories,
                stepSize: 300
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
      return number.toLocaleString('de-DE', {
        maximumFractionDigits: 2
      })
    }
  }
}
// CSS
</script>

<style scoped>
.dashboard {
  display: flex;
}

.tile {
  flex: 1;
  padding: 20px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.bg-primary {
  background-color: #007bff;
}

.bg-secondary {
  background-color: #6c757d;
}

.bg-info {
  background-color: #17a2b8;
}

.bg-success {
  background-color: #28a745;
}

.text-white {
  color: #fff;
}

.chart-header {
  text-align: center;
  font-size: 20px;
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

canvas {
  width: 80%;
  height: 20vh;
}
</style>
