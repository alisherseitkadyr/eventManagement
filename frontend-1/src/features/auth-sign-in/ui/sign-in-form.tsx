import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@app/providers/auth/use-auth'
import { routePaths } from '@app/routes/route-paths'
import { Button, Card, FormField, Input } from '@shared/ui'

type SignInFormValues = {
  email: string
  password: string
}

export function SignInForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { handleSubmit, register } = useForm<SignInFormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true)
    await signIn(values)
    navigate(redirectTo ?? routePaths.dashboard, { replace: true })
  })

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">{t('auth.signInTitle')}</h2>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Use any email and password to enter the protected workspace shell.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField label={t('auth.email')}>
          <Input placeholder="you@example.com" type="email" {...register('email')} />
        </FormField>
        <FormField label={t('auth.password')}>
          <Input placeholder="••••••••" type="password" {...register('password')} />
        </FormField>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Signing in...' : t('auth.submitSignIn')}
        </Button>
      </form>
    </Card>
  )
}
