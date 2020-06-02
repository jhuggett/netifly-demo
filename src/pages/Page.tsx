import React, { useEffect, useState } from 'react'
import { NotFound } from './NotFound'

export const Page = (props: any) => {
  const { slug } = props.match.params
  const [content, setContent] = useState({}) as any
  const [hasError, setHasError] = useState(false)
  useEffect(() => {
    import(`../content/${slug}.json`)
      .then((content) => {
        setContent(content)
        setHasError(false)
      })
      .catch((e) => {
        console.log(e)
        setHasError(true)
      })
  }, [slug])

  if (hasError) {
    return <NotFound />
  }

  return (
    <>
      <h1>{content.title}</h1>
      <div>{content.content}</div>
    </>
  )
}
