import React, { FC, useEffect, useState } from 'react'
import { KTSVG } from '../../../../../_metronic/helpers'
import { Field, ErrorMessage } from 'formik'
import { serviceArray } from '../ServiceType';
import SetService from "./SetService"
import { useQuery } from '@apollo/client';
import { BUSINESS_SERVICE_TYPE } from '../../../../../gql/Query';

type Props = {
  getBusinessService: (type: string) => void
  bType: string
}

const Step2: React.FC<Props> = ({ getBusinessService, bType }) => {
  const [businessServicesCheck, setBusinessServicesCheck] = useState<Array<any>>([]);
  const [serviceTypesArray, setServiceTypesArray] = useState<Array<any>>([]);
  getBusinessService(JSON.stringify(businessServicesCheck))
  const handleProcessService=()=>{
    getBusinessService(JSON.stringify(businessServicesCheck))
  }
  const onSelect =(id:any)=>{
    // console.log(id)
    const selected = businessServicesCheck;
    const index = selected.indexOf(id) ;
    if (index > -1) {
      selected.splice(index , 1)
    } else {
      selected.push(id)
    }
    setBusinessServicesCheck(selected)
    // console.log("selected",selected)
  }
  // console.log("step 2 business type found----", bType)
  const { data: serviceTypesData } = useQuery(BUSINESS_SERVICE_TYPE,{
    variables: {
      business_type_ids: bType
    }
  });
  useEffect(()=>{
    if(serviceTypesData){
      setServiceTypesArray(serviceTypesData.businessTypeWiseCategory)
      // console.log("service data-------", serviceTypesData.businessTypeWiseCategory)
    }
  }, [serviceTypesData])
  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Choose multiple service categories</h2>
        {/* <div className='text-gray-400 fw-bold fs-6'>
          If you need more business types, choose all that apply below.
        </div> */}
      </div>

      <div className='fv-row'>
        <div className='row'>
          <div className="business-type-wrapper">
            {/* {
              serviceArray.map((item)=> {
                return (
                  <div className='business-type-item' key={item.id}>
                    <input
                      type='checkbox'
                      className='btn-check'
                      value={item.id}
                      id={item.title}
                      onChange={(e: any) => { handleBusinessCheck(e,item.id) }}
                    />
                    <label
                      className='btn btn-outline btn-outline-dashed btn-outline-default p-5'
                      htmlFor={item.title}
                    >
                      <span className='business-type-svg-wrap'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox={item.viewBox}><path d={item.dir} fill="#740030" fill-rule="evenodd"></path></svg>
                      </span>

                      <span className='d-block fw-bold text-start'>
                        <span className='text-dark text-center fw-bolder d-block fs-6'>{item.title}</span>
                      </span>
                    </label>
                  </div>
                )
              })
            } */}
            {
              serviceTypesArray.map((item:any) => {
                return(
                  <SetService item={item} onSelect={onSelect} />
              )})
            }
          </div>
        </div>

        <button onClick={handleProcessService} type='submit' className='btn btn-lg btn-primary steper-next-btn'>
          Continue
          <span className='indicator-label'>
            <KTSVG
               path='/media/icons/duotune/arrows/arr064.svg'
              className='svg-icon-3 ms-2 me-0'
            />
          </span>
        </button>
        {/* <button onClick={handleProcessService}>process service</button> */}

      </div>
    </div>
  )
}

export { Step2 }
