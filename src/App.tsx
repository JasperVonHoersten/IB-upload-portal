import React from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'

const UploadCardLayout = React.lazy(
  () => import('@src/components/layouts/UploadCardLayout'),
)

const App = () => {
  const { profileManager } = React.useContext(
    AppContext,
  ) as AppContextProviderType

  return (
    <>
      <style>
        {`
        body {
          background-color: ${profileManager.getDefault().background.color};
          background-image: url("${profileManager.getDefault().background.image}");
        }

      `}
      </style>

      <MemoryRouter>
        <React.Suspense fallback={<div />}>
          <Routes>
            {routes.map((route) => (
              route.element && (
                <Route
                  key={route.path + route.name}
                  path={route.path}
                  element={(
                    <route.layout>
                      <route.element />
                    </route.layout>
                  )}
                />
              )
            ))}
          </Routes>
        </React.Suspense>
      </MemoryRouter>
    </>
  )
}

export interface IRoute {
  path: string;
  exact: boolean;
  name: string;
  element: React.LazyExoticComponent<React.ComponentType<any>>;
  layout: React.LazyExoticComponent<React.ComponentType<any>>;
}

const routes: IRoute[] = [
  {
    path: '*',
    name: 'Upload',
    exact: true,
    element: React.lazy(() => import('@src/pages/AiHubUpload')),
    layout: UploadCardLayout,
  },
]

export default App
