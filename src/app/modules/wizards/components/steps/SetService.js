import React, {useState} from 'react';

const SetService = ({ item, onSelect})=> {
    const [select, setSelect] = useState(false);
    return (
        <>
            <div className='fv-row'>
                <div className='row'>
                    <div className="business-type-wrapper">
                        <div onClick={() => { setSelect(!select); onSelect(item.id)}} className={select?"selected-service":"dselected-service"}>
                            <label
                            className='btn btn-outline btn-outline-dashed btn-outline-default p-5 sr-type-label'
                            >
                                <span className='business-type-svg-wrap'>
                                    <img height="64px" width="64px" src={`https://chuzeday.com/${item.image}`} />
                                </span>
                
                                <span className='d-block fw-bold text-start'>
                                    <span className='text-dark text-center fw-bolder d-block fs-6'>{item.name}</span>
                                </span>
                            </label>

                            {/* <span className='d-block fw-bold text-start'>
                                <span className='text-dark text-center fw-bolder d-block fs-6'>{item.title}</span>
                            </span> */}
                            {/* className={select?"bg-success":"bg-primary"} */}
                        </div>
                    </div>
                </div>
            </div>

                  {/* <div className="business-type-wrapper">
                  <div className='business-type-item'>
                    <Field
                      type='radio'
                      className='btn-check'
                      name='accountType'
                      value='hair-salon'
                      id='hair_salon'
                      onClick={() => setBusinessType("hair-salon")}
                    />
                    <label
                      className='btn btn-outline btn-outline-dashed btn-outline-default p-5'
                      htmlFor='hair_salon' 
                    >
                      <span className='business-type-svg-wrap'>
                      </span>
      
                      <span className='d-block fw-bold text-start'>
                        <span className='text-dark text-center fw-bolder d-block fs-6'>Hair Salon</span>
                      </span>
                    </label>
                  </div>
                  </div> */}
        </>
    )
}

export default SetService
