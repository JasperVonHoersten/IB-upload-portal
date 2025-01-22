import React from 'react'
import { FormikHelpers } from 'formik'

type StatusProps = {
  status: {
    type: string,
    message: string
  }
};

const Status: React.FC<StatusProps> = (props) => (
  <>
    {console.info(props.status)}
    {/* {props.status && ( */}
    {/*  <Alert color={convertStatusTypeToBootstrapColor(props.status.type)}> */}
    {/*    {convertStatusTypeToBootstrapColor(props.status.type) === 'warning' && ( */}
    {/*    <Spinner color={`${convertStatusTypeToBootstrapColor(props.status.type)}`} size="sm"> */}
    {/*      Loading... */}
    {/*    </Spinner> */}
    {/*    )} */}
    {/*    &nbsp; */}
    {/*    {props.status.message} */}
    {/*  </Alert> */}
    {/* )} */}
  </>
)

// const convertStatusTypeToBootstrapColor = (input: string): string => {
//   switch (input) {
//     case 'error':
//       return 'danger'
//     case 'warning':
//       return 'warning'
//     default:
//       return 'info'
//   }
// }

export default Status

type Response = {
  isError: boolean,
  data: any
};

export const errorCallback = (response: Response, context: FormikHelpers<any>) => {
  if (typeof response.data.violations !== 'undefined') {
    context.setStatus(null)
    Object.keys(response.data.violations).forEach((fieldName) => {
      const errorMessages = response.data.violations[fieldName].join('\n')
      context.setFieldError(fieldName, errorMessages)
    })
  } else {
    context.setStatus({ type: 'danger', message: 'Unknown error' })
  }
  context.setSubmitting(false)
}
