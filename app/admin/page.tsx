import { redirect } from 'next/navigation'
import { ADMIN_DEFAULT_PATH } from '@/lib/admin/routes'

export default function AdminPage() {
  redirect(ADMIN_DEFAULT_PATH)
}
