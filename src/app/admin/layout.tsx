import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container-page py-16 min-h-screen">
      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <AdminSidebar />
        <main>{children}</main>
      </div>
    </div>
  )
}
