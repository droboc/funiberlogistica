import { createFileRoute } from '@tanstack/react-router'
import { useAuthStore } from '@/storage/auth'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const { user } = useAuthStore()

  return (
    <div className="p-2">
      <h3>Welcome Home! {user}</h3>
    </div>
  )
}
