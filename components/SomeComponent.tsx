import OptimizedImage from './OptimizedImage'

const SomeComponent = () => {
  return (
    <OptimizedImage
      src="/avatars/01.png"
      alt="User Avatar"
      width={64}
      height={64}
      className="rounded-full"
    />
  )
}

export default SomeComponent
