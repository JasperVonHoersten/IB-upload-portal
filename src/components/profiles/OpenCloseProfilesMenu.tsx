import { Button } from 'reactstrap'
import React from 'react'
import instabaseIcon from '@src/assets/logo.svg'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'

export const OpenCloseProfilesMenu = () => {
  const { showProfiles, setShowProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType
  return (
    <div className="fixed-bottom w-25">
      <Button
        onClick={() => { setShowProfiles(showProfiles ? null : 'list') }}
        className="bg-transparent border-0"
      >
        <img
          className="navbar-brand-img"
          src={instabaseIcon}
          alt="Button to edit profiles"
        />
      </Button>
    </div>
  )
}
