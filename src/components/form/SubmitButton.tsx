import React from 'react'
import { Button } from 'reactstrap'
import { ButtonProps } from 'reactstrap/types/lib/Button'
import { useFormikContext } from 'formik'

const SubmitButton: React.FC<Props> = (props) => {
  const { isSubmitting } = useFormikContext()
  return (
    <Button
      {...props}
      type="submit"
      disabled={props.disabled || isSubmitting}
    >
      {props.children}
    </Button>
  )
}

interface Props extends ButtonProps {
}

export default SubmitButton
