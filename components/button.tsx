export function Button({ asChild, children, className, ...props }) {
  if (asChild) {
    return children
  }

  return (
    <button className={className} {...props}>
      {children}
    </button>
  )
}
