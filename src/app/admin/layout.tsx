import type { ReactNode } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#06091A' }}>
      <AdminSidebar>
        {children}
      </AdminSidebar>
    </div>
  )
}
