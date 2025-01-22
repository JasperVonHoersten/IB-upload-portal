import {
  Button,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import {
  FaCheck, FaHandPointer, FaPlus, FaTrash,
} from 'react-icons/fa'

import React from 'react'
import { FaPencil } from 'react-icons/fa6'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'
import { IProfile } from '@src/model/IProfile'

export const List = () => {
  const { profileManager, setShowProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType
  return (
    <>
      <CardHeader className="bg-white border-0">
        <div className="d-flex align-items-center">
          <h6 className="mb-0">Profiles</h6>
          <Button
            color="primary"
            onClick={() => { setShowProfiles('new') }}
            className="ms-auto mb-0 me-2"
          >
            <FaPlus className="mb-1" />
            {' '}
            Add
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <ListGroup>
          {profileManager.getProfiles()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((profile) => <ListItem profile={profile} key={profile.id} />)}
        </ListGroup>
      </CardBody>
    </>
  )
}

const ListItem: React.FC<{ profile: IProfile }> = ({ profile }) => {
  const { profileManager, setShowProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType
  return (
    <ListGroupItem>
      <div className="d-flex align-items-center">
        {profile.name}
        <div className="ms-auto" />
        {!profile.default
          ? (
            <Button
              color="primary"
              size="sm"
              className="ms-2"
              onClick={() => { profileManager.setDefault(profile.id ?? 0) }}
            >
              <FaHandPointer />
              {' '}
              Use
            </Button>
          )
          : (
            <Button
              color="success"
              size="sm"
              className="ms-2"
              disabled
            >
              <FaCheck />
              {' '}
              Selected
            </Button>
          )}
        <Button
          outline
          color="primary"
          size="sm"
          className="ms-2"
          onClick={() => { setShowProfiles(profile.id ?? 'list') }}
        >
          <FaPencil />
        </Button>
        <Button
          outline
          color="danger"
          size="sm"
          className="ms-2"
          onClick={() => { profileManager.removeProfile(profile.id ?? 0) }}
        >
          <FaTrash />
        </Button>
      </div>
    </ListGroupItem>
  )
}
