import React from 'react'
import { useField, useFormikContext } from 'formik'
import {
  Col,
  FormFeedback,
  FormGroup,
  FormText,
  Input as BaseInput,
  Label,
  ListGroupItem,
  Row,
} from 'reactstrap'
import {
  BsFile,
  BsFiletypeJpg,
  BsFiletypePdf,
  BsFiletypePng,
  BsFiletypeXlsx,
} from 'react-icons/bs'
import IFormProperties from './IFormProperties'

const UploadFile: React.FC<IFormPropertiesFiles> = ({ label, ...props }) => {
  // @ts-ignore
  const [field, state] = useField(props)
  const { isSubmitting } = useFormikContext()
  const { error } = state
  const { setFile } = props
  delete props.setFile

  return (
    <FormGroup>
      {label && (
        <Label for={props.name}>
          {label}
        </Label>
      )}
      {/*
// @ts-ignore */}
      <BaseInput
        className="form-control-alternative"
        {...field}
        {...props}
        disabled={props.disabled || isSubmitting}
        invalid={!!error}
        type="file"
        onChange={(e) => {
          if (e.currentTarget.files) {
            if (props.multiple) {
              const files: Array<File> = []
              Array.from(e.currentTarget.files)
                .forEach((file) => { files.push(file) })
              setFile(files)
              return
            }
            setFile(e.currentTarget.files[0])
          }
        }}
      />
      {props.tooltip && (
        <FormText>
          {props.tooltip}
        </FormText>
      )}
      {error && (
        <FormFeedback>
          {error}
        </FormFeedback>
      )}
    </FormGroup>
  )
}

interface IFormPropertiesFiles extends IFormProperties {
  setFile: any,
  multiple?: string
  bsSize?: any
}

export const UploadedFile: React.FC<{ file: File }> = ({ file }) => (
  <ListGroupItem>
    <Row>
      <Col sm="10" className="text-start">
        <FileIcon mime={file.type} />
        <span className="me-3">{file.name}</span>
      </Col>
      <Col sm="2" className="text-end">
        <span
          className="justify-content-center align-self-center text-muted text-sm"
        >
          <p className="mb-0">
            {/*
// @ts-ignore */}
            <span className={`text-${file.statusColor}`}>◉</span>
          </p>
        </span>
      </Col>
    </Row>
  </ListGroupItem>
)
const FileIcon: React.FC<{ mime: string }> = ({ mime }) => {
  const defaultClass = 'font-weight-bold text me-1'
  switch (mime) {
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return (<BsFiletypeXlsx className={defaultClass} />)
    case 'application/pdf':
      return (<BsFiletypePdf className={defaultClass} />)
    case 'image/png':
      return (<BsFiletypePng className={defaultClass} />)
    case 'image/jpeg':
      return (<BsFiletypeJpg className={defaultClass} />)
    default:
      return <BsFile className={defaultClass} />
  }
}

export default UploadFile
