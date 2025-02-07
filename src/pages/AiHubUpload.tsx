import {
  Button,
  Col,
  ListGroup,
  ListGroupItem,
  Row,
  Spinner,
} from 'reactstrap'
import React from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import {
  FaBrain, FaCheck, FaEye, FaPaperPlane,
} from 'react-icons/fa'
import { FaGears, FaPersonCircleCheck, FaUpload } from 'react-icons/fa6'
import { MdCategory } from 'react-icons/md'
import UploadFile, { UploadedFile } from '@src/components/form/UploadFile'
import SubmitButton from '@src/components/form/SubmitButton'
import Status, { errorCallback } from '@src/components/form/Status'
import {
  AppContext,
  AppContextProviderType,
} from '../utils/contexts/AppContextProvider'

export const AiHubUpload = () => {
  const { profileManager, api } = React.useContext(
    AppContext,
  ) as AppContextProviderType
  const [files, setFiles] = React.useState<File[]>()
  const [isSubmitted, setIsSubmitted] = React.useState<boolean>(false)
  const [humanReviewLink, setHumanReviewLink] = React.useState<string>('')
  // @ts-ignore
  // eslint-disable-next-line consistent-return
  const onFormSubmit = async (values: any, context: FormikHelpers<any>) => {
    setIsSubmitted(true)
    const folderName = Math.floor(Date.now() / 1000).toString()
    console.info(`Submission folder name: ${folderName}`)
    context.setStatus(
      { type: 'warning', message: 'Uploading files...' },
    )

    // Create a batch first
    const batchResponse = await api.createBatch('Your Batch Name')
    const batchId = batchResponse.data.id

    for (const file of files || []) {
      // @ts-ignore
      file.statusColor = 'warning'
      setFiles([...files || []])
    }

    for (const file of files || []) {
      const fileResult = await api.upload_file(file, batchId)
      if (fileResult.isError) {
        // @ts-ignore
        file.statusColor = 'danger'
        setFiles([...files || []])
        console.error(fileResult)
        continue
      }
      // @ts-ignore
      file.statusColor = 'success'
      setFiles([...files || []])
    }

    context.setStatus(
      { type: 'warning', message: 'Reading files!' },
    )
    await new Promise((resolve) => setTimeout(resolve, 5000))
    const res = await api.appRun(folderName)
    if (res.isError) {
      return errorCallback(res, context)
    }
    const jobId = res.data.job_id
    console.info(`Job ID: ${jobId}`)

    context.setStatus(
      { type: 'warning', message: 'Awaiting for you result!' },
    )
    const interval = setInterval(async () => {
      const result = await api.get('app_get_job_status', jobId)
      if (result.isError) {
        clearInterval(interval)
        console.error(result)
      }
      if (result?.data?.state === 'DONE') {
        clearInterval(interval)
        context.setStatus(
          { type: 'success', message: 'Done' },
        )
        const url = new URL(profileManager.getApiRoot())
        window.open(
          `${url.protocol}//${url.hostname}/hub/review/${jobId}`,
          '_blank',
        )
        setHumanReviewLink(
          `${url.protocol}//${url.hostname}/hub/review/${jobId}`,
        )
      }
    }, 5000) // Interval set to 5 seconds (5000 milliseconds)
  }

  return (

    <Formik
      initialValues={{ files: [] }}
      enableReinitialize
      onSubmit={onFormSubmit}
    >
      {(context) => (
        <Form>
          <Row>
            {!isSubmitted && (
              <Col lg="12">
                <UploadFile
                  name="file"
                  bsSize="lg"
                  multiple="multiple"
                  setFile={setFiles}
                />
              </Col>
            )}
            <Col lg="12">
              {files && files?.length > 0 && (
                <ListGroup className="bg-transparent mb-3">
                  {isSubmitted && (
                    <ListGroupItem
                      key="title"
                    >
                      <Row>
                        <Col sm="2" className="text-start"><FaUpload /></Col>
                        <Col
                          sm="8"
                          className={(files && (files.filter(
                            // @ts-ignore
                            (file) => file.statusColor
                              === 'success',
                          )).length !== files.length)
                            ? 'fw-bold'
                            : ''}
                        >
                          Uploading
                        </Col>
                        <Col sm="2" className="text-end">

                          {(files && (files.filter(
                            // @ts-ignore
                            (file) => file.statusColor
                                === 'success',
                          )).length !== files.length)
                            && <Spinner size="sm" color="warning" />}

                          {(files && (files.filter(
                            // @ts-ignore
                            (file) => file.statusColor
                                === 'success',
                          )).length === files.length)
                            && <FaCheck className="text-success" />}
                        </Col>
                      </Row>
                    </ListGroupItem>
                  )}
                  {files?.map((file) => (
                    <UploadedFile
                      file={file}
                      key={file.name + file.type + file.size
                        + file.lastModified}
                    />
                  ))}
                </ListGroup>
              )}
            </Col>

            {(files && (files.filter(
              // @ts-ignore
              (file) => file.statusColor === 'success',
            )).length
              === files.length) && (
              <Col lg="12">
                <UploadAnimation />
              </Col>
            )}
            <Col lg="12">
              <Status status={context.status} />
            </Col>
            {!isSubmitted && (
              <Col lg="12">
                <SubmitButton
                  className="w-100"
                  size="lg"
                  color="primary"
                  style={{
                    backgroundColor: profileManager.getDefault().uploadCard.submitButtonColor,
                    borderColor: profileManager.getDefault().uploadCard.submitButtonColor,
                  }}
                >
                  Send
                  {' '}
                  <FaPaperPlane />
                </SubmitButton>
              </Col>
            )}
            {humanReviewLink && (
              <Col lg="12">
                <Button
                  className="w-100"
                  size="lg"
                  color="primary"
                  href={humanReviewLink}
                  tag="a"
                  target="_blank"
                  style={{
                    backgroundColor: profileManager.getDefault().uploadCard.submitButtonColor,
                    borderColor: profileManager.getDefault().uploadCard.submitButtonColor,
                  }}
                >
                  Open human review
                  {' '}
                  <FaPersonCircleCheck />
                </Button>
              </Col>
            )}
          </Row>
        </Form>
      )}
    </Formik>
  )
}

