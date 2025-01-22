import { Card, Collapse } from 'reactstrap'

import React from 'react'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'
import { Upsert } from '@src/components/profiles/Upsert'
import { List } from '@src/components/profiles/List'

export const ProfilesMenu = () => {
  const { showProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType
  return (
    <Collapse isOpen={!!showProfiles}>
      <Card className="border-0 h-100">
        {showProfiles === 'list' && <List />}
        {showProfiles && showProfiles !== 'list' && <Upsert />}
      </Card>
    </Collapse>
  )
}
