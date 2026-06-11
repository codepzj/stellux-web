import { AdminAuthProvider } from '@/features/admin/components/auth-provider'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
