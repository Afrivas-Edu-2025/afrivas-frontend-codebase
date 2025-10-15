// app/loading.tsx
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-50">
      <div className="h-full bg-lemon-100 animate-loading-bar"></div>
    </div>
  )
}
