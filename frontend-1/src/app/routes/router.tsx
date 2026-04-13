import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@app/routes/routes'

export function AppRouter() {
  return <RouterProvider router={appRouter} />
}
