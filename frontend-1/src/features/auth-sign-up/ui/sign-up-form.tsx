import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '@app/providers/auth/use-auth'
import { routePaths } from '@app/routes/route-paths'
import { Button, Card, FormField, Input } from '@shared/ui'

type SignUpFormValues = {
  name: string
  email: string
  password: string
}

export function SignUpForm() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { handleSubmit, register } = useForm<SignUpFormValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmitting(true)
    await signUp(values)
    navigate(routePaths.dashboard, { replace: true })
  })

  return (
    <Card className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-[var(--color-text)]">{t('auth.signUpTitle')}</h2>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Start with a minimal account shell and connect real onboarding later.
        </p>
      </div>
      <form className="space-y-4" onSubmit={onSubmit}>
        <FormField label={t('auth.name')}>
          <Input placeholder="Aruzhan" {...register('name')} />
        </FormField>
        <FormField label={t('auth.email')}>
          <Input placeholder="you@example.com" type="email" {...register('email')} />
        </FormField>
        <FormField label={t('auth.password')}>
          <Input placeholder="••••••••" type="password" {...register('password')} />
        </FormField>
        <Button className="w-full" disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Creating account...' : t('auth.submitSignUp')}
        </Button>
      </form>
    </Card>
  )
}
