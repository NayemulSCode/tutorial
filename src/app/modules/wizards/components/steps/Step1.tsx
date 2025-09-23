/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {useState, useEffect} from 'react'
import {KTSVG} from '../../../../../_metronic/helpers'
import {useQuery} from '@apollo/client'
import {BUSINESS_TYPE} from '../../../../../gql/Query'

type Props = {
  getBusinessType: (types: string[]) => void // Changed to array of strings
}

const Step1: React.FC<Props> = ({getBusinessType}) => {
  const [businessTypes, setBusinessTypes] = useState<string[]>([]) // Changed to array
  const [businessTypesData, setBusinessTypesData] = useState<Array<any>>([])

  // Call getBusinessType whenever businessTypes changes
  useEffect(() => {
    getBusinessType(businessTypes)
  }, [businessTypes, getBusinessType])

  const {data: businessTypeData} = useQuery(BUSINESS_TYPE)

  useEffect(() => {
    if (businessTypeData) {
      setBusinessTypesData(businessTypeData.businessTypes)
    }
  }, [businessTypeData])

  const handleBusinessTypesSet = (id: string) => {
    setBusinessTypes((prevTypes) => {
      // Check if the type is already selected
      if (prevTypes.includes(id)) {
        // If selected, remove it (unselect)
        return prevTypes.filter((typeId) => typeId !== id)
      } else {
        // If not selected and we haven't reached the limit, add it
        if (prevTypes.length < 3) {
          return [...prevTypes, id]
        }
        // If we've reached the limit, don't add more
        return prevTypes
      }
    })
  }

  const handleFirstStep = () => {
    getBusinessType(businessTypes)
  }

  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Choose Your Business Type
          <i
            className='fas fa-exclamation-circle ms-2 fs-7'
            data-bs-toggle='tooltip'
            title='Select up to 3 business types'
          ></i>
        </h2>
        <p className='text-muted'>
          You can select up to 3 business types. Selected: {businessTypes.length}/3
        </p>
      </div>

      <div className='fv-row'>
        <div className='row'>
          <div className='business-type-wrapper'>
            {businessTypesData.map((item, i) => {
              const isSelected = businessTypes.includes(item.id)
              const isDisabled = !isSelected && businessTypes.length >= 3

              return (
                <div key={i} className='business-type-item'>
                  <input
                    type='checkbox' // Changed from radio to checkbox
                    className='btn-check'
                    name='b_type'
                    value={item.id}
                    id={item.id}
                    checked={isSelected}
                    disabled={isDisabled}
                    onChange={() => handleBusinessTypesSet(item.id)}
                  />
                  <label
                    className={`btn btn-outline btn-outline-dashed btn-outline-default p-5 ${
                      isSelected ? 'active' : ''
                    } ${isDisabled ? 'disabled' : ''}`}
                    htmlFor={item.id}
                  >
                    <span className='business-type-svg-wrap'>
                      <img
                        height='64px'
                        width='64px'
                        src={`https://chuzeday.com/${item.image}`}
                        alt={item.name}
                      />
                    </span>

                    <span className='d-block fw-bold text-start'>
                      <span className='text-dark text-center fw-bolder d-block fs-6'>
                        {item.name}
                      </span>
                      {isSelected && <span className='badge badge-success mt-2'>Selected</span>}
                    </span>
                  </label>
                </div>
              )
            })}
          </div>
        </div>
        {/* <button
          onClick={handleFirstStep}
          type='submit'
          className={`${
            businessTypes.length > 0
              ? 'btn btn-lg btn-primary first-step-next'
              : 'btn btn-lg btn-primary first-step-next disabled'
          }`}
        >
          Continue
          <span className='indicator-label'>
            <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon-3 ms-2 me-0' />
          </span>
        </button> */}
      </div>
    </div>
  )
}

export {Step1}