const UploadAnimation = () => {
  const [steps, setSteps] = React.useState <Array<{
    name: string,
    icon: any,
    status: 'not-started' | 'in-progress' | 'done'
  }>>([
    // { name: 'Uploading', icon: <FaUpload />, status: 'in-progress' },
    { name: 'Read', icon: <FaEye />, status: 'in-progress' },
    { name: 'Interpreting - Classify', icon: <MdCategory />, status: 'not-started' },
    { name: 'Interpreting - Extracting', icon: <FaBrain />, status: 'not-started' },
    { name: 'Standardizing', icon: <FaGears />, status: 'not-started' },
    { name: 'Validating', icon: <FaCheck />, status: 'not-started' },
  ])

  const timeBetweenSteps = 5000

  function executeSteps() {
    let index = 1

    const intervalId = setInterval(() => {
      if (steps[index]) steps[index].status = 'in-progress'
      if (steps[index - 1]) steps[index - 1].status = 'done'
      setSteps([...steps])
      index++
      if (index === steps.length + 1) {
        clearInterval(intervalId)
      }
    }, timeBetweenSteps)
  }

  React.useEffect(() => {
    executeSteps()
  }, [])

  return (
    <ListGroup className="mb-3">
      {steps.map((step) => (
        <ListGroupItem
          key={step.name}
          disabled={step.status === 'not-started'}
        >
          <Row>
            <Col sm="2" className="text-start">{step.icon}</Col>
            <Col
              sm="8"
              className={step.status === 'in-progress'
                ? 'fw-bold'
                : ''}
            >
              {step.name}
            </Col>
            <Col sm="2" className="text-end">
              {step.status === 'in-progress'
                && <Spinner size="sm" color="warning" />}
              {step.status === 'done' && <FaCheck className="text-success" />}
            </Col>
          </Row>
        </ListGroupItem>
      ))}
    </ListGroup>
  )
}

export default AiHubUpload
