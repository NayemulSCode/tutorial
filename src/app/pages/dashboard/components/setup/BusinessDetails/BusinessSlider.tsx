import React, { FC, useState, useEffect} from 'react'
import { Carousel } from 'react-bootstrap-v5';
import { imageUrl } from '../../../../../modules/util';

const BusinessSlider: FC<{ accInfo: any }> = ({ accInfo}) => {

    const imageBaseURL = `${imageUrl}/uploads/partner/`;
    const imageBaseURL2 = `${imageUrl}/uploads/businessPhoto/`
    const [images, setImages] = useState<Array<any>>([]);
    const [profileData, setProfileData] = useState<any>()
    const [socialLink, setSocailLink] = useState<any>()
    useEffect(() => {
        if (accInfo) {
            setProfileData(accInfo?.business_info)
            setSocailLink(accInfo?.business_info?.social_links)
            if (typeof accInfo?.business_info?.slider !== undefined) {
                setImages(accInfo?.business_info?.slider)
            }
        }
    }, [accInfo])
    return (

        <>
         <div>
            <Carousel>
                { 
                     images && images.length > 0 && images.map((image: any, index: number) =>
                         <Carousel.Item className="" interval={2000} key={index}>
                            <img className="business-img"  src={`${imageBaseURL2}${image}`}alt="image-thumbnail" />
                        </Carousel.Item>
                    ) 
                }
            </Carousel>
            <div className='mt-5'>
                <div className='d-flex align-items-center mb-3'>
                    <h4 className='mb-0 me-4'>About Us</h4>
                    <p className='mb-0'>{profileData?.about}</p>
                </div>
                <div className='d-flex align-items-center mb-3'>
                    <h4 className='mb-0 me-4'>Website</h4>
                    <p className='mb-0'>{profileData?.website}</p>
                </div>
                <div>
                    <h3 className='mb-2'>Social Links</h3>
                        <div>
                            <div className='d-flex align-items-center mb-3'>
                                <h4 className='mb-0 me-4'>Facebook Link</h4>
                                <p className='mb-0'>{socialLink?.facebook}</p>
                            </div>
                            <div className='d-flex align-items-center mb-3'>
                                <h4 className='mb-0 me-4'>Instagram Link</h4>
                                <p className='mb-0'>{socialLink?.instagram}</p>
                            </div>
                        </div>
                </div>
            </div>
        </div>
        </>
        
    )
}

export default BusinessSlider
