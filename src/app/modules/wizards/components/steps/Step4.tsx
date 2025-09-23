import React, {FC, useState} from 'react'
import {Field, ErrorMessage} from 'formik'
import {Form} from 'react-bootstrap-v5'
import {KTSVG} from '../../../../../_metronic/helpers'
import { toAbsoluteUrl } from '../../../../../_metronic/helpers'
import Chair from '../../../../../_metronic/assets/images/Chairs/chair.png'
type Props = {
  getNChari: (type: string) => void
}
const Step4: React.FC<Props> = ({getNChari}) => {
  const [chairs, setChairs]= useState("");
  const [isChair, setIsChair]= useState(0);
  const handleChair=(e:any)=>{
    setChairs(e.target.name = e.target.value);
  }
  getNChari(chairs)
  // console.log(chairs)
  const hnadleStep4=()=>{
    getNChari(chairs)
  }
  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          How many Chair do you want to added?</h2>
        {/* <div className='text-gray-400 fw-bold fs-6'>
          Add Chair to set up your calendar correctly.you can add unlimited chair for free on Chuzeday!
        </div> */}
      </div>


      <div className='mb-0 fv-row'>
        <div className='mb-0'>
          <label className='d-flex align-items-center cursor-pointer'>
            <span className='business-type-svg-wrap me-2'>
              <img src={Chair} alt="chair-icon" style={{ width: '30px', height: '30px'}} />
            </span>
            <span className='fw-bolder text-gray-800 text-hover-primary fs-5 me-2'>
                Select Number of Chair
            </span>
            <Form.Group className="starttime me-2" controlId="exampleForm.ControlInput1">
              <Form.Select name="numberOfChairs" onChange={(e:any)=>{handleChair(e); setIsChair(isChair+1)}} className='form-select-solid' aria-label="Default select example">
                            <option value="">select</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                          </Form.Select>
                        </Form.Group>
          </label>
        </div>
        {
          isChair !== 0 ?
        <button onClick={hnadleStep4} type='submit' className='btn btn-lg btn-primary steper-next-btn'>
          Continue
          <span className='indicator-label'>
            <KTSVG
               path='/media/icons/duotune/arrows/arr064.svg'
              className='svg-icon-3 ms-2 me-0'
            />
          </span>
        </button> :
            <button disabled className='btn btn-lg btn-primary steper-next-btn'>
              Continue
              <span className='indicator-label'>
                <KTSVG
                  path='/media/icons/duotune/arrows/arr064.svg'
                  className='svg-icon-3 ms-2 me-0'
                />
              </span>
            </button>

        }
      </div>
    </div>
  )
}

export {Step4}
