import { ContentCreatorPlugin, Field } from 'tinacms'
import { getFileManipulators } from './useGithubFile'

export const PageCreatorPlugin: ContentCreatorPlugin<any> = {
  __type: 'content-creator',
  name: 'Page',
  fields: [
    {
      name: 'title',
      label: 'Title',
      component: 'text',
    },
    {
      name: 'slug',
      label: 'Slug',
      component: 'text',
    },
    {
      name: 'addToNavigation',
      label: 'Add to Navigation',
      component: 'toggle',
    },
  ],
  async onSubmit({ slug, title, addToNavigation }, cms: any) {
    // create file
    const { commit: commitFile } = getFileManipulators({
      path: `src/content/${slug}.json`,
      parse: JSON.parse,
      serialize: JSON.stringify,
      cms,
    })

    await commitFile({ title, content: 'Lorem ipsum dolor' })

    // add to navigation
    if (addToNavigation) {
      const { loadData, commit: commitNavigation } = getFileManipulators({
        path: 'src/navigation.json',
        parse: JSON.parse,
        serialize: JSON.stringify,
        cms,
      })
      await loadData() // need to do this to update the SHA
      const contents = await import('../navigation.json')
      let navigation = contents.default
      navigation.push({
        label: title,
        slug,
      })
      await commitNavigation(navigation, '[Tina] Add page to navigation')
    }
  },
}
