import React, { useState, useEffect } from 'react'
import { useEditMode } from './EditMode'
import { useCMS } from 'tinacms'

export const HeaderImage = ({ image }: { image: string }) => {
  const [editMode] = useEditMode()
  const cms = useCMS()
  const [imageSrc, setImageSrc] = useState('')
  useEffect(() => {
    if (!editMode) {
      import(`../content/img/${image}`).then((src) => {
        setImageSrc(src.default)
      })
    } else {
      cms.api.github.getMediaUri(`src/content/img/${image}`).then(setImageSrc)
    }
  }, [image])
  if (!imageSrc) {
    return <div className="spinner"></div>
  }
  return <img src={imageSrc} />
}
