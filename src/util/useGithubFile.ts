import { useState, useEffect, useRef, useCallback } from 'react'
import { useCMS } from 'tinacms'
import { FORM_ERROR } from 'final-form'

type parseFn = (content: string) => any
type serializeFn = (data: any) => string

export const useGithubFile = ({
  path,
  parse = null,
  serialize = null,
}: {
  path: string
  parse: parseFn | null
  serialize: serializeFn | null
}) => {
  const [sha, setSha] = useState('')
  useEffect(() => {
    console.log('SHA UPDATED: ', sha)
  }, [sha])

  const cms = useCMS()

  const loadData = useCallback(async () => {
    const res = await cms.api.github.getFile(path)
    setSha(res.sha)
    return parse ? parse(res.content) : res.content
  }, [sha, setSha])
  const commit = useCallback(
    async (data: any, message = 'Update from TinaCMS') => {
      const serializedContent = serialize ? serialize(data) : data
      console.log({ sha })
      cms.api.github
        .commit(path, sha, serializedContent, message)
        .then((response: { content: { sha: string } }) => {
          cms.alerts.success(
            `Saved Successfully: Changes committed to ${cms.api.github.workingRepoFullName}`
          )
          setSha(response.content.sha)
        })
        .catch((error: any) => {
          cms.events.dispatch({ type: 'github:error', error })

          return { [FORM_ERROR]: error }
        })
    },
    [sha, setSha]
  )
  return {
    loadData,
    commit,
  }
}
