import React, { useState, useEffect } from 'react'
import { ProfileDetails } from './cards/ProfileDetails'
import { SignInMethod } from './cards/SignInMethod'
import { ConnectedAccounts } from './cards/ConnectedAccounts'
import { EmailPreferences } from './cards/EmailPreferences'
import { Notifications } from './cards/Notifications'
import { DeactivateAccount } from './cards/DeactivateAccount'

const Settings: React.FC<{ accInfo: any }> = ({ children, accInfo }) => {
  return (
    <>
      { <ProfileDetails accInfo={accInfo} />}
      { <SignInMethod accInfo={accInfo} />}
      {/* <ConnectedAccounts /> */}
      {/* <EmailPreferences /> */}
      {/* <Notifications /> */}
      {/* <DeactivateAccount /> */}
    </>
  )
}

export default Settings;
