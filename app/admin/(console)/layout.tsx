import { AdminShell } from '@/components/Admin/admin-shell'

export default function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>
}
