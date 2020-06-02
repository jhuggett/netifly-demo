import React, { useMemo } from 'react'
import { useEditMode } from '../components/EditMode'
import { useGithubFile } from '../util/useGithubFile'
import { useForm, usePlugins } from 'tinacms'
import content from '../content/home.json'
import logo from '../logo.svg'

export const Home = () => {
  const [editMode] = useEditMode()
  const { loadData, commit } = useGithubFile({
    path: 'src/content/home.json',
    parse: JSON.parse,
    serialize: JSON.stringify,
  })

  const formConfig = {
    id: 'home-content',
    label: 'Content',
    onSubmit: (values: any) => commit(values),
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'spin',
        label: 'Spin Direction',
        component: 'select',
        options: ['clockwise', 'counter-clockwise'],
      },
      {
        name: 'link',
        label: 'Link',
        component: 'group',
        fields: [
          {
            name: 'url',
            label: 'URL',
            component: 'text',
          },
          {
            name: 'text',
            label: 'Text',
            component: 'text',
          },
        ],
      },
    ],
    loadInitialValues: editMode ? loadData : async () => content,
  }

  const [tinaContent, form] = useForm(formConfig)
  usePlugins(form)
  const layoutContent = useMemo(() => {
    if (Object.keys(tinaContent).length > 0) {
      return tinaContent
    }
    return content
  }, [tinaContent])
  return (
    <>
      <img
        src={logo}
        className="App-logo"
        data-spin={layoutContent.spin}
        alt="logo"
      />
      <p>{layoutContent.title}</p>
      <a
        className="App-link"
        href={layoutContent.link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {layoutContent.link.text}
      </a>
    </>
  )
}
