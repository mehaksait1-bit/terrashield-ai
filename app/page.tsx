import { Dashboard } from '@/components/dashboard'
import { DemoProvider } from '@/lib/demo-context'

export default function Page() {
  return (
    <DemoProvider>
      <Dashboard />
    </DemoProvider>
  )
}
