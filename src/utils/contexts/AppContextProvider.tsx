import React, { useMemo } from 'react'
import { IProfile } from '@src/model/IProfile'
import { ProfileManager } from '../ProfileManager'
import Api from '../Api'

export const AppContext = React.createContext({})

const AppContextProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [showProfiles, setShowProfiles] = React.useState<null | 'new' | 'list' | number>(
    null,
  )
  const [profiles, setProfiles] = React.useState<IProfile[]>(
    JSON.parse(localStorage.getItem(ProfileManager.localStorageKey) ?? '[]')
    ?? [],
  )
  const profileManager = new ProfileManager(profiles, setProfiles)
  const api = new Api(profileManager)
  // React.useEffect(() => {
  //
  // }, [])

  return (
    <AppContext.Provider
      value={useMemo(() => ({
        showProfiles,
        setShowProfiles,
        profileManager,
        api,
      }), [showProfiles, profileManager])}
    >
      {children}
    </AppContext.Provider>
  )
}

export type AppContextProviderType = {
  showProfiles: null | 'new' | 'list' | number
  setShowProfiles: (showProfiles: null | 'new' | 'list' | number) => void
  profileManager: ProfileManager
  api: Api
}
;export default AppContextProvider
