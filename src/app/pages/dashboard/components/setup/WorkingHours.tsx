import { useMutation, useQuery } from '@apollo/client';
import React,{FC,useEffect,useState} from 'react'
import { BUSINESS_SETUP_Q } from '../../../../../gql/Query';
import moment from 'moment';
import { Form, Button } from 'react-bootstrap-v5';
import { EditWorkingHours } from './EditWorkingHours';
import { WORKING_HOURS_UPDATE } from '../../../../../gql/Mutation';
import { NewWorkingHours } from './NewWorkingHours';

const WorkingHours:FC = () => {
    const [workingHours, setWorkingHours] = useState<any>();
    const [slotDuration, setSlotDuration] = useState<any>();
    // console.log('slotDuration', slotDuration)
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const { data: businessSetupData, loading } = useQuery(BUSINESS_SETUP_Q);
    const weekDay = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const today = weekDay[new Date().getDay()]
    const [uniq, setUniq] = useState<any>();
    const [close, setClose] = useState<any>([{
        day: ""
    }]);
    console.log("all working hours", workingHours)
    console.log("uniq day working hours", uniq)
    const [dayTimes, setDayTimes] = useState<any>()
    const getDailyTime = (type: string) => {
        setDayTimes(type)
    }
    // console.log("edit working time parent component", dayTimes)
    const res = (val:any) => Object.values(
        val?.reduce((groups:any, current:any) => {
            if (!groups[current.weekday]) {
                groups[current.weekday] = [];
            }
            groups[current.weekday].push(current);
            return groups;
        }, {})
    ).flatMap((value:any) => {
        if (value.length > 1) {
            return value.map((current:any, i:any, arr:any) => ({
                ...current,
                weekday: i + 1 > 1 ? "" : current.weekday
            }));
        }
        value.map((z:any) => {
            setClose([{ ...close, day: moment.weekdays().find((x) => x.toLowerCase() !== z.weekday) }])
        })
        return value;
    });
    useEffect(()=>{
        if (businessSetupData){
            // console.log("businessSetupData.businessSetting)",businessSetupData.businessSetting)
            setSlotDuration(businessSetupData.businessSetting.slot_duration);
            setWorkingHours(businessSetupData.businessSetting.work_hours);
            setUniq(res(businessSetupData.businessSetting.work_hours));
        }
    }, [businessSetupData])
    // find out close days
    const fitlerOnDay = uniq?.filter((day: any) => { return day.weekday !== "" });
    const mapOnDays = fitlerOnDay?.map((day:any) =>{return day.weekday});
    let filteredOffDay = weekDay.filter(day => !mapOnDays?.includes(day));
    // mutation
    // console.log("fitlerOnDa",fitlerOnDay)
    // console.log("mapOnDays",mapOnDays)
    // console.log("filteredOffDay",filteredOffDay)
    return (
        <>
        <div className="row">
            <div className="col-md-4 d-none">
                    <h2 className="sectionHeading">Business opening hours</h2>
                {
                    uniq?.length > 0 &&
                    uniq?.map((item:any) => (
                        <div className="row mb-1" key={item.id}>
                            <div className="col-md-4 timeWrap">
                                {item.weekday !== "" &&
                                    <>
                                        <i className="far fa-clock" />
                                        <span >{item.weekday}</span>
                                    </>
                                }
                            </div>
                            <div className="col-md-6 timeWrap">
                                <span>{`${moment.unix(item.s_time).format('h:mm a')} to ${moment.unix(item.e_time).format('h:mm a')}`}</span>
                            </div>
                        </div>
                    ))
                }
                {/* ------------------close day---------------------- */}
                {
                    filteredOffDay?.length > 0 &&
                    filteredOffDay?.map((item:any) => (
                        <div className="row mb-2" key={item}>
                            {
                                item &&
                                <>
                                    <div className="col-md-4 timeWrap">
                                        <i className="far fa-clock" />
                                        <span >{item}</span>
                                    </div>
                                    <div className="col-md-6 timeWrap">
                                        <span>Closed</span>
                                    </div>
                                </>
                            }
                        </div>
                    ))
                }
            </div>
            {
                    loading && (
                        <div className='m-0 m-auto'>
                            <div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div><div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div><div className="spinner-grow" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                        </div>
                    )
            }
            {/* if close all date */}
            {
                workingHours?.length === 0  && <div className='col-md-8'>
                    <NewWorkingHours />
                </div>
            }
            {/* wroking horus edit */}
                {uniq?.length > 0 &&<div className='col-md-8'>
                <EditWorkingHours 
                    getDailyTime={getDailyTime} 
                    uniq={uniq}
                    slotDuration = {slotDuration}
                    fitlerOnDay={fitlerOnDay}
                    mapOnDays={mapOnDays}
                    workingHours={workingHours}
                />
            </div>}
        </div>
        {/* <div >
            {isEdit === false && <Button onClick={() => setIsEdit(true)}>Edit</Button>}
        </div> */}
        {/* <div style={{marginTop: "-46px", marginLeft: "234px"}}>
            {isEdit == true && <Button onClick={() => setIsEdit(false)}>Close</Button>}
        </div> */}
        </>
    )
}

export default WorkingHours
