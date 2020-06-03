import React, { useState, useEffect } from 'react'

export const HeaderImage = ({ image }: { image: string }) => {
  const [imageSrc, setImageSrc] = useState({} as any)
  useEffect(() => {
    import(`../content/img/${image}`).then((src) => {
      setImageSrc(src.default)
    })
  }, [image])
  useEffect(() => {
    console.log({ imageSrc })
  }, [imageSrc])
  return <img src={imageSrc} />
}
