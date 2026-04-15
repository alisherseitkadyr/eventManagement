import { useParams } from 'react-router-dom'
import { PublicInvitationShell } from '@widgets/public-invitation'

export function PublicInvitationPage() {
  const { token } = useParams()
  const resolvedToken = token ?? ''

  return <PublicInvitationShell token={resolvedToken} />
}
