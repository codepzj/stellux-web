import { AdminAuthProvider } from '@/components/Admin/auth-provider'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>
}
