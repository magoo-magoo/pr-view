import { FC } from 'react'
import ProgressiveImage from 'react-progressive-image'

import './LazyAvatar.css'

type Props = {
    url: string | undefined
    size: number
    alt: string
}
export const LazyAvatar: FC<Props> = ({ url, size, alt }) => {
    return (
        <>
            <ProgressiveImage src={`${url}&s=128`} placeholder={`${url}&s=8`}>
                {(src: string, loading: boolean) => (
                    <img
                        className={`w-${size} h-${size} rounded-full mr-4 ${
                            loading ? 'opacity-50' : ''
                        }`}
                        src={src}
                        alt={alt}
                    />
                )}
            </ProgressiveImage>
        </>
    )
}
