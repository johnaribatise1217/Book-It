import NewPassword from '@/app/components/user/NewPassword'
import React from 'react'

export const metadata = {
  title : "Reset Password"
}

interface Props {
  params : {token : string}
}

const ResetPasswordPage = ({params} : Props) => {
  return (
    <NewPassword token={params?.token}/>
  )
}

export default ResetPasswordPage