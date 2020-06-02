import { useCMS } from 'tinacms'
import { FORM_ERROR } from 'final-form'

type parseFn = (content: string) => any
type serializeFn = (data: any) => string

const shaIndex: Map<string, string> = new Map()

const getSha = (path: string) => {
  return shaIndex.get(path)
}

const setSha = (path: string, sha: string) => {
  shaIndex.set(path, sha)
}

export const useGithubFile = ({
  path,
  parse = null,
  serialize = null,
}: {
  path: string
  parse: parseFn | null
  serialize: serializeFn | null
}) => {
  const cms = useCMS()

  return {
    loadData: async () => {
      try {
        const res = await cms.api.github.getFile(path)
        setSha(path, res.sha)
        return parse ? parse(res.content) : res.content
      } catch (e) {
        // TODO handle this better. maybe error boundary?
        return {}
      }
    },
    commit: async (data: any, message = 'Update from TinaCMS') => {
      const serializedContent = serialize ? serialize(data) : data
      cms.api.github
        .commit(path, getSha(path), serializedContent, message)
        .then((response: { content: { sha: string } }) => {
          cms.alerts.success(
            `Saved Successfully: Changes committed to ${cms.api.github.workingRepoFullName}`
          )
          setSha(path, response.content.sha)
        })
        .catch((error: any) => {
          cms.events.dispatch({ type: 'github:error', error })

          return { [FORM_ERROR]: error }
        })
    },
  }
}
