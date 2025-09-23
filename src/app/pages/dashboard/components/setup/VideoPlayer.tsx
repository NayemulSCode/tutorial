import React, { FC, useState, useEffect} from 'react'
import { KTSVG } from '../../../../../_metronic/helpers';
import { allVideo, videoCategory } from '../../../../modules/util'
import { useHistory, useLocation } from 'react-router-dom';
import { HOW_TO_VIDEOS } from '../../../../../gql/Query';
import { useMutation, useQuery } from '@apollo/client';
import { useContext } from 'react';
import { AppContext } from '../../../../../context/Context';

const VideoPlayer:FC = () => {
  const history = useHistory();
  const location = useLocation();
  const {state} = location as any;
  console.log('location state:', state)
  console.log('location:', location)
  console.log('location:', location.state)
  
  console.log('location:', state?.hasOwnProperty('title'))
  const {videoId, addVideoItem} = useContext(AppContext)
  const [videoList, setVideoList] = useState<Array<any>>([])
  const [videoCategories, setVideoCategories] = useState<Array<string>>([])
  const {data} = useQuery(HOW_TO_VIDEOS)
  useEffect(() => {
    if (data) {
      // console.log('allVideo-----', allVideo(data?.businessMenus!, videoId))
      setVideoCategories(videoCategory(data?.businessMenus!))
      setVideoList(allVideo(data?.businessMenus!, videoId))
      // set context
      // addVideoCategories(videoCategory(data?.businessMenus!))
    }
  }, [data, videoId])
  const handleRedirectPreviousSection = (videoId:number) => {
    addVideoItem(0);
    if(videoId === 1){
      history.push('/calendar')
    }else if(videoId === 2){
      history.push('/sales/daily-sales');
    }else if(videoId === 3){
      history.push('/vouchers');
    }else if(videoId === 4){
      history.push('/guests');
    }else if(videoId === 5){
      if (state?.title === "add service") {
        history.push('/add-service')
      }else{
        history.push('/services/list')
      }
    }else if(videoId === 6){
      history.push('/inventory/products');
    }else if(videoId === 7){
      history.push('/analytics/dashboard');
    }else if(videoId === 8){
      history.push('/business/settings');
    }else if(videoId === 9){
      history.push('/account/overview');
    }else{
      history.push('/business/settings')
    }
  }
  return (
    <div>
      <div className='flex-stack business_details_header mb-7'>
        <div className='mr-2'>
          <button
            onClick={() => {
              addVideoItem(0)
              history.push('/business/settings')
            }}
            type='button'
            className='btn btn-lg btn-light-primary me-3'
            data-kt-stepper-action='previous'
          >
            <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
          </button>
        </div>
        <h1 className='me-4 mb-0'>Business Setup</h1>
        {videoId !== 0 && state?.title !== "setting" && (
          <button
            type='button'
            style={{background: '#ebc11a'}}
            onClick={() => handleRedirectPreviousSection(videoId)}
            className='btn btn-pd btn-light me-5'
          >
            Back To Previous
          </button>
        )}
      </div>

      <ul className='nav nav-pills mb-3 setup_video_tab' id='pills-tab' role='tablist'>
        {videoCategories.map((category: any, index: number) => {
          return (
            <li key={index} className='nav-item' role='presentation'>
              <button
                onClick={() => addVideoItem(+category.id)}
                className={`nav-link ${videoId === +category.id ? 'active' : ''}`}
                id='pills-home-tab'
                data-bs-toggle='pill'
                data-bs-target='#pills-home'
                type='button'
                role='tab'
                aria-controls='pills-home'
                aria-selected='true'
              >
                {category.name}
              </button>
            </li>
          )
        })}
      </ul>
      <div className='tab-content' id='pills-tabContent'>
        <div
          className='tab-pane fade show active'
          id='pills-home'
          role='tabpanel'
          aria-labelledby='pills-home-tab'
        >
          <div className='row g-4'>
            {videoList.map((video) => {
              console.log('video', video)
              return (
                <div className='col-md-4'>
                  <div className='card text-center p-0'>
                    {/* begin::Beader */}

                    {/* <div className='p-2 text-center'>
                        <h3 className='card-title align-items-center flex-column mb-0'>
                          <span className='text-success card-label fw-bolder fs-2'>
                            {video?.name}
                          </span>
                        </h3>
                        <div></div>
                      </div> */}

                    {/* end::Header */}
                    {/* begin::Body */}
                    <div className='card-body d-flex flex-column p-0'>
                      <iframe
                        width='100%'
                        height='280'
                        src={`https://www.youtube.com/embed/${video.youtube_link}?rel=0`}
                        title='How To Video'
                        frameBorder={0}
                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                        allowFullScreen
                      ></iframe>
                    </div>
                    {/* end::Body */}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
