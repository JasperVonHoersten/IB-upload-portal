import React from 'react'
import {
  OpenCloseProfilesMenu,
} from '@src/components/profiles/OpenCloseProfilesMenu'

const BaseLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => (
  <>
    <main>
      {children}
    </main>
    <OpenCloseProfilesMenu />
  </>
)

export default BaseLayout
