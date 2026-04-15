import { AppProviders } from '@app/providers'
import { AppRouter } from '@app/routes/router'
import { AppErrorBoundary } from '@app/providers/router/error-boundary'

function App() {
  return (
    <AppErrorBoundary>
      <AppProviders>
        <AppRouter />
      </AppProviders>
    </AppErrorBoundary>
  )
}

export default App
