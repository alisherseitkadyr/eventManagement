import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@app/layouts/public-layout'
import { DashboardLayout } from '@app/layouts/dashboard-layout'
import { ProtectedRoute } from '@app/providers/auth/protected-route'
import { routePaths } from '@app/routes/route-paths'
import { LandingPage } from '@pages/landing'
import { SignInPage, SignUpPage } from '@pages/auth'
import { DashboardPage } from '@pages/dashboard'
import { CreateEventPage } from '@pages/event-create'
import { EventConstructorPage } from '@pages/event-constructor'
import { EventDetailsPage, EventEditPage } from '@pages/event-edit'
import { EventGuestsPage } from '@pages/event-guests'
import { EventStagesPage } from '@pages/event-stages'
import { EventPreviewPage } from '@pages/event-preview'
import { EventSendingPage } from '@pages/event-sending'
import { PublicInvitationPage } from '@pages/invitation-public'
import { NotFoundPage } from '@pages/not-found'

export const appRouter = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: routePaths.landing,
        element: <LandingPage />,
      },
      {
        path: routePaths.signIn,
        element: <SignInPage />,
      },
      {
        path: routePaths.signUp,
        element: <SignUpPage />,
      },
      {
        path: routePaths.invitationPublic,
        element: <PublicInvitationPage />,
      },
      {
        path: routePaths.notFound,
        element: <NotFoundPage />,
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routePaths.eventCreate,
        element: <CreateEventPage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: routePaths.dashboard,
            element: <DashboardPage />,
          },
          {
            path: routePaths.eventDetails,
            element: <EventDetailsPage />,
          },
          {
            path: routePaths.eventEdit,
            element: <EventEditPage />,
          },
          {
            path: routePaths.eventConstructor,
            element: <EventConstructorPage />,
          },
          {
            path: routePaths.eventGuests,
            element: <EventGuestsPage />,
          },
          {
            path: routePaths.eventStages,
            element: <EventStagesPage />,
          },
          {
            path: routePaths.eventPreview,
            element: <EventPreviewPage />,
          },
          {
            path: routePaths.eventSending,
            element: <EventSendingPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={routePaths.notFound} />,
  },
])
