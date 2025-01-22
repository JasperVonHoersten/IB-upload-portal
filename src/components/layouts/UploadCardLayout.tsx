import {
  Card, CardBody, CardHeader, Col, Container, Row,
} from 'reactstrap'
import React from 'react'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'
import { ProfilesMenu } from '@src/components/profiles/ProfilesMenu'
import BaseLayout from '@src/components/layouts/BaseLayout'

const UploadCardLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const { profileManager, showProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType

  return (
    <BaseLayout>
      <Container fluid className="mt-5">
        <Row>
          <Col sm={1} md={showProfiles ? 6 : 3} className="mb-3">
            <ProfilesMenu />
          </Col>
          <Col sm={10} md={6}>
            <Card
              className="border-0"
              style={{ backgroundColor: profileManager.getDefault().uploadCard.backgroundColor }}
            >
              <CardHeader
                className="w-100 text-center"
                style={{ backgroundColor: profileManager.getDefault().uploadCard.backgroundColor }}
              >
                <h1
                  style={{ color: profileManager.getDefault().uploadCard.titleColor }}
                >
                  {profileManager.getDefault().uploadCard.title}
                </h1>
              </CardHeader>
              <CardBody className="text-center">
                <img
                  src={profileManager.getDefault().uploadCard.logoUrl}
                  alt="Customer Logo"
                  className="card-logo mt-4 mb-5"
                />
                {children}
              </CardBody>
            </Card>
          </Col>
          {!showProfiles && <Col sm={1} md={3} />}
        </Row>
      </Container>
    </BaseLayout>
  )
}

export default UploadCardLayout
