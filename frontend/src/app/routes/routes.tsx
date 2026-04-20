import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@app/layouts/public-layout'
import { DashboardLayout } from '@app/layouts/dashboard-layout'
import { ProtectedRoute } from '@app/providers/auth/protected-route'
import { routePaths } from '@app/routes/route-paths'
import { LandingPage } from '@pages/landing'
import { SignInPage, SignUpPage } from '@pages/auth'
import { CreateEventPage } from '@pages/event-create'
import { EventConstructorPage } from '@pages/event-constructor'
import { EventDetailsPage } from '@/pages/event-details'
import { EventGuestsPage } from '@pages/event-guests'
import { NotFoundPage } from '@pages/not-found'
import { TemplatesPage } from '@/pages/templates'
import { TemplatePreviewPage } from '@/pages/templateView'
import { MyEventsPage } from '@/pages/my-events'

export const appRouter = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: routePaths.landing,  element: <LandingPage /> },
      { path: routePaths.signIn,   element: <SignInPage /> },
      { path: routePaths.signUp,   element: <SignUpPage /> },
      { path: routePaths.notFound, element: <NotFoundPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: routePaths.dashboard,     element: <Navigate replace to={routePaths.myEvents} /> },
          { path: routePaths.templates,     element: <TemplatesPage /> },
          { path: routePaths.myEvents,      element: <MyEventsPage /> },
          { path: routePaths.eventCreate,   element: <CreateEventPage /> },
          { path: routePaths.eventDetails,  element: <EventDetailsPage /> },
          { path: routePaths.eventGuests,   element: <EventGuestsPage /> },
        ],
      },
      // Constructor has its own shell with built-in rail sidebar
      { path: routePaths.eventConstructor,  element: <EventConstructorPage /> },
      // Template preview is a standalone full-screen page
      { path: routePaths.templatePreview,   element: <TemplatePreviewPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={routePaths.notFound} />,
  },
])
