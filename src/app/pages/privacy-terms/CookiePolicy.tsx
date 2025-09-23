import React, { FC } from 'react'

const CookiePolicy:FC = () => {
    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100 %'
    }
    const tableRowStyle = {
        border: '1px solid #dddddd',
        textAlign: 'left',
        padding: '8px'
    }
  return (
      <div>
      
          <h1>Cookie Notice</h1>
          <p>
              Our Sites use cookies and/or other similar technologies such as device-IDs, in-App codes, pixel tags and web beacons to collect and store certain information. These typically involve pieces of information or code that a website transfers to or accesses from your computer hard drive or mobile device to store and sometimes track information about you.<br /><br />
              Cookies and similar technologies enable you to be remembered when using that computer or device to interact with websites and online services and can be used to manage a range of features and content as well as store searches and present personalised content<br /><br />
              Our Sites use cookies and similar technologies either alone or in combination with each other to create a unique device ID and to distinguish you from other users of our Sites. This helps us to provide you with a good experience when you browse our Sites and also allows us to improve our Sites.<br /><br />
              A number of cookies and similar technologies we use last only for the duration of your web or app session and expire when you close your browser or exit one of our Sites. Others are used to remembering you when you return to one of our Sites and will last for longer.<br />
          </p>
          <p>We use the following types of cookies:</p>
          <h3>Strictly necessary cookies</h3>
          <p>These are cookies that are required for the operation of our Sites and under our terms with you. They include, for example, cookies that enable you to log into secure areas of our Sites or (on other sites) use a shopping cart.</p>
          <table className='cookie_table'>
              <tr>
                  <th>Cookie</th>
                  <th>Provider</th>
                  <th>Set on</th>
                  <th>Why we use it</th>
                  <th>Expires</th>
              </tr>
              <tr>
                  <td  >__cf_bm</td>
                  <td  >CloudFlare</td>
                  <td  >support.Chuzeday.com</td>
                  <td  >Set by the CloudFlare service for internal purposes</td>
                  <td  >20 min</td>
              </tr>
              <tr>
                  <td  >__cfruid</td>
                  <td  >CloudFlare</td>
                  <td  >support.Chuzeday.com</td>
                  <td  >Set by the CloudFlare service to identify trusted web traffic.</td>
                  <td  >Session</td>
              </tr>
              <tr>
                  <td  >_gatekeeper_session_token</td>
                  <td  >Chuzeday</td>
                  <td  >www.chuzeday.com<br />chuzeday.com/partner-profile</td>
                  <td  >Gatekeeper session token.</td>
                  <td  >1 year</td>
              </tr>
              <tr>
                  <td  >_gatekeeper_user_id</td>
                  <td  >Chuzeday</td>
                  <td  >www.chuzeday.com<br />chuzeday.com/partner-profile</td>
                  <td   >User ID in Gatekeeper</td>
                  <td    >1 year</td>
              </tr>
          </table>
          <h3>Functionality cookies</h3>
          <p>These may be used to recognise you when you return to our Sites. This enables us, subject to your choices and preferences, to personalise our content, greet you by name and remember your preferences (for example, choice of language or region).</p>
          <table className='cookie_table'>
              <tr>
                  <th  >Cookie</th>
                  <th  >Provider</th>
                  <th  >Set on</th>
                  <th  >Why we use it</th>
                  <th  >Expires</th>
              </tr>
              <tr>
                  <td   >ChuzedayLocale</td>
                  <td  >Chuzeday</td>
                  <td  >www.chuzeday.com<br />chuzeday.com/partner-profile</td>
                  <td  >Stores preferred user language in Chuzeday</td>
                  <td  >100 years</td>
              </tr>
          </table>
          <h3>Analytical / performance cookies</h3>
          <p>These allow us to recognise and count the number of visitors and to see how visitors move around our Sites when they are using them. This helps us improve the way our Sites work, for example, by ensuring that users are easily finding what they are looking for.</p>
          <table className='cookie_table'>
              <tr>
                  <th   >Cookie</th>
                  <th  >Provider</th>
                  <th  >Set on</th>
                  <th  >Why we use it</th>
                  <th  >Expires</th>
              </tr>
              <tr>
                  <td  >_dc_gtm_UA-*</td>
                  <td  >Google</td>
                  <td  >www.chuzeday.com<br />chuzeday.com/partner-profile</td>
                  <td  >This cookie is associated with sites using Google Tag Manager to load other scripts and code into a page</td>
                  <td  >1 min</td>
              </tr>
          </table>
          <h3>Targeting / advertising cookies</h3>
          <p>These cookies record your visit to our website, the pages you have visited and the links you have followed. We will use this information subject to your choices and preferences to make our Sites and the advertising displayed on them more relevant to your interests. We may also share this information with third parties for this purpose.</p>
          <table className='cookie_table'>
              <tr>
                  <th  >Cookie</th>
                  <th  >Provider</th>
                  <th  >Set on</th>
                  <th  >Why we use it</th>
                  <th  >Expires</th>
              </tr>
              <tr>
                  <td  >_fbp</td>
                  <td  >Facebook</td>
                  <td  >www.chuzeday.com<br />chuzeday.com/partner-profile</td>
                  <td  >Used by Facebook to deliver a series of advertisement products such as real time bidding from third party advertisers</td>
                  <td  >3 months</td>
              </tr>
          </table>
      </div>
  )
}

export default CookiePolicy