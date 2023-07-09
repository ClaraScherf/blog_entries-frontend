import { shallowMount } from '@vue/test-utils'
import HealthView from '@/views/HealthView.vue'

describe('HealthView.vue', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            id: 1,
            date: [2023, 7, 5],
            calories: 500,
            steps: 10000,
            diaryEntry: 'Great day!',
            selected: false,
            emojis: 0
          }])
      })
    )
  })

  afterEach(() => {
    global.fetch.mockClear()
    delete global.fetch
  })
  // überprüft, ob die HealthView Komponente existiert
  it('renders properly', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.exists()).toBe(true)
  })
  // überprüft, ob die blog_entries in der Komponente initialisiert und leer sind
  it('initializes with correct data', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.blog_entries).toEqual([])
  })
  // überprüft, ob formatDate richtig formartiert ist
  it('formats date correctly', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.formatDate([2023, 7, 5])).toEqual('05.07.2023')
  })
  // überprüft, ob das richtige Emoji zurückgegeben wird
  it('returns correct emoji', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.emoji(0)).toEqual('😄')
    expect(wrapper.vm.emoji(1)).toEqual('😐')
    expect(wrapper.vm.emoji(2)).toEqual('😔')
    expect(wrapper.vm.emoji(3)).toEqual('')
  })
  // überprüft, ob die blog_entries Daten erfolgreich abgerufen werden
  it('fetches blog entries correctly', done => {
    const wrapper = shallowMount(HealthView)

    // Warten Sie einige Zeit und lassen Sie den Promise von fetch auflösen
    setTimeout(() => {
      wrapper.vm.$nextTick()
        .then(() => {
          expect(fetch).toHaveBeenCalledTimes(1)
          expect(wrapper.vm.blog_entries).toEqual([
            {
              id: 1,
              date: [2023, 7, 5],
              calories: 500,
              steps: 10000,
              diaryEntry: 'Great day!',
              selected: false,
              emojis: 0
            }])

          done() // teilt Jest mit, dass der Test abgeschlossen ist
        })
    }, 100)
  })
})
