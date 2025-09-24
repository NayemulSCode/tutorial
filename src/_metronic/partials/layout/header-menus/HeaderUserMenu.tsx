/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC, useContext } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { UserModel } from '../../../../app/modules/auth/models/UserModel'
import { RootState } from '../../../../setup'
import { Languages } from './Languages'
import Profile from '../../../../_metronic/assets/images/avatars/blank.png'
import { useApolloClient } from "@apollo/client";
import { AppContext } from '../../../../../src/context/Context';
import { profile } from 'console'
import {OnboardingUnlockKeys} from '../../../../app/modules/onboarding/onboardingSlice'
import clsx from 'clsx'

type Props = {
  unlockedItems: string[]
}

const HeaderUserMenu: FC<Props> = ({unlockedItems}) => {
  // const photo = localStorage.getItem('photo') || null
  const client = useApolloClient();
  const { authToken, token, user } = useContext(AppContext);
  const userName = localStorage.getItem('user');
  const imageBaseURL = `https://chuzeday.com/uploads/partner/${user?.photo}`;
  // const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  // console.log("logout", window.localStorage)
  const userLoginToken = window.localStorage.getItem('token')
  if(userLoginToken === undefined || ""){
    console.log("logout");
      // / auth / login
  }
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            {
              // !imageBaseURL.split('/').slice(-1) ?
              //   <img className="" src={imageBaseURL} alt="image" /> :
              //   <img className="" src={Profile} alt="avatar" />
              user?.photo ? <img className="" src={imageBaseURL} alt="image" /> : <img className="" src={Profile} alt="avatar" />
            }
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {/* {user.firstname} {user.lastname} */}
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <span className='fw-bold text-muted text-hover-primary fs-7'>
              {`${user?.first_name} ${user?.last_name}`}
            </span>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className={clsx('menu-item px-5', {'grey-out-override': unlockedItems.includes(OnboardingUnlockKeys.MY_PROFILE_LINK)})}>
        <Link to="/account/overview" className='menu-link px-5'>
          My Profile
        </Link>
      </div>
      <div className='separator my-2'></div>
      <div className='menu-item px-5'>
        <a href='/auth/login'
          className='menu-link px-5'
          onClick={() => { 
            localStorage.removeItem('token'); 
            client.cache.reset(); 
            authToken("") 
            }}
          >
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
