import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import Overview from './components/Overview'
import Settings from './components/settings/Settings'
import { AccountHeader } from './AccountHeader'
import { IAccountInfo } from '../../../types';
import { PROFILE_INFORMATION } from '../../../gql/Query';

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: 'Account',
    path: '/account/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const AccountPage: React.FC = () => {
  document.title = "Profile";
  const [accInfo, setAccInfo] = useState<IAccountInfo>()
  const [aloading, setaLoading] = useState<boolean>(false)

  const { data: accountData, error: accountError, loading: accInfoLoading, refetch } = useQuery(PROFILE_INFORMATION);

  useEffect(() => {
    if (accountData) {
      // refetch()
      console.log("🚀 ~ useEffect ~ accountData.profileInformation:", accountData.profileInformation)
      setAccInfo(accountData.profileInformation)
      setaLoading(false)
    }
    if (accInfoLoading) {
      setaLoading(true)
    }
  }, [accountData, accInfoLoading])
  // console.log(accInfo)
  return (
    <>
      {aloading &&
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-grow " role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow " role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <div className="spinner-grow " role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      }
      {!aloading && <>
        <AccountHeader accInfo={accInfo} />

        <Switch>
          <Route path='/account/overview'>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Overview</PageTitle>
            <Overview accInfo={accInfo} />
          </Route>

          <Route path='/account/settings'>
            <PageTitle breadcrumbs={accountBreadCrumbs}>Settings</PageTitle>
            <Settings accInfo={accInfo} />
          </Route>

          <Redirect from='/account' exact={true} to='/account/overview' />
          <Redirect to='/account/overview' />
        </Switch>
      </>
      }
    </>
  )
}

export default AccountPage
