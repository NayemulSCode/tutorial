import React, { FC, useState, useEffect} from 'react'
import SetupAddress from './SetupAddress'
import { Button, Form, Modal } from "react-bootstrap-v5";
import { IAccountInfo } from '../../../../../types';
import { useMutation, useQuery } from '@apollo/client';
import { PROFILE_INFORMATION } from '../../../../../gql/Query';
import { PARTNER_PROFILE_UPDATE } from '../../../../../gql/Mutation';
import { useHistory } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { KTSVG } from '../../../../../_metronic/helpers';

const SetupLocation:FC = () => {
    const history= useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const [profileData, setProfileData] = useState<IAccountInfo>({
      id: '',
      business_id: '',
      first_name: '',
      last_name: '',
      mobile: '',
      email: '',
      photo: '',
      user_type: '',
      business_type: [],
      approved_status: '',
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
    const { data: accountData, error: accountError, loading, refetch } = useQuery(PROFILE_INFORMATION);
    useEffect(() => {
        if (accountData) {
            // refetch()
            setProfileData(accountData.profileInformation)
        }
    }, [accountData])
    console.log("location componet profile data", profileData);
    const sAddress:any = localStorage.getItem("partner")
    const cAddress = JSON.parse(sAddress)
    const faddress = cAddress?.business_info?.location;
    const [locationInforamton, setLocationInforamton] = useState({
        address: "",
        lat: 0.0,
        lng: 0.0
    })
    const mapInformation = (address: any, lat: any, lng: any) => {
        setLocationInforamton({
            address: address,
            lat: lat,
            lng: lng
        })
    }
    console.log("location eidt",locationInforamton);
    const [partnerProfileUpdate] = useMutation(PARTNER_PROFILE_UPDATE)
    const handleLocationChange=()=>{
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
            slider: profileData.business_info?.slider ?? [],
            location: locationInforamton?.address
              ? locationInforamton?.address
              : profileData.business_info?.location,
            eir_code: profileData.business_info?.eir_code,
            latitude: locationInforamton?.lat
              ? locationInforamton?.lat
              : profileData.business_info?.latitude,
            longitude: locationInforamton?.lng
              ? locationInforamton?.lng
              : profileData.business_info?.longitude,
            photo: profileData.photo,
            website: profileData.business_info?.website,
            social_links: profileData.business_info?.social_links
              ? {
                  facebook: profileData.business_info?.social_links?.facebook ?? '',
                  instagram: profileData.business_info?.social_links?.instagram ?? '',
                  linkedin: profileData.business_info?.social_links?.linkedin ?? '',
                  tiktok: profileData.business_info?.social_links?.tiktok ?? '',
                }
              : {},
            description: profileData.business_info?.description,
            about: profileData.business_info?.about,
          },
        }).then((data) => {
          if (data) {
            enqueueSnackbar('Location updated', {
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
            localStorage.setItem('partner', JSON.stringify(profileData))
            history.push('/business/settings')
          }
        })
        console.log("change location--");
    }
    return (
        <div>
            <div className='d-flex flex-stack'>
                <div className='mr-1 mb-2'>
                    <button
                        onClick={() => { history.push("/business/settings") }}
                        type='button'
                        className='btn btn-lg btn-light-primary me-3'
                        data-kt-stepper-action='previous'
                    >
                        <KTSVG
                            path='/media/icons/duotune/arrows/arr063.svg'
                            className='svg-icon-4 me-1'
                        />
                    </button>
                </div>
            </div>
            {/* {
                isEdit === false &&
                <Form.Group className="mb-3 col-md-6">
                    <Form.Label>Business Location</Form.Label>
                    <Form.Control type="text"
                        defaultValue={profileData?.business_info?.location}
                        readOnly
                    />
                    <Button className="mt-5" onClick={isEditAddress}>Edit</Button>
                </Form.Group>
            }
            {isEdit&&<>
                <Button onClick={() => { setIsEdit(false) }}>Cancel</Button>
            <SetupAddress mapInformation={mapInformation} />
                <Button onClick={handleLocationChange}>Save</Button></>
            } */}

            <div className='d-flex align-items-center mb-4'>
                <div className="mb-3 col-md-8 me-4">
                    <h3>Current Location: <span className="h4">{profileData?.business_info?.location}</span></h3>
                </div>
            </div>
            <SetupAddress mapInformation={mapInformation} laitu={profileData.business_info?.latitude} longi={profileData.business_info?.longitude} />
            <Button className="btn-sm mt-3" onClick={handleLocationChange}>Save</Button>
        </div>
    )
}

export default SetupLocation
