import React, { useEffect, useState, useMemo } from 'react'
import { NotFound } from './NotFound'
import { useGithubFile } from '../util/useGithubFile'
import { useForm, usePlugins } from 'tinacms'
import { useEditMode } from '../components/EditMode'

export const Page = (props: any) => {
  const { slug } = props.match.params
  const [content, setContent] = useState({}) as any
  const [hasError, setHasError] = useState(false)
  const [editMode] = useEditMode()

  const { loadData, commit } = useGithubFile({
    path: `src/content/${slug}.json`,
    parse: JSON.parse,
    serialize: JSON.stringify,
  })

  const [formContent, form] = useForm({
    id: slug,
    label: 'Edit Page',
    loadInitialValues: editMode ? loadData : async () => content,
    onSubmit: async (values: any) => commit(values),
    fields: [
      {
        name: 'title',
        label: 'Title',
        component: 'text',
      },
      {
        name: 'content',
        label: 'Content',
        component: 'textarea',
      },
    ],
  })

  usePlugins(form)

  useEffect(() => {
    import(`../content/${slug}.json`)
      .then((content) => {
        setContent(content.default)
        setHasError(false)
      })
      .catch((e) => {
        setHasError(true)
      })
  }, [slug, setContent, setHasError])

  const layoutContent = useMemo(() => {
    if (editMode && formContent) {
      return formContent
    }

    return content
  }, [formContent, content, editMode])

  if (hasError) {
    return <NotFound />
  }

  return (
    <>
      <h1>{layoutContent.title}</h1>
      <div>{layoutContent.content}</div>
    </>
  )
}
