import React, { useEffect, useState, useMemo } from 'react'
import { NotFound } from './NotFound'
import { useGithubFile } from '../util/useGithubFile'
import { useForm, usePlugins, useCMS } from 'tinacms'
import { useEditMode } from '../components/EditMode'
import { HeaderImage } from '../components/HeaderImage'

export const Page = (props: any) => {
  const cms = useCMS()
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
        name: 'image',
        label: 'Image',
        component: 'image',
        parse(filename: string) {
          return filename
        },
        async previewSrc(formValues: any) {
          try {
            return await cms.api.github.getMediaUri(
              `/src/content/img/${formValues.image}`
            )
          } catch (e) {
            cms.alerts.error(e.message)
          }
        },
        uploadDir(formValues: any) {
          return '/src/content/img/'
        },
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
    setHasError(false)
    if (!editMode) {
      import(`../content/${slug}.json`)
        .then((content) => {
          setContent(content.default)
        })
        .catch((e) => {
          setHasError(true)
        })
    } else {
      // TODO now we're loading this data 2x when in edit mode
      loadData().then((result) => {
        if (result && result.error) {
          setHasError(true)
        }
      })
    }
  }, [slug, setContent, setHasError, editMode])

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
      {layoutContent.image && <HeaderImage image={layoutContent.image} />}
      <h1>{layoutContent.title}</h1>
      <div>{layoutContent.content}</div>
    </>
  )
}
