import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

const OptimizedImage = ({ src, alt, width, height, className = '' }: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoad = () => setIsLoading(false)

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
    </div>
  )
}

export default OptimizedImage
