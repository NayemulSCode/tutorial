import React, { FC } from 'react'
import { Link } from 'react-router-dom'
import { Card8 } from '../../_metronic/partials/content/cards/Card8'
import partnerImg from '../../_metronic/assets/images/chuzedayApp/logo.svg'
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    HatenaShareButton,
    InstapaperIcon,
    InstapaperShareButton,
    LineShareButton,
    LinkedinShareButton,
    LivejournalShareButton,
    MailruIcon,
    MailruShareButton,
    OKShareButton,
    PinterestIcon,
    PinterestShareButton,
    PocketShareButton,
    RedditIcon,
    RedditShareButton,
    TelegramIcon,
    TelegramShareButton,
    TumblrShareButton,
    TwitterIcon,
    TwitterShareButton,
    ViberShareButton,
    VKShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    WorkplaceShareButton
} from "react-share";
import QRCode from 'react-qr-code';
import { Button } from 'react-bootstrap-v5';
const arrayOfShareItems =[
    {
        id: 1,
        icon: partnerImg,
        title: 'Business Website',
        name: "Chuzeday Business Website",
        variant: "partner",
        url: 'https://business.chuzeday.com',
        size: '35'
    },
    {
        id: 2,
        icon: partnerImg,
        title: 'Guest Website',
        name: "Chuzeday Guest Website",
        variant: "partner",
        url: 'https://chuzeday.com',
        size: '35'
    },
    {
        id: 3,
        icon: partnerImg,
        title: 'Business Mobile Application',
        variant: "guest",
        name: "Chuzeday Business Mobile Application",
        url: 'https://play.google.com/store/apps/details?id=com.chuzeday.business',
        size: '35'
    },
    {
        id: 4,
        icon: partnerImg,
        title: 'Guest Mobile Application',
        variant: "guest",
        name: "Chuzeday Guest Mobile Application",
        url: 'https://play.google.com/store/apps/details?id=com.chuzeday.chuzeday',
        size: '35'
    }

]

const ShareWrapper:FC = () => {
  return (
      <div className="">
        <div className="row">
            {
                arrayOfShareItems.map((data)=>{
                    return (
                        <div key={data.id} className=" col-xl-6 mb-5 single-staff">
                            <div className='card'>
                                <div className='card-header border-0 py-5 pb-0 mt-15'>
                                    <div className='card-title align-items-center m-auto flex-column'>
                                        <QRCode className='d-block mb-4' style={{ cursor: "pointer" }} id="QRCode" value={data.url} size={130} />
                                    </div>
                                </div>
                                <div className='card-body d-flex flex-column'>
                                    <a className='text-center' href={data.url} target='_blank'><Button className='share_link_btn'>App Link</Button></a>
                                    <div className='pt-5'>
                                        <p className='text-center fs-6 pb-5 '>
                                            <span className={`${data?.variant === 'partner' ? ' text-info card-label fw-bolder fs-2 mb-1' : 'text-success card-label fw-bolder fs-2 mb-1'}`}>{data.title}</span>
                                        </p>

                                    </div>
                                </div>
                            </div>
                            <div className="s-action">
                                <RedditShareButton url={data.url} title={data.name}>
                                    <RedditIcon round size={data.size} />
                                </RedditShareButton>
                                <FacebookShareButton url={data.url} title={data.name}>
                                    <FacebookIcon round size={data.size} />
                                </FacebookShareButton>
                                <WhatsappShareButton url={data.url} title={data.name}>
                                    <WhatsappIcon round size={data.size} />
                                </WhatsappShareButton>
                                <TwitterShareButton url={data.url} title={data.name}>
                                    <TwitterIcon round size={data.size} />
                                </TwitterShareButton>
                                <TelegramShareButton url={data.url} title={data.name}>
                                    <TelegramIcon round size={data.size} />
                                </TelegramShareButton>
                                <EmailShareButton url={data.url} title={data.name}>
                                    <EmailIcon round size={data.size}/>
                                </EmailShareButton>
                            </div>
                        </div>
                    )
                })
            }  
        </div>
    </div>
  )
}

export default ShareWrapper