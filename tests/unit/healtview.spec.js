import { shallowMount } from '@vue/test-utils'
import HealthView from '@/views/HealthView'
import BlogEntriesTable from '@/components/BlogEntriesTable'

describe('HealthView', () => {
  it('renders the component properly', () => {
    const wrapper = shallowMount(HealthView)
    expect(wrapper.exists()).toBe(true)
  })

  it('passes correct props to BlogEntriesTable component', () => {
    const wrapper = shallowMount(HealthView)
    const blogEntriesTable = wrapper.findComponent(BlogEntriesTable)
    expect(blogEntriesTable.props('blog_entries')).toEqual([])
  })

  it('updates blog_entries when handling deleted entries', () => {
    const wrapper = shallowMount(HealthView)
    const deletedIds = [1, 3, 5]

    // Set initial blog_entries data
    wrapper.setData({
      blog_entries: [
        { id: 1, title: 'Entry 1' },
        { id: 2, title: 'Entry 2' },
        { id: 3, title: 'Entry 3' },
        { id: 4, title: 'Entry 4' },
        { id: 5, title: 'Entry 5' }
      ]
    })

    // Trigger the event handler
    wrapper.vm.handleDeletedEntries(deletedIds)

    // Check if deleted entries are removed from blog_entries
    expect(wrapper.vm.blog_entries).toEqual([
      { id: 2, title: 'Entry 2' },
      { id: 4, title: 'Entry 4' }
    ])
  })

  it('updates blog_entries when handling loaded entries', () => {
    const wrapper = shallowMount(HealthView)
    const loadedEntries = [
      { id: 1, title: 'Entry 1' },
      { id: 2, title: 'Entry 2' },
      { id: 3, title: 'Entry 3' }
    ]

    // Trigger the event handler
    wrapper.vm.handleLoadedEntries(loadedEntries)

    // Check if blog_entries is updated with loaded entries
    expect(wrapper.vm.blog_entries).toEqual(loadedEntries)
  })
})
