/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../helpers'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import {OnboardingUnlockKeys} from '../../../../app/modules/onboarding/onboardingSlice'

type Props = {
  unlockedItems: string[]
}

export function AsideMenuMain({unlockedItems}: Props) {
  const intl = useIntl()

  return (
    <>

      <AsideMenuItem
        to='/home'
        unlockedItems={unlockedItems}
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({ id: 'Home' })}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/calendar'
        icon='/media/icons/duotune/art/art001.svg'
        title={intl.formatMessage({ id: 'Calendar' })}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/sales/daily-sales'
        icon='/media/icons/duotune/art/art003.svg'
        title={intl.formatMessage({ id: 'Sales' })}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/vouchers'
        icon='/media/icons/duotune/art/art004.svg'
        title={intl.formatMessage({ id: 'Vouchers' })}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/guests'
        icon='/media/icons/duotune/art/art005.svg'
        title={intl.formatMessage({ id: 'Guests' })}
        fontIcon='bi-app-indicator'
      />

      {/* <AsideMenuItem
        to='/chairs'
        icon='/media/icons/duotune/art/art0011.svg'
        title={intl.formatMessage({ id: 'Chair' })}
        fontIcon='bi-app-indicator'
      /> */}

      {/* <AsideMenuItem
        to='/staff/employees'
        icon='/media/icons/duotune/art/art006.svg'
        title={intl.formatMessage({ id: 'Staff' })}
        fontIcon='bi-app-indicator'
      /> */}

      <AsideMenuItem
        to='/services/list'
        icon='/media/icons/duotune/art/art007.svg'
        title={intl.formatMessage({ id: 'Services' })}
        fontIcon='bi-app-indicator'
        unlockKey={OnboardingUnlockKeys.SERVICES_MENU}
        unlockedItems={unlockedItems}
      />
      <AsideMenuItem
        to='/inventory/products'
        unlockedItems={unlockedItems}
        icon='/media/icons/duotune/art/art008.svg'
        title={intl.formatMessage({ id: 'Inventory' })}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/analytics/dashboard'
        icon='/media/icons/duotune/art/art009.svg'
        title={intl.formatMessage({ id: 'Analytics' })}
        fontIcon='bi-app-indicator'
      />

      <AsideMenuItem
        to='/business/settings'
        icon='/media/icons/duotune/art/art0010.svg'
        title={intl.formatMessage({ id: 'Settings' })}
        fontIcon='bi-app-indicator'
        unlockKey={OnboardingUnlockKeys.SETTINGS_MENU}
        unlockedItems={unlockedItems}
      />
      <AsideMenuItem
        to='/share'
        unlockedItems={unlockedItems}
        icon='/media/icons/duotune/art/share.svg'
        title={intl.formatMessage({ id: 'Share' })}
        fontIcon='bi-app-indicator'
      />
      {/* <AsideMenuItemWithSub
        to='/sales'
        icon='/media/icons/duotune/art/art003.svg'
        title={intl.formatMessage({ id: 'Sales' })}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/sales/daily-sales' title='Daily sales' hasBullet={true} />
        <AsideMenuItem to='/sales/appointment-list' title='Appointments' hasBullet={true} />
        <AsideMenuItem to='/sales/sales-list' title='Invoice' hasBullet={true} />
        <AsideMenuItem to='/sales/vouchers' title='Vouchers' hasBullet={true} />
        <AsideMenuItem to='/sales/paid-plans' title='Paid plans' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/staff'
        icon='/media/icons/duotune/art/art006.svg'
        title={intl.formatMessage({ id: 'Staff' })}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/staff/schedule' title='schedule' hasBullet={true} />
        <AsideMenuItem to='/staff/employees' title='employees' hasBullet={true} />
        <AsideMenuItem to='/staff/closed-dates' title='closed-dates' hasBullet={true} />
        <AsideMenuItem to='/staff/permissions' title='permissions' hasBullet={true} />
      </AsideMenuItemWithSub> */}
      {/* <AsideMenuItemWithSub
        to='/services'
        icon='/media/icons/duotune/art/art007.svg'
        title={intl.formatMessage({ id: 'Services' })}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/services/services' title='services' hasBullet={true} />
        <AsideMenuItem to='/services/paid-plans' title='paid-plans' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/inventory'
        icon='/media/icons/duotune/art/art008.svg'
        title={intl.formatMessage({ id: 'Inventory' })}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/inventory/products' title='Product List' hasBullet={true} />
        <AsideMenuItem to='/inventory/stocktakes' title='Stock takes' hasBullet={true} />
        <AsideMenuItem to='/inventory/orders' title='Stock orders' hasBullet={true} />
        <AsideMenuItem to='/inventory/suppliers' title='Suppliers' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItemWithSub
        to='/analytics'
        icon='/media/icons/duotune/art/art009.svg'
        title={intl.formatMessage({ id: 'Analytics' })}
        fontIcon='bi-app-indicator'
      >
        <AsideMenuItem to='/analytics/dashboard' title='dashboard' hasBullet={true} />
        <AsideMenuItem to='/analytics/reports' title='reports' hasBullet={true} />
      </AsideMenuItemWithSub> */}

      {/* <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art0010.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      /> */}

      {/* <AsideMenuItem
        to='/builder'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Layout Builder'
        fontIcon='bi-layers'
      /> */}
      {/* <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Crafted</span>
        </div>
      </div> */}
      {/* <AsideMenuItemWithSub
        to='/crafted/pages'
        title='Pages'
        fontIcon='bi-archive'
        icon='/media/icons/duotune/general/gen022.svg'
      >
        <AsideMenuItemWithSub to='/crafted/pages/profile' title='Profile' hasBullet={true}>
          <AsideMenuItem to='/crafted/pages/profile/overview' title='Overview' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/projects' title='Projects' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/campaigns' title='Campaigns' hasBullet={true} />
          <AsideMenuItem to='/crafted/pages/profile/documents' title='Documents' hasBullet={true} />
          <AsideMenuItem
            to='/crafted/pages/profile/connections'
            title='Connections'
            hasBullet={true}
          />
        </AsideMenuItemWithSub>

        <AsideMenuItemWithSub to='/crafted/pages/wizards' title='Wizards' hasBullet={true}>
          <AsideMenuItem
            to='/crafted/pages/wizards/horizontal'
            title='Horizontal'
            hasBullet={true}
          />
          <AsideMenuItem to='/crafted/pages/wizards/vertical' title='Vertical' hasBullet={true} />
        </AsideMenuItemWithSub>
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/accounts'
        title='Accounts'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/crafted/account/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/crafted/account/settings' title='Settings' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/error'
        title='Errors'
        fontIcon='bi-sticky'
        icon='/media/icons/duotune/general/gen040.svg'
      >
        <AsideMenuItem to='/error/404' title='Error 404' hasBullet={true} />
        <AsideMenuItem to='/error/500' title='Error 500' hasBullet={true} />
      </AsideMenuItemWithSub>
      <AsideMenuItemWithSub
        to='/crafted/widgets'
        title='Widgets'
        icon='/media/icons/duotune/general/gen025.svg'
        fontIcon='bi-layers'
      >
        <AsideMenuItem to='/crafted/widgets/lists' title='Lists' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/statistics' title='Statistics' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/charts' title='Charts' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/mixed' title='Mixed' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/tables' title='Tables' hasBullet={true} />
        <AsideMenuItem to='/crafted/widgets/feeds' title='Feeds' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Apps</span>
        </div>
      </div>
      <AsideMenuItemWithSub
        to='/apps/chat'
        title='Chat'
        fontIcon='bi-chat-left'
        icon='/media/icons/duotune/communication/com012.svg'
      >
        <AsideMenuItem to='/apps/chat/private-chat' title='Private Chat' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/group-chat' title='Group Chart' hasBullet={true} />
        <AsideMenuItem to='/apps/chat/drawer-chat' title='Drawer Chart' hasBullet={true} />
      </AsideMenuItemWithSub>
      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>Changelog {process.env.REACT_APP_VERSION}</span>
        </a>
      </div> */}
    </>
  )
}
