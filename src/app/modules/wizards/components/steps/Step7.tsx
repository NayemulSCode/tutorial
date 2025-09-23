import React, { FC, useState, useEffect} from 'react'
import {KTSVG, toAbsoluteUrl} from '../../../../../_metronic/helpers'
import {Field, ErrorMessage} from 'formik'
import { Card, Button, Form, Container, Row, Col, InputGroup, Dropdown, DropdownButton, Tab, Nav } from "react-bootstrap-v5";

type Props = {
  getDailyTime: (type: string) => void
}
const timeSlotArray = ["00:00", "00:15", "00:30", "00:45", "01:00", "01:15", "01:30", "01:45", "02:00", "02:00", "02:15", "02:30", "02:45", "03:00", "03:00", "03:15", "03:30", "03:45",
  "04:00", "04:15", "04:30", "04:45", "05:00", "05:15", "05:30", "05:45", "06:00", "06:15", "06:30", "06:45", "07:00", "07:15", "07:30", "07:45", "08:00", "08:15", "08:30", "08:45","09:00",
  "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30","14:45","15:00",
  "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15","20:30","20:45","21:00",
  "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30","23:45"
]

const Step7: FC<Props> = ({getDailyTime}) => {
  // console.log("09 number idex", timeSlotArray[38+4])
  // console.log("18:00 number idex", timeSlotArray[74])
  // Show Working hour
  const [showWhour1, setShowWhour1] = React.useState(false);
  const [showWhour2, setShowWhour2] = React.useState(false);
  const [showWhour3, setShowWhour3] = React.useState(false);
  const [showWhour4, setShowWhour4] = React.useState(false);
  const [showWhour5, setShowWhour5] = React.useState(false);
  const [showWhour6, setShowWhour6] = React.useState(false);
  const [showWhour7, setShowWhour7] = React.useState(false);

  // add Working hour
  const [addWhour1, setAddwhour1] = React.useState(false);
  const [addWhour2, setAddwhour2] = React.useState(false);
  const [addWhour3, setAddwhour3] = React.useState(false);
  const [addWhour4, setAddwhour4] = React.useState(false);
  const [addWhour5, setAddwhour5] = React.useState(false);
  const [addWhour6, setAddwhour6] = React.useState(false);
  const [addWhour7, setAddwhour7] = React.useState(false);
  // working tree
  const [enableDay, setEnableDay] = useState<boolean>(false)
  const [workingDays, setWorkingDays] = useState<Array<object>>([{}])
  const [workingTime, setWorkingTime] = useState<object>({});
  const [workingTime2, setWorkingTime2] = useState<object>({});
  const [workingTime3, setWorkingTime3] = useState<object>({});
  const [workingTime4, setWorkingTime4] = useState<object>({});
  const [workingTime5, setWorkingTime5] = useState<object>({});
  const [workingTime6, setWorkingTime6] = useState<object>({});
  const [workingTime7, setWorkingTime7] = useState<object>({});
  
  const handleDayAdd=(e:any)=>{
    
  }
  const handleTime=(e:any)=>{
    // console.log("value of starttiem",e.target.value)
    const { name, value } = e.target;
    setWorkingTime((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    });
  }
  const handleTime2 = (e: any) => {
    // console.log("value of starttiem", e.target.value)
    const { name, value } = e.target;
    setWorkingTime2((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  const handleTime3 = (e: any) => {
    const { name, value } = e.target;
    setWorkingTime3((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  const handleTime4 = (e: any) => {
    const { name, value } = e.target;
    setWorkingTime4((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  const handleTime5 = (e: any) => {
    const { name, value } = e.target;
    setWorkingTime5((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  const handleTime6 = (e: any) => {
    const { name, value } = e.target;
    setWorkingTime6((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
  // console.log("working time -7", workingTime7)
  const handleTime7 = (e: any) => {
    const { name, value } = e.target;
    setWorkingTime7((preValue) => {
      return {
        ...preValue,
        [name]: value
      }
    })
  }
// monday time set
  const [monadyTimeS11,setMonadyTimeS11] = useState<string>("");
  const [monadyTimeS12,setMonadyTimeS12] = useState<string>("");
  const [monadyTimeS21,setMonadyTimeS21] = useState<any>("");
  const [monadyTimeS22,setMonadyTimeS22] = useState<string>("");
  const [ismonadyTimeS11,setIsMonadyTimeS11] = useState<number>(0);
  const [ismonadyTimeS12,setIsMonadyTimeS12] = useState<number>(0);
  const [ismonadyTimeS21,setIsMonadyTimeS21] = useState<number>(0);
  const [ismonadyTimeS22,setIsMonadyTimeS22] = useState<number>(0);
  const [mondayTimeOb, setMondayTimeOb] = useState<object>({});

  let targetIndex: any; 
  useEffect(()=>{
    if (showWhour1 === true && addWhour1 === false){
      const mondayTime = {
        s1_start_time: ismonadyTimeS11 !== 0 ? monadyTimeS11:  timeSlotArray[38],
        s1_end_time: ismonadyTimeS12 !== 0 ? monadyTimeS12 : timeSlotArray[58]
      }
      setMondayTimeOb(mondayTime)
    }
    if (showWhour1 === true && addWhour1 === true) {
      if (ismonadyTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === monadyTimeS12);
        targetIndex = timeSlotArray[index + 4]
        setMonadyTimeS21(timeSlotArray[index + 4])
        // console.log("index of slot 1 last index: ", index, monadyTimeS21, targetIndex)
      }
      const mondayTime = {
        s1_start_time: ismonadyTimeS11 !== 0 ? monadyTimeS11 : timeSlotArray[38],
        s1_end_time: ismonadyTimeS12 !== 0 ? monadyTimeS12 : timeSlotArray[58],
        s2_start_time: ismonadyTimeS12 !== 0 || ismonadyTimeS21 !== 0 ? targetIndex : timeSlotArray[58 + 4],
        s2_end_time: ismonadyTimeS22 !== 0 ? monadyTimeS22 : timeSlotArray[74]
      }
      setMondayTimeOb(mondayTime)
    }
  }, [showWhour1, addWhour1, ismonadyTimeS11, ismonadyTimeS12, ismonadyTimeS21, ismonadyTimeS22]);
  // monday time set end

  // tuesday time set
  const [tuesdayTimeS11, setTuesdayTimeS11] = useState<string>("");
  const [tuesdayTimeS12, setTuesdayTimeS12] = useState<string>("");
  const [tuesdayTimeS21, setTuesdayTimeS21] = useState<any>("");
  const [tuesdayTimeS22, setTuesdayTimeS22] = useState<string>("");
  const [istuesdayTimeS11, setIsTuesdayTimeS11] = useState<number>(0);
  const [istuesdayTimeS12, setIsTuesdayTimeS12] = useState<number>(0);
  const [istuesdayTimeS21, setIsTuesdayTimeS21] = useState<number>(0);
  const [istuesdayTimeS22, setIsTuesdayTimeS22] = useState<number>(0);
  const [tuesdayTimeOb, setTuesdayTimeOb] = useState<object>({});

  let targetIndexTU: any; 

  useEffect(() => {
    if (showWhour2 === true && addWhour2 === false) {
      const tuesdayTime = {
        s1_start_time: istuesdayTimeS11 !== 0 ? tuesdayTimeS11 : timeSlotArray[38],
        s1_end_time: istuesdayTimeS12 !== 0 ? tuesdayTimeS12 : timeSlotArray[58]
      }
      setTuesdayTimeOb(tuesdayTime)
    }
    if (showWhour2 === true && addWhour2 === true) {
      if (istuesdayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === tuesdayTimeS12);
        targetIndexTU = timeSlotArray[index + 4]
        setTuesdayTimeS21(timeSlotArray[index + 4])
      }
      const tuesdayTime = {
        s1_start_time: istuesdayTimeS11 !== 0 ? tuesdayTimeS11 : timeSlotArray[38],
        s1_end_time: istuesdayTimeS12 !== 0 ? tuesdayTimeS12 : timeSlotArray[58],
        s2_start_time: istuesdayTimeS12 !== 0 || istuesdayTimeS21 !== 0 ? targetIndexTU : timeSlotArray[58 + 4],
        s2_end_time: istuesdayTimeS22 !== 0 ? tuesdayTimeS22 : timeSlotArray[74]
      }
      setTuesdayTimeOb(tuesdayTime)
    }
  }, [showWhour2, addWhour2, istuesdayTimeS11, istuesdayTimeS12, istuesdayTimeS21, istuesdayTimeS22]);
  // tuesday time set end

  // wednesday time set
  const [wednesdayTimeS11, setWednesdayTimeS11] = useState<string>("");
  const [wednesdayTimeS12, setWednesdayTimeS12] = useState<string>("");
  const [wednesdayTimeS21, setWednesdayTimeS21] = useState<any>("");
  const [wednesdayTimeS22, setWednesdayTimeS22] = useState<string>("");
  const [iswednesdayTimeS11, setIsWednesdayTimeS11] = useState<number>(0);
  const [iswednesdayTimeS12, setIsWednesdayTimeS12] = useState<number>(0);
  const [iswednesdayTimeS21, setIsWednesdayTimeS21] = useState<number>(0);
  const [iswednesdayTimeS22, setIsWednesdayTimeS22] = useState<number>(0);
  const [wednesdayTimeOb, setWednesdayTimeOb] = useState<object>({});

  let targetIndexWE: any; 

  useEffect(()=>{
    if (showWhour3 === true && addWhour3 === false) {
      const wednesdayTime = {
        s1_start_time: iswednesdayTimeS11 !== 0 ? wednesdayTimeS11 : timeSlotArray[38],
        s1_end_time: iswednesdayTimeS12 !== 0 ? wednesdayTimeS12 : timeSlotArray[58]
      }
      setWednesdayTimeOb(wednesdayTime);
    }
    if (showWhour3 === true && addWhour3 === true) {
      if (iswednesdayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === wednesdayTimeS12);
        targetIndexWE = timeSlotArray[index + 4]
        setWednesdayTimeS21(timeSlotArray[index + 4])
      }
      const wednesdayTime  = {
        s1_start_time: iswednesdayTimeS11 !== 0 ? wednesdayTimeS11 : timeSlotArray[38],
        s1_end_time: iswednesdayTimeS12 !== 0 ? wednesdayTimeS12 : timeSlotArray[58],
        s2_start_time: iswednesdayTimeS12 !== 0 || iswednesdayTimeS21 !== 0 ? targetIndexWE : timeSlotArray[58 + 4],
        s2_end_time: iswednesdayTimeS22 !== 0 ? wednesdayTimeS22 : timeSlotArray[74]
      }
      setWednesdayTimeOb(wednesdayTime);

    }
  }, [showWhour3, addWhour3, iswednesdayTimeS11, iswednesdayTimeS12, iswednesdayTimeS21, iswednesdayTimeS22])
  // wednesday tiem end

  //thursday time start 
  const [thursdayTimeS11, setThursdayTimeS11] = useState<string>("");
  const [thursdayTimeS12, setThursdayTimeS12] = useState<string>("");
  const [thursdayTimeS21, setThursdayTimeS21] = useState<any>("");
  const [thursdayTimeS22, setThursdayTimeS22] = useState<string>("");
  const [isthursdayTimeS11, setIsThursdayTimeS11] = useState<number>(0);
  const [isthursdayTimeS12, setIsThursdayTimeS12] = useState<number>(0);
  const [isthursdayTimeS21, setIsThursdayTimeS21] = useState<number>(0);
  const [isthursdayTimeS22, setIsThursdayTimeS22] = useState<number>(0);
  const [thursdayTimeOb, setThursdayTimeOb] = useState<object>({});

  let targetIndexTH: any; 

  useEffect(()=>{
    if (showWhour4 === true && addWhour4 === false) {
      const thursdayTime = {
        s1_start_time: isthursdayTimeS11 !== 0 ? thursdayTimeS11 : timeSlotArray[38],
        s1_end_time: isthursdayTimeS12 !== 0 ? thursdayTimeS12 : timeSlotArray[58]
      }
      setThursdayTimeOb(thursdayTime);
    }
    if (showWhour4 === true && addWhour4 === true) {
      if (isthursdayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === thursdayTimeS12);
        targetIndexTH = timeSlotArray[index + 4]
        setThursdayTimeS21(timeSlotArray[index + 4])
      }
      const thursdayTime = {
        s1_start_time: isthursdayTimeS11 !== 0 ? thursdayTimeS11 : timeSlotArray[38],
        s1_end_time: isthursdayTimeS12 !== 0 ? thursdayTimeS12 : timeSlotArray[58],
        s2_start_time: isthursdayTimeS12 !== 0 || isthursdayTimeS21 !== 0 ? targetIndexTH : timeSlotArray[58 + 4],
        s2_end_time: isthursdayTimeS22 !== 0 ? thursdayTimeS22 : timeSlotArray[74]
      }
      setThursdayTimeOb(thursdayTime);
    }
  }, [showWhour4, addWhour4, isthursdayTimeS11, isthursdayTimeS12, isthursdayTimeS21, isthursdayTimeS22])
   //thursday time end

  //  friday time start
  const [fridayTimeS11, setFridayTimeS11] = useState<string>("");
  const [fridayTimeS12, setFridayTimeS12] = useState<string>("");
  const [fridayTimeS21, setFridayTimeS21] = useState<any>("");
  const [fridayTimeS22, setFridayTimeS22] = useState<string>("");
  const [isfridayTimeS11, setIsFridayTimeS11] = useState<number>(0);
  const [isfridayTimeS12, setIsFridayTimeS12] = useState<number>(0);
  const [isfridayTimeS21, setIsFridayTimeS21] = useState<number>(0);
  const [isfridayTimeS22, setIsFridayTimeS22] = useState<number>(0);
  const [fridayTimeOb, setFridayTimeOb] = useState<object>({});

  let targetIndexFr: any; 
  useEffect(()=>{
    if (showWhour5 === true && addWhour5 === false) {
      const fridayTime = {
        s1_start_time: isfridayTimeS11 !== 0 ? fridayTimeS11 : timeSlotArray[38],
        s1_end_time: isfridayTimeS12 !== 0 ? fridayTimeS12 : timeSlotArray[58]
      }
      setFridayTimeOb(fridayTime);
    }
    if (showWhour5 === true && addWhour5 === true) {
      if (isfridayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === fridayTimeS12);
        targetIndexFr = timeSlotArray[index + 4]
        setFridayTimeS21(timeSlotArray[index + 4])
      }
      const fridayTime = {
        s1_start_time: isfridayTimeS11 !== 0 ? fridayTimeS11 : timeSlotArray[38],
        s1_end_time: isfridayTimeS12 !== 0 ? fridayTimeS12 : timeSlotArray[58],
        s2_start_time: isfridayTimeS12 !== 0 || isfridayTimeS21 !== 0 ? targetIndexFr : timeSlotArray[58 + 4],
        s2_end_time: isfridayTimeS22 !== 0 ? fridayTimeS22 : timeSlotArray[74]
      }
      setFridayTimeOb(fridayTime);
    }
    
  }, [showWhour5, addWhour5, isfridayTimeS11, isfridayTimeS12, isfridayTimeS21, isfridayTimeS22])

  //  saturday time start
  const [saturdayTimeS11, setSaturdayTimeS11] = useState<string>("");
  const [saturdayTimeS12, setSaturdayTimeS12] = useState<string>("");
  const [saturdayTimeS21, setSaturdayTimeS21] = useState<any>("");
  const [saturdayTimeS22, setSaturdayTimeS22] = useState<string>("");
  const [issaturdayTimeS11, setIsSaturdayTimeS11] = useState<number>(0);
  const [issaturdayTimeS12, setIsSaturdayTimeS12] = useState<number>(0);
  const [issaturdayTimeS21, setIsSaturdayTimeS21] = useState<number>(0);
  const [issaturdayTimeS22, setIsSaturdayTimeS22] = useState<number>(0);
  const [saturdayTimeOb, setSaturdayTimeOb] = useState<object>({});

  let targetIndexSa: any;
  
  useEffect(()=>{
    if (showWhour6 === true && addWhour6 === false) {
      const saturdayTime = {
        s1_start_time: issaturdayTimeS11 !== 0 ? saturdayTimeS11 : timeSlotArray[38],
        s1_end_time: issaturdayTimeS12 !== 0 ? saturdayTimeS12 : timeSlotArray[58]
      }
      setSaturdayTimeOb(saturdayTime);
    }
    if (showWhour6 === true && addWhour6 === true) {
      if (issaturdayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === saturdayTimeS12);
        targetIndexSa = timeSlotArray[index + 4]
        setSaturdayTimeS21(timeSlotArray[index + 4])
      }
      const saturdayTime = {
        s1_start_time: issaturdayTimeS11 !== 0 ? saturdayTimeS11 : timeSlotArray[38],
        s1_end_time: issaturdayTimeS12 !== 0 ? saturdayTimeS12 : timeSlotArray[58],
        s2_start_time: issaturdayTimeS12 !== 0 ||issaturdayTimeS21 !== 0 ? targetIndexSa : timeSlotArray[58 + 4],
        s2_end_time: issaturdayTimeS22 !== 0 ? saturdayTimeS22 : timeSlotArray[74]
      }
      setSaturdayTimeOb(saturdayTime);
    }
  }, [showWhour6, addWhour6, issaturdayTimeS11, issaturdayTimeS12, issaturdayTimeS21, issaturdayTimeS22])
  // saturday time end

  // sunday time start
  const [sundayTimeS11, setSundayTimeS11] = useState<string>("");
  const [sundayTimeS12, setSundayTimeS12] = useState<string>("");
  const [sundayTimeS21, setSundayTimeS21] = useState<any>("");
  const [sundayTimeS22, setSundayTimeS22] = useState<string>("");
  const [issundayTimeS11, setIsSundayTimeS11] = useState<number>(0);
  const [issundayTimeS12, setIsSundayTimeS12] = useState<number>(0);
  const [issundayTimeS21, setIsSundayTimeS21] = useState<number>(0);
  const [issundayTimeS22, setIsSundayTimeS22] = useState<number>(0);
  const [sundayTimeOb, setSundayTimeOb] = useState<object>({});

  let targetIndexSu: any;
  useEffect(()=>{
    if (showWhour7 === true && addWhour7 === false) {
      const sundayTime = {
        s1_start_time: issundayTimeS11 !== 0 ? sundayTimeS11 : timeSlotArray[38],
        s1_end_time: issundayTimeS12 !== 0 ? sundayTimeS12 : timeSlotArray[58]
      }
      setSundayTimeOb(sundayTime);
    }
    if (showWhour7 === true && addWhour7 === true) {
      if (issundayTimeS12 !== 0) {
        const index = timeSlotArray.findIndex((time: any) => time === sundayTimeS12);
        targetIndexSu = timeSlotArray[index + 4]
        setSundayTimeS12(timeSlotArray[index + 4])
      }
      const sundayTime = {
        s1_start_time: issundayTimeS11 !== 0 ? sundayTimeS11 : timeSlotArray[38],
        s1_end_time: issundayTimeS12 !== 0 ? sundayTimeS12 : timeSlotArray[58],
        s2_start_time: issundayTimeS12 !== 0 || issundayTimeS21 !== 0 ? targetIndexSu : timeSlotArray[58 + 4],
        s2_end_time: issundayTimeS22 !== 0 ? sundayTimeS22 : timeSlotArray[74]
      }
      setSundayTimeOb(sundayTime);
    }
  }, [showWhour7, addWhour7, issundayTimeS11, issundayTimeS12, issundayTimeS21, issundayTimeS22])
  // sunday time end
  const handleSubmit=()=>{
    const modifyObj=[
      {
        monday: showWhour1 === true ? mondayTimeOb : {}
      },
      {
        tuesday: showWhour2 === true ? tuesdayTimeOb : {}
      },
      {
        wednesday: showWhour3 === true ? wednesdayTimeOb: {}
      },
      {
        thursday: showWhour4 === true ? thursdayTimeOb : {}
      },
      {
        friday: showWhour5 === true ?  fridayTimeOb: {}
      },
      {
        saturday: showWhour6 === true ? saturdayTimeOb : {}
      },
      {
        sunday: showWhour7 === true ? sundayTimeOb: {}
      }
    ]

    setWorkingDays(modifyObj)
    // console.log("modify object", modifyObj)
    // const newObj=[
    //   {
    //     monday: workingTime
    //   },
    //   {
    //     tuesday: workingTime2
    //   },
    //   {
    //     wednesday: workingTime3
    //   },
    //   {
    //     thursday: workingTime4
    //   }, 
    //   {
    //     friday: workingTime5
    //   },
    //   {
    //     saturday: workingTime6
    //   }, 
    //   {
    //     sunday: workingTime7
    //   }
    // ]
    // setWorkingDays(newObj);
  }
  getDailyTime(JSON.stringify(workingDays))
  // getDailyTime(JSON.stringify(workingDays))
  // console.log("working days----", JSON.stringify(workingDays));
  
  return (
    <div className='w-100'>
      <div className='pb-10'>
        <h2 className='fw-bolder d-flex align-items-center text-dark'>
          Add your working hours</h2>
        <div className='text-gray-400 fw-bold fs-6'>
          These are the hours your guest can book your services.
        </div>
      </div>

    <div className="mb-0 fv-row">
      <div className='mb-0 working-hour-wrap'>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group  className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour1(!showWhour1)}  onChange={handleDayAdd} name="monday" value="monday" className="me-3"/>
                <h5 className="staff-name mb-1">Monday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour1 ?
                ( <div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                    <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid'
                          name="s1_start_time"
                          onChange={(e: any) => { handleTime(e); setIsMonadyTimeS11(ismonadyTimeS11 + 1); setMonadyTimeS11(e.target.value)}}
                          aria-label="Default select example"
                        defaultValue={timeSlotArray[38]}
                          >
                        {timeSlotArray.map((time)=><option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                        onChange={(e: any) => { handleTime(e); setIsMonadyTimeS12(ismonadyTimeS12  + 1); setMonadyTimeS12(e.target.value)}}
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour1(!addWhour1)}>
                        <span>{addWhour1 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour1 &&
                    <div>
                      <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1" aria-label="Default select example">
                            <Form.Select className='form-select-solid' name="s2_start_time" 
                              onChange={(e: any) => { handleTime(e); setIsMonadyTimeS21(ismonadyTimeS21 + 1); setMonadyTimeS21(e.target.value)}}
                              value={ismonadyTimeS12 !== 0 ? monadyTimeS21 : timeSlotArray[58+4]}
                              >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                            <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example" 
                              onChange={(e: any) => { handleTime(e); setIsMonadyTimeS22(ismonadyTimeS22 + 1); setMonadyTimeS22(e.target.value)}}
                              defaultValue={timeSlotArray[74]}
                          >
                            {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                      </Row>
                    </div>
                    }
                  </Row>
                </div> )
              :  
              ( <div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
              </div> )
              }
            </div>
          </div>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour2(!showWhour2)}  className="me-3" />
                <h5 className="staff-name mb-1">Tuesday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour2 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e: any) => { handleTime2(e); setIsTuesdayTimeS11(istuesdayTimeS11 + 1); setTuesdayTimeS11(e.target.value)}} 
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                      onChange={(e:any)=>{handleTime2(e); setIsTuesdayTimeS12(istuesdayTimeS12 +1); setTuesdayTimeS12(e.target.value)}} 
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour2(!addWhour2)}>
                        <span>{addWhour2 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour2 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                            <Form.Select className='form-select-solid' name="s2_start_time" aria-label="Default select example"
                            onChange={(e:any)=>{handleTime2(e); setIsTuesdayTimeS21(istuesdayTimeS21 + 1); setTuesdayTimeS21(e.target.value);}} 
                              value={istuesdayTimeS12 !== 0 ? tuesdayTimeS21 : timeSlotArray[58 + 4]}
                            >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                            <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime2(e); setIsTuesdayTimeS22(istuesdayTimeS22  +1); setTuesdayTimeS22(e.target.value)}}
                              defaultValue={timeSlotArray[74]}
                            >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour3(!showWhour3)} className="me-3" />
                <h5 className="staff-name mb-1">Wednesday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour3 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e: any) =>{handleTime3(e); setIsWednesdayTimeS11(iswednesdayTimeS11 + 1); setWednesdayTimeS11(e.target.value);}}
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime3(e); setIsWednesdayTimeS12(iswednesdayTimeS12 + 1); setWednesdayTimeS12(e.target.value);}}
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour3(!addWhour3)}>
                        <span>{addWhour3 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour3 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                            <Form.Select className='form-select-solid' name="s2_start_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime3(e); setIsWednesdayTimeS21(iswednesdayTimeS21 + 1); setWednesdayTimeS21(e.target.value);}}
                              value={iswednesdayTimeS12 !== 0 ? wednesdayTimeS21 : timeSlotArray[58 + 4]}
                            >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                            <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example"
                              onChange={(e: any) => { handleTime3(e); setIsWednesdayTimeS22(iswednesdayTimeS22 + 1); setWednesdayTimeS22(e.target.value);}} 
                              defaultValue={timeSlotArray[74]}
                            >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour4(!showWhour4)} className="me-3" />
                <h5 className="staff-name mb-1">Thursday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour4 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime4(e); setIsThursdayTimeS11(isthursdayTimeS11 + 1); setThursdayTimeS11(e.target.value)}}
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime4(e);setIsThursdayTimeS12(isthursdayTimeS12 + 1); setThursdayTimeS12(e.target.value)}} 
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour4(!addWhour4)}>
                        <span>{addWhour4 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour4 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_start_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime4(e); setIsThursdayTimeS21(isthursdayTimeS21 + 1); setThursdayTimeS21(e.target.value)}}
                              value={isthursdayTimeS12 !== 0 ? thursdayTimeS21 : timeSlotArray[58 + 4]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_end_time"  aria-label="Default select example"
                              onChange={(e: any) => { handleTime4(e); setIsThursdayTimeS22(isthursdayTimeS22 + 1); setThursdayTimeS22(e.target.value);}}
                            defaultValue={timeSlotArray[74]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour5(!showWhour5)} className="me-3" />
                <h5 className="staff-name mb-1">Friday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour5 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime5(e); setIsFridayTimeS11(isfridayTimeS11 + 1); setFridayTimeS11(e.target.value)}}
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time"  aria-label="Default select example"
                        onChange={(e:any)=>{handleTime5(e); setIsFridayTimeS12(isfridayTimeS12 + 1); setFridayTimeS12(e.target.value);}}
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour5(!addWhour5)}>
                        <span>{addWhour5 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour5 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_start_time"  aria-label="Default select example"
                              onChange={(e:any)=>{handleTime5(e); setIsFridayTimeS21(isfridayTimeS21 + 1); setFridayTimeS21(e.target.value);}}
                              value={isfridayTimeS12 !== 0 ? fridayTimeS21 : timeSlotArray[58 + 4]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime5(e); setIsFridayTimeS22(isfridayTimeS22 + 1); setFridayTimeS22(e.target.value)}}
                              defaultValue={timeSlotArray[74]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          <div className="row align-items-center mb-5 p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour6(!showWhour6)}  className="me-3" />
                <h5 className="staff-name mb-1">Saturday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour6 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime6(e); setIsSaturdayTimeS11(issaturdayTimeS11 + 1); setSaturdayTimeS11(e.target.value)}}
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime6(e); setIsSaturdayTimeS12(issaturdayTimeS12 + 1); setSaturdayTimeS12(e.target.value);}}
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour6(!addWhour6)}>
                        <span>{addWhour6 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour6 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_start_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime6(e); setIsSaturdayTimeS21(issaturdayTimeS21  + 1); setSaturdayTimeS21(e.target.value);}}
                              value={issaturdayTimeS12 !== 0 ? saturdayTimeS21 : timeSlotArray[58 + 4]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime6(e); setIsSaturdayTimeS22(issaturdayTimeS22 + 1); setSaturdayTimeS22(e.target.value)}}
                              defaultValue={timeSlotArray[74]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          <div className="row align-items-center p-5 working-hour-item">
            <div className="col-md-4">
              <Form.Group className="staff d-flex align-items-center">
                <Form.Check type="checkbox" onClick={() => setShowWhour7(!showWhour7)} className="me-3" />
                <h5 className="staff-name mb-1">Sunday</h5>
              </Form.Group>
            </div>
            <div className="col-md-8">
              {showWhour7 ?
                (<div>
                  <Row>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Opening</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_start_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime7(e); setIsSundayTimeS11(issundayTimeS11+1); setSundayTimeS11(e.target.value);}}
                        defaultValue={timeSlotArray[38]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <span>-</span>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                      <Form.Label>Closing</Form.Label>
                      <Form.Select className='form-select-solid' name="s1_end_time" aria-label="Default select example"
                        onChange={(e:any)=>{handleTime7(e); setIsSundayTimeS12(issundayTimeS12+1); setSundayTimeS12(e.target.value);}}
                        defaultValue={timeSlotArray[58]}
                      >
                        {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                      <div onClick={() => setAddwhour7(!addWhour7)}>
                        <span>{addWhour7 ? <i className='fa fa-times cursor-pointer'></i> : <i className='fa fa-plus cursor-pointer'></i>}</span>
                      </div>
                    </Form.Group>
                    {addWhour7 &&
                      <div>
                        <Row className='mt-4'>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_start_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime7(e); setIsSundayTimeS21(issundayTimeS21+1); setSundayTimeS21(e.target.value);}}
                              value={issundayTimeS12 !== 0 ? sundayTimeS21 : timeSlotArray[58 + 4]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                          <Form.Group as={Col} sm={1} className="d-flex align-items-center" controlId="exampleForm.ControlInput1">
                            <span>-</span>
                          </Form.Group>
                          <Form.Group as={Col} sm={5} className="starttime" controlId="exampleForm.ControlInput1">
                          <Form.Select className='form-select-solid' name="s2_end_time" aria-label="Default select example"
                              onChange={(e:any)=>{handleTime7(e); setIsSundayTimeS22(issundayTimeS22 + 1); setSundayTimeS22(e.target.value)}}
                              defaultValue={timeSlotArray[74]}
                          >
                              {timeSlotArray.map((time) => <option value={time}>{time}</option>)}
                            </Form.Select>
                          </Form.Group>
                        </Row>
                      </div>
                    }
                  </Row>
                </div>)
                :
                (<div>
                  <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                </div>)
              }
            </div>
          </div>
          {/* <button onClick={handleSubmit}>process day</button> */}
      </div>
      <button onClick={handleSubmit} type='submit' className='btn btn-lg btn-primary steper-next-btn'>
          Continue
          <span className='indicator-label'>
            <KTSVG
               path='/media/icons/duotune/arrows/arr064.svg'
              className='svg-icon-3 ms-2 me-0'
            />
          </span>
        </button>
    </div>
    </div>
  )
}

export {Step7}
