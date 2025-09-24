import React, { useState, useEffect, useContext, useRef } from 'react'
import clsx from 'clsx'
import { Link, useHistory, useParams } from "react-router-dom";
import { useMutation, useQuery } from '@apollo/client'
import { toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { PARTNER_PROFILE_UPDATE } from '../../../../../../gql/Mutation'
import { useSnackbar } from 'notistack';
import { AppContext } from '../../../../../../context/Context';
import { PROFILE_INFORMATION } from '../../../../../../gql/Query';
import ImageUploader from '../../../../../pages/dashboard/components/inventory/ImageUploader';
import { IAccountInfo } from '../../../../../../types';
import shopAvatar from '../../../../../../_metronic/assets/images/avatars/placeholder-image.png';
import { useTostMessage } from '../../../../widgets/components/useTostMessage';
import { imageUrl } from '../../../../util';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../../setup';
import { OnboardingUnlockKeys } from '../../../../onboarding/onboardingSlice';

const ProfileDetails: React.FC<{ accInfo: any }> = ({ children, accInfo }) => {
  const { addUser, user } = useContext(AppContext);
  const {isOnboardingActive, unlockedItems} = useSelector((state: RootState) => state.onboarding)

  const {showToast} = useTostMessage()
  const [upimgUrl, setUpImgurl] = useState("");
  const [upimgUrl2, setUpImgurl2] = useState("");
  const [loading, setLoading] = useState(false)
  const imageBaseURL = `${imageUrl}/uploads/partner/`
  const imageBaseURL2 = `${imageUrl}/uploads/businessPhoto/`
  const history = useHistory()
  const [partnerThumbnail, setPartnerThumbnail] = useState("");
  const [sliders, setSliders] = useState<Array<string>>([]);
  const [images, setImages] = useState<Array<any>>([]);
  // console.log(images);
  let newSliderImages = [...images, ...sliders];
  // console.log(newSliderImages);
  const [profileData, setProfileData] = useState<IAccountInfo>({
    id: "",
    business_id: "",
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    photo: "",
    business_type: [],
    approved_status:'',
    user_type: "",
    created_at: 0,
    updated_at: 0,
    business_info: {
      id: "",
      name: "",
      thumbnail: "",
      team_size: "",
      slider: [],
      website: "",
      social_links: {facebook: "", instagram: "", linkedin:"", tiktok: ""},
      location: "",
      eir_code: "",
      latitude: 0,
      longitude: 0,
      created_at: 0,
      updated_at: 0,
      description: "",
      about: ""
    }
  })

  useEffect(() => {
    if (accInfo) {
      // console.log(accInfo)
      setProfileData(accInfo)
      setPartnerThumbnail(accInfo?.business_info?.thumbnail)
      if (typeof accInfo?.business_info?.slider !== undefined) {
        setImages(accInfo?.business_info?.slider)
      }
    }
  }, [accInfo])

  const [partnerProfileUpdate] = useMutation(PARTNER_PROFILE_UPDATE, {
    refetchQueries: [{
      query: PROFILE_INFORMATION
    }],
    awaitRefetchQueries: true,
  })

  const handleUpdate = (e: any) => {
    // const { name, value } = e.target;
    // setProfileData((preValue) => {
    //   return {
    //     ...preValue,
    //     [name]: value
    //   }
    // })

    const path = e.target.name.split('.');
    const finalProp = path.pop();
    const newData = { ...profileData };
    let pointer: any = newData;
    path.forEach((el: any) => {
      pointer[el] = { ...pointer[el] };
      pointer = pointer[el];
    });
    pointer[finalProp] = e.target.value;
    setProfileData(newData);
  };

  let firstNameRef = useRef<HTMLInputElement | null>(null);
  let businessNameRef = useRef<HTMLInputElement | null>(null);
  let companySizeRef = useRef<HTMLInputElement | null>(null);
  let locationRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if(profileData?.first_name === ""){
      firstNameRef?.current?.focus();
      showToast("First name is empty",'warning')
    }
    else if (profileData?.business_info?.name === ""){
      businessNameRef.current?.focus()
      showToast("Business name is empty", 'warning')
    }
    else if (profileData.business_info?.team_size === "" || null){
      companySizeRef.current?.focus()
      showToast("Please enter the company size", 'warning')
    }
    if (profileData?.first_name && profileData?.business_info?.name && profileData.business_info?.team_size) {
      setLoading(true);
      const updateProfilePayload = {
        id: profileData.id,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        mobile: profileData.mobile,
        business_name: profileData.business_info?.name,
        business_size: '',
        team_size: profileData.business_info?.team_size,
        thumbnail: partnerThumbnail,
        slider: newSliderImages,
        location: profileData.business_info?.location,
        eir_code: profileData.business_info?.eir_code,
        latitude: profileData.business_info?.latitude,
        longitude: profileData.business_info?.longitude,
        photo: profileData.photo,
        website: profileData.business_info?.website,
        social_links: profileData.business_info?.social_links ? {
          facebook: profileData.business_info?.social_links?.facebook ?? '',
          instagram: profileData.business_info?.social_links?.instagram ?? '',
          linkedin: profileData.business_info?.social_links?.linkedin ?? '',
          tiktok: profileData.business_info?.social_links?.tiktok ?? '',
        } : {},
        description: profileData.business_info?.description,
        about: profileData.business_info?.about,
      }
      partnerProfileUpdate({
        variables: updateProfilePayload,
      })
        .then(({data}) => {
          // console.log(data?.partnerProfileUpdate)
          const profile = {
            ...JSON.parse(localStorage.getItem('partner')!),
            ...profileData,
            photo: data?.partnerProfileUpdate?.photo,
          }
          // console.log(profile)
          localStorage.setItem('partner', JSON.stringify(profile))
          addUser(profile)
          showToast('Profile Updated', 'success');
          setLoading(false)
          history.push('/account/overview')
        })
        .catch((err) => {
          showToast('Profile Update Failed', 'error');
          setLoading(false)
          // console.log(err)
        })
    }
  }


  const imageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e?.target!.files!;
    const file = files[0]!;
    getBase64(file);
  };

  const getBase64 = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result);
    };
  };
  const onLoad = (fileString: any) => {
    // console.log(fileString);
    setUpImgurl(fileString);
    setProfileData({ ...profileData, photo: fileString });
  };

  const thumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = e?.target!.files!;
    const file = files[0]!;
    getBase64Thumbnail(file);
  };
  const getBase64Thumbnail = (file: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoadThumbnail(reader.result);
    };
  };
  const onLoadThumbnail = (fileString: any) => {
    // console.log(fileString);
    setUpImgurl2(fileString);
    setPartnerThumbnail(fileString)
    // setProfileData({ ...profileData, business_info.thumbnail: JSON.stringify(fileString) });
  };


  const getUrl = (links: Array<string>) => {
    // console.log(links);
    setSliders(links)
  }

  const handleImgDelete = (e: number) => {
    let netImg = images.filter((image: any, index: number) => index != e)
    setImages(netImg);
    // console.log(netImg)
  }
  const handleWhiteSpce = (e: any) => {
    e = e || window.event;
    const value = e.target.value
    let key = e.charCode;
    if (key === 32 && value === "") {
      e.preventDefault();
    }
  }
  // console.log(profileData);

  return (
    <div className='card mb-5 mb-xl-10'>
      <div
        className='card-header border-bottom cursor-pointer'
        role='button'
        data-bs-toggle='collapse'
        data-bs-target='#kt_account_profile_details'
        aria-expanded='true'
        aria-controls='kt_account_profile_details'
      >
        <div className='card-title m-0'>
          <h3 className='fw-bolder m-0'>Profile Details</h3>
        </div>
      </div>

      <div id='kt_account_profile_details' className='collapse show'>
        <form onSubmit={handleSubmit} noValidate className='form'>
          <div className='row'>
            <div className='col-sm-8'>
              <div className='card-body p-9'>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Photo</label>
                  <div className='col-lg-8'>
                    <div className='image-input profile-avatar-wrap image-input-outline'>
                      <div className='image-input-wrapper w-125px h-125px'>
                        {
                          <img
                            className='profile-pic-up-icon'
                            src={
                              upimgUrl
                                ? upimgUrl
                                : profileData.photo
                                ? `${imageBaseURL}${profileData?.photo}`
                                : toAbsoluteUrl(`/media/avatars/blank.png`)
                            }
                          />
                        }
                        <svg
                          className='profile-pic-up-svg'
                          viewBox='0 0 25 23'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M21.072 16.002a.75.75 0 01.75.75v1.842h1.842a.75.75 0 01.743.648l.007.102a.75.75 0 01-.75.75h-1.842v1.842a.75.75 0 01-.648.743l-.102.007a.75.75 0 01-.75-.75v-1.842H18.48a.75.75 0 01-.743-.648l-.007-.102a.75.75 0 01.75-.75h1.842v-1.842a.75.75 0 01.648-.743zM14.102.45a.75.75 0 01.624.334l1.621 2.43h3.285a2.593 2.593 0 012.593 2.594v7.494a.75.75 0 11-1.5 0V5.808c0-.604-.49-1.093-1.093-1.093h-3.686a.75.75 0 01-.624-.334L13.7 1.95H8.974l-1.62 2.43a.75.75 0 01-.624.335H3.043c-.604 0-1.093.49-1.093 1.093v11.98c0 .605.49 1.094 1.093 1.094h11.691a.75.75 0 110 1.5H3.044A2.593 2.593 0 01.45 17.789V5.808a2.593 2.593 0 012.593-2.593h3.285L7.948.784A.75.75 0 018.574.45zm-2.764 5.53a5.358 5.358 0 110 10.716 5.358 5.358 0 010-10.716zm0 1.5a3.858 3.858 0 100 7.716 3.858 3.858 0 000-7.716zM4.08 5.808a1.037 1.037 0 110 2.074 1.037 1.037 0 010-2.074z'
                            fill='#b5b5c3'
                            fill-rule='evenodd'
                          ></path>
                        </svg>
                        <input type='file' accept='image/*' onChange={imageUpload} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>Full Name</label>

                  <div className='col-lg-8'>
                    <div className='row'>
                      <div className='col-lg-6 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid mb-3 mb-lg-0'
                          placeholder='First name'
                          value={profileData?.first_name}
                          name='first_name'
                          onChange={handleUpdate}
                          onKeyPress={(e: any) => {
                            handleWhiteSpce(e)
                          }}
                          ref={firstNameRef}
                        />
                      </div>

                      <div className='col-lg-6 fv-row'>
                        <input
                          type='text'
                          className='form-control form-control-lg form-control-solid'
                          placeholder='Last name'
                          value={profileData?.last_name}
                          name='last_name'
                          onChange={handleUpdate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>Company</label>
                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Company name'
                      value={profileData?.business_info?.name}
                      name='business_info.name'
                      onChange={handleUpdate}
                      onKeyPress={(e: any) => {
                        handleWhiteSpce(e)
                      }}
                      ref={businessNameRef}
                    />
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label required fw-bold fs-6'>
                    Company Size
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <input
                      type='text'
                      autoComplete='off'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Company size'
                      value={profileData?.business_info?.team_size}
                      name='business_info.team_size'
                      onChange={handleUpdate}
                      onKeyPress={(event: any) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault()
                        }
                      }}
                      ref={companySizeRef}
                    />
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Contact Phone</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      type='tel'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Phone number'
                      value={profileData?.mobile}
                      name='mobile'
                      onChange={handleUpdate}
                      onKeyPress={(e: any) => {
                        handleWhiteSpce(e)
                        if (/([^+0-9]+)/gi.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Website</span>
                  </label>

                  <div className='col-lg-8 fv-row'>
                    <input
                      autoComplete='off'
                      type='text'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Company website'
                      value={profileData?.business_info?.website}
                      name='business_info.website'
                      onChange={handleUpdate}
                    />
                  </div>
                </div>
                <div className='row mb-6'>
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>
                    <span>Description</span>
                  </label>
                  <div className='col-lg-8 fv-row'>
                    <textarea
                      autoComplete='off'
                      className='form-control form-control-lg form-control-solid'
                      placeholder='Company description'
                      value={profileData?.business_info?.description}
                      name='business_info.description'
                      onChange={handleUpdate}
                    />
                  </div>
                </div>

                <div
                  className={clsx('row mb-6', {
                    'grey-out-override': unlockedItems.includes(
                      OnboardingUnlockKeys.UPDATE_THUMBNAIL
                    ),
                  })}
                >
                  <label className='col-lg-4 col-form-label fw-bold fs-6'>Thumbnail</label>
                  <div className='col-lg-8'>
                    <div className='image-input profile-avatar-wrap image-input-outline'>
                      <div className='image-input-wrapper w-125px h-125px'>
                        {
                          <img
                            className='profile-pic-up-icon'
                            src={
                              upimgUrl2
                                ? upimgUrl2
                                : profileData?.business_info?.thumbnail
                                ? `${imageBaseURL2}${profileData?.business_info?.thumbnail}`
                                : toAbsoluteUrl(`/media/avatars/blank.png`)
                            }
                          />
                        }
                        <svg
                          className='profile-pic-up-svg'
                          viewBox='0 0 25 23'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            d='M21.072 16.002a.75.75 0 01.75.75v1.842h1.842a.75.75 0 01.743.648l.007.102a.75.75 0 01-.75.75h-1.842v1.842a.75.75 0 01-.648.743l-.102.007a.75.75 0 01-.75-.75v-1.842H18.48a.75.75 0 01-.743-.648l-.007-.102a.75.75 0 01.75-.75h1.842v-1.842a.75.75 0 01.648-.743zM14.102.45a.75.75 0 01.624.334l1.621 2.43h3.285a2.593 2.593 0 012.593 2.594v7.494a.75.75 0 11-1.5 0V5.808c0-.604-.49-1.093-1.093-1.093h-3.686a.75.75 0 01-.624-.334L13.7 1.95H8.974l-1.62 2.43a.75.75 0 01-.624.335H3.043c-.604 0-1.093.49-1.093 1.093v11.98c0 .605.49 1.094 1.093 1.094h11.691a.75.75 0 110 1.5H3.044A2.593 2.593 0 01.45 17.789V5.808a2.593 2.593 0 012.593-2.593h3.285L7.948.784A.75.75 0 018.574.45zm-2.764 5.53a5.358 5.358 0 110 10.716 5.358 5.358 0 010-10.716zm0 1.5a3.858 3.858 0 100 7.716 3.858 3.858 0 000-7.716zM4.08 5.808a1.037 1.037 0 110 2.074 1.037 1.037 0 010-2.074z'
                            fill='#b5b5c3'
                            fill-rule='evenodd'
                          ></path>
                        </svg>
                        <input type='file' accept='image/*' onChange={thumbnailUpload} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-sm-4'>
              <div className='profile-slider-photos'>
                <div className='form-heading border-0 pb-0'>
                  <h2 className='section-title'>Slider photos</h2>
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
                    images.map((image: any, index: number) => (
                      <span className='edit-pr-img-thumbnail'>
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
          </div>

          <div className='card-footer d-flex justify-content-end py-6 px-9'>
            <button type='submit' className='btn btn-primary' disabled={loading}>
              {!loading && 'Save Changes'}
              {loading && (
                <span className='indicator-progress' style={{display: 'block'}}>
                  Please wait...{' '}
                  <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export { ProfileDetails }
