import React, {FC} from 'react'

const AwaitApproval: FC = () => {
  document.title = 'AWAITING APPROVAL';
  return (
    <>
      <div className='text-center fs-3'>
        Thank You for entering your Business Information.
        <br />
        We are delighted to have you as part of the Chuzeday Business Marketplace.
        <br />
        Your Account is being prepared by our Team.
        <br />
        Once they have completed their work, You’ll have access to Your Business Panel.
        <br />
        This is a fast process, You’ll hear from us very soon.
        <br />
        Please check your E-Mail for updates.
      </div>
    </>
  )
}

export default AwaitApproval
