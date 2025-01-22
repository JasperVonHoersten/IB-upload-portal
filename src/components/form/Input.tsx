import React from 'react'
import { useField, useFormikContext } from 'formik'
import {
  FormFeedback,
  FormGroup,
  FormText,
  Input as BaseInput,
  Label,
} from 'reactstrap'
import IFormProperties from './IFormProperties'

const Input: React.FC<IFormProperties> = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { isSubmitting } = useFormikContext()
  const { error } = meta

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
        className=""
        {...field}
        {...props}
        disabled={props.disabled || isSubmitting}
        invalid={!!error}
      />
      {props.tooltip && (
        <FormText>
          {props.tooltip}
        </FormText>
      )}
      {error && (
        <FormFeedback invalid="invalid">
          {error}
        </FormFeedback>
      )}
    </FormGroup>
  )
}

export default Input
