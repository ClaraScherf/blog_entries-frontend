import { shallowMount } from '@vue/test-utils'
import HealthView from '@/views/HealthView.vue'

describe('HealthView.vue', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, date: [2023, 7, 5], calories: 500, steps: 10000, diaryEntry: 'Great day!', emojis: 0 }])
      })
    )
  })

  afterEach(() => {
    global.fetch.mockClear()
    delete global.fetch
  })

  it('renders properly', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.exists()).toBe(true)
  })

  it('initializes with correct data', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.blog_entries).toEqual([])
  })

  it('formats date correctly', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.formatDate([2023, 7, 5])).toEqual('5.7.2023')
  })

  it('returns correct emoji', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.vm.emoji(0)).toEqual('😄')
    expect(wrapper.vm.emoji(1)).toEqual('😐')
    expect(wrapper.vm.emoji(2)).toEqual('😔')
    expect(wrapper.vm.emoji(3)).toEqual('')
  })

  it('fetches blog entries correctly', done => {
    const wrapper = shallowMount(HealthView)

    // Warten Sie einige Zeit und lassen Sie den Promise von fetch auflösen
    setTimeout(() => {
      wrapper.vm.$nextTick()
        .then(() => {
          expect(fetch).toHaveBeenCalledTimes(1)
          expect(wrapper.vm.blog_entries).toEqual([{ id: 1, date: [2023, 7, 5], calories: 500, steps: 10000, diaryEntry: 'Great day!', emojis: 0 }])

          done() // Wir teilen Jest mit, dass wir mit dem Test fertig sind.
        })
    }, 100)
  })
})
