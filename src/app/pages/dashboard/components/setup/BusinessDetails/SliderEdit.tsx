import { useMutation } from '@apollo/client';
import React, { FC, useState, useEffect} from 'react'
import { Form,Button,Carousel } from 'react-bootstrap-v5';
import { PARTNER_PROFILE_UPDATE } from '../../../../../../gql/Mutation';
import { IAccountInfo } from '../../../../../../types'
import ImageUploader from '../../inventory/ImageUploader'
import { useSnackbar } from 'notistack';
import {useHistory} from 'react-router-dom'
import { jsx } from '@emotion/react';
import { imageUrl } from '../../../../../modules/util';

const SliderEdit: FC<{ accInfo: any }> = ({ accInfo }) => {
  console.log(accInfo)
  const {enqueueSnackbar} = useSnackbar()
  const history = useHistory()
  const [profileData, setProfileData] = useState<IAccountInfo>({
    id: '',
    business_id: '',
    first_name: '',
    last_name: '',
    mobile: '',
    email: '',
    photo: '',
    business_type: [],
    approved_status: '',
    user_type: '',
    created_at: 0,
    updated_at: 0,
    business_info: {
      id: '',
      name: '',
      thumbnail: '',
      team_size: '',
      slider: [],
      website: '',
      social_links: {facebook: '', instagram: '', linkedin: '', tiktok: ''},
      location: '',
      eir_code: '',
      latitude: 0,
      longitude: 0,
      created_at: 0,
      updated_at: 0,
      description: '',
      about: '',
    },
  })
  const [images, setImages] = useState<Array<any>>([])
  const [sliders, setSliders] = useState<Array<string>>([])
  // const [socialLink, setSocialLink] = useState<Array<any>>([]);
  const [bWebsite, setBWebsite] = useState<string>('')
  const [aboutUs, setAboutUs] = useState<string>('')
  const [socialLnk, setSocialLnk] = useState<any>({
    facebook: '',
    instagram: '',
    linkedin: '',
    tiktok: '',
  })
  let newSliderImages = [...images, ...sliders]
  const imageBaseURL2 = `${imageUrl}/uploads/businessPhoto/`
  useEffect(() => {
    if (accInfo) {
      if (
        typeof accInfo?.business_info?.social_links === undefined ||
        accInfo?.business_info?.social_links === ''
      ) {
        setSocialLnk({
          facebook: '',
          instagram: '',
          linkedin: '',
          tiktok: '',
        })
      } else {
        setSocialLnk({
            facebook: accInfo?.business_info?.social_links?.facebook ??"",
            instagram: accInfo?.business_info?.social_links?.instagram??"",
            linkedin: accInfo?.business_info?.social_links?.linkedin??"",
            tiktok: accInfo?.business_info?.social_links?.tiktok??"",
          })
      }
      setProfileData(accInfo)
      if (typeof accInfo?.business_info?.slider !== undefined) {
        setImages(accInfo?.business_info?.slider)
      }
    }
  }, [accInfo])
  const handleImgDelete = (e: number) => {
    let netImg = images.filter((image: any, index: number) => index != e)
    setImages(netImg)
    console.log(netImg)
  }
  const getUrl = (links: Array<string>) => {
    console.log(links)
    setSliders(links)
  }
  const handleSocialLink = (platform: string, value: any) => {
    setSocialLnk((prevState: any) => ({
      ...prevState,
      [platform]: value,
    }))
  }
  // Handle onBlur event to detect when the input is emptied
  const handleInputBlur = (platform:string) => {
    if (socialLnk[platform] === '') {
        // Handle the case where the input field is emptied
       // You can remove the platform from the state or take any other desired action
    }
  }
  const [partnerProfileUpdate] = useMutation(PARTNER_PROFILE_UPDATE)
  const handleUpdateProfileData = (e: any) => {
    e.preventDefault()
    // console.log("submit social link", JSON.stringify(editableLink))
    partnerProfileUpdate({
      variables: {
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        mobile: profileData.mobile,
        business_name: profileData.business_info?.name,
        business_size: '',
        team_size: profileData.business_info?.team_size,
        thumbnail: profileData.business_info?.thumbnail,
        slider: newSliderImages,
        location: profileData.business_info?.location,
        eir_code: profileData.business_info?.eir_code,
        latitude: profileData.business_info?.latitude,
        longitude: profileData.business_info?.longitude,
        photo: profileData.photo,
        website: bWebsite ? bWebsite : profileData.business_info?.website,
        social_links: socialLnk
          ? socialLnk
          : profileData?.business_info?.social_links,
        description: profileData.business_info?.description,
        about: aboutUs ? aboutUs : profileData.business_info?.about,
      },
    }).then((data) => {
      if (data) {
        enqueueSnackbar('Profile Updated', {
          variant: 'success',
          anchorOrigin: {
            vertical: 'top',
            horizontal: 'right',
          },
          transitionDuration: {
            enter: 300,
            exit: 500,
          },
        })
        history.push('/business/settings')
      }
    })
  }
  return (
    <>
      <div className='row mt-5'>
        <div className='col-xl-5'>
          <div className='col-xl-12 mb-7'>
            <div className='b-details-slider'>
              <div className='form-heading p-0 border-0'>
                <h3 className='section-title'>Slider Photos</h3>
                <p>Drag and drop a photo to change the order.</p>
              </div>
              <ImageUploader
                multiple={true}
                products={profileData?.business_info?.slider}
                getUrl={getUrl}
              />
              <div className='image-thumbnails'>
                {images &&
                  images.length > 0 &&
                  images?.map((image: any, index: number) => (
                    <span key={index} className='edit-pr-img-thumbnail b-details-img-thumbnail'>
                      <img
                        className='image-thumbnail'
                        key={image}
                        src={`${imageBaseURL2}${image}`}
                        alt='image'
                      ></img>
                      <i
                        onClick={() => {
                          handleImgDelete(index)
                        }}
                        className='far fa-trash-alt delete-icon'
                      ></i>
                    </span>
                  ))}
              </div>
            </div>
          </div>
          <div className='col-xl-12'>
            <div className='form-heading p-0 border-0 mt-5'>
              <h3 className='section-title'>Online Links</h3>
            </div>
            <Form.Group className='mb-3'>
              <Form.Label>Website</Form.Label>
              <Form.Control
                type='text'
                defaultValue={profileData?.business_info?.website}
                name='website'
                placeholder='www.beautysalon.com'
                onChange={(e) => {
                  setBWebsite(e.target.value)
                }}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Facebook Page</Form.Label>
              <Form.Control
                type='text'
                defaultValue={socialLnk?.facebook}
                name='facebook'
                placeholder='www.facebook.com/yourpagename'
                onChange={(e: any) => {
                  handleSocialLink('facebook', e.target.value)
                }}
                onBlur={() => handleInputBlur('facebook')}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Instagram Page</Form.Label>
              <Form.Control
                type='text'
                defaultValue={socialLnk?.instagram}
                name='instagram'
                placeholder='www.instagram.com/yourpagename'
                onChange={(e: any) => {
                  handleSocialLink('instagram', e.target.value)
                }}
                onBlur={() => handleInputBlur('instagram')}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>LinkedIn Page</Form.Label>
              <Form.Control
                type='text'
                defaultValue={socialLnk?.linkedin}
                name='linkedin'
                placeholder='www.linkedin.com/yourpagename'
                onChange={(e: any) => {
                  handleSocialLink('linkedin', e.target.value)
                }}
                onBlur={() => handleInputBlur('linkedin')}
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Tiktok Page</Form.Label>
              <Form.Control
                type='text'
                defaultValue={socialLnk?.tiktok}
                name='tiktok'
                placeholder='www.tiktok.com/yourpagename'
                onChange={(e: any) => {
                  handleSocialLink('tiktok', e.target.value)
                }}
                onBlur={() => handleInputBlur('tiktok')}
              />
            </Form.Group>
          </div>
        </div>
        <div className='col-xl-7'>
          <div className='col-xl-12 mb-7'>
            <Carousel>
              {images &&
                images.length > 0 &&
                images?.map((image: any, index: number) => (
                  <Carousel.Item className='' interval={2000} key={index}>
                    <img
                      className='business-img'
                      src={`${imageBaseURL2}${image}`}
                      alt='image-thumbnail'
                    />
                  </Carousel.Item>
                ))}
            </Carousel>
          </div>
          <div className='col-xl-12'>
            <Form.Group className='mb-3'>
              <Form.Label>About Us</Form.Label>
              <textarea
                defaultValue={profileData?.business_info?.about}
                name='about_us'
                placeholder='Short description of business'
                onChange={(e) => {
                  setAboutUs(e.target.value)
                }}
                className='b-slider-textarea'
              />
            </Form.Group>
          </div>
        </div>

        <div className='button_position'>
          <Button onClick={handleUpdateProfileData}>Save</Button>
        </div>
      </div>
    </>
  )
}

export default SliderEdit
