import {
  Button, CardBody, CardHeader, Col, Row,
} from 'reactstrap'
import { FaArrowLeft, FaSave } from 'react-icons/fa'

import React from 'react'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { IProfile, newProfile } from '@src/model/IProfile'
import Input from '@src/components/form/Input'
import {
  AppContext,
  AppContextProviderType,
} from '@src/utils/contexts/AppContextProvider'

export const Upsert = () => {
  const { profileManager, showProfiles, setShowProfiles } = React.useContext(
    AppContext,
  ) as AppContextProviderType

  const onFormSubmit = async (values: IProfile) => {
    if (values.id) {
      profileManager.updateProfile(values)
    } else {
      profileManager.addProfile(values)
    }
    setShowProfiles('list')
  }
  return (
    <Formik
      initialValues={typeof showProfiles === 'number'
        ? profileManager.getProfile(showProfiles)
        : newProfile}
      validationSchema={Yup.object().shape({
        name: Yup.string().required(),
      })}
      enableReinitialize
      onSubmit={onFormSubmit}
    >
      {() => (
        <Form>
          <CardHeader className="bg-white border-0">
            <div className="d-flex align-items-center">
              <h5 className="mb-0">Add profile</h5>
              <Button
                color="info"
                outline
                onClick={() => { setShowProfiles('list') }}
                className="ms-auto mb-0 me-2"
              >
                <FaArrowLeft className="mb-1" />
              </Button>
              <Button
                color="success"
                type="submit"
              >
                <FaSave className="mb-1" />
                {' '}
                Save
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Row>
              <Input name="name" label="Profile Name" />
            </Row>
            <Row>
              <hr />
              <h6 className="text-muted">Background:</h6>
            </Row>
            <Row>
              <Col sm="12" md="9">
                <Input
                  type="text"
                  name="background.image"
                  label="Image"
                />
              </Col>
              <Col sm="12" md="3">
                <Input
                  type="color"
                  name="background.color"
                  label="Color"
                />
              </Col>
            </Row>
            <Row>
              <hr />
              <h5>Card:</h5>
            </Row>
            <Row>
              <Col sm="12" md="9">
                <Input type="text" name="uploadCard.title" label="Card Title" />
              </Col>
              <Col sm="12" md="3">
                <Input
                  type="color"
                  name="uploadCard.titleColor"
                  label="Card Title Color"
                />
              </Col>
            </Row>
            <Input
              type="text"
              name="uploadCard.logoUrl"
              label="Card Customer logo URL"
            />

            <Row>

              <Col sm="12" md="6">
                <Input
                  type="color"
                  name="uploadCard.backgroundColor"
                  label="Card Background Color"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="color"
                  name="uploadCard.submitButtonColor"
                  label="Submit Color"
                />
              </Col>
            </Row>

            <Row>
              <hr />
              <h6 className="text-muted">AiHub:</h6>
            </Row>

            <Row>
              <Col sm="12" md="12">
                <Input
                  type="text"
                  name="aihub.apiRoot"
                  label="API URL"
                  placeholder="https://aihub.instabase.com/api"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.apiKey"
                  label="Key"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.userId"
                  label="User Id"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.organizationId"
                  label="Organization Id"
                  placeholder="(Only for AIHub Commercial)"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.context"
                  label="Context"
                  placeholder="USER_ID or ORGANIZATION_ID (Only for AIHub Commercial)"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.workspace"
                  label="Workspace"
                  placeholder="My Workspace"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.driveName"
                  label="Drive Name"
                  placeholder="Instabase Drive"
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.appId"
                  label="App ID"
                  placeholder=""
                  tooltip="You can provide either an app id or app name. If both are provided, id will have priority."
                />
              </Col>
              <Col sm="12" md="6">
                <Input
                  type="text"
                  name="aihub.appName"
                  label="App Name"
                  placeholder=""
                  tooltip="You can provide either an app id or app name. If both are provided, id will have priority."
                />
              </Col>
            </Row>
          </CardBody>
        </Form>
      )}
    </Formik>
  )
}
