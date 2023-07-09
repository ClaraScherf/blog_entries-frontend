import { mount } from '@vue/test-utils'
import CreateBlogEntry from '@/components/CreateBlogEntry.vue'

describe('CreateBlogEntry', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(CreateBlogEntry)
  })
  // überprüft anhand der ID oder Datentyp ob Elemente im DOM existieren
  test('renders form correctly', () => {
    expect(wrapper.find('#blogentry-create-form').exists()).toBe(true)
    expect(wrapper.find('#date').exists()).toBe(true)
    expect(wrapper.find('input[type="number"]').exists()).toBe(true)
    expect(wrapper.find('select').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
  })
  // überprüft, ob die Eingabewerte von der Komponente erfasst werden
  test('binds input values correctly', async () => {
    await wrapper.find('#date').setValue('2023-07-05')
    await wrapper.find('input[type="number"]').setValue(1200)
    await wrapper.find('select').setValue('0')
    await wrapper.find('textarea').setValue('Test diary entry')

    expect(wrapper.vm.date).toBe('2023-07-05')
    expect(wrapper.vm.calories).toBe(1200)
    expect(wrapper.vm.emojis).toBe('0')
    expect(wrapper.vm.diaryEntry).toBe('Test diary entry')
  })
})
