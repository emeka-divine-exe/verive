import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pt-20 pb-16" style={{ background: '#06091A' }}>
      <div className="container-page">
        <div className="grid lg:grid-cols-[240px_1fr] gap-7">
          <AdminSidebar />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
