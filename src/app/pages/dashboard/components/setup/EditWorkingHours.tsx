import React, { FC, useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { Field, ErrorMessage } from 'formik'
import { Card, Button, Form, Container, Row, Col, InputGroup, Dropdown, DropdownButton, Tab, Nav, FormLabel } from "react-bootstrap-v5";
import { useEffect } from 'react';
import moment, { unix } from 'moment';
import { WORKING_HOURS_UPDATE } from '../../../../../gql/Mutation';
import { useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import { BUSINESS_SETUP_Q } from '../../../../../gql/Query';
import { useHistory } from 'react-router-dom';
import {useSelector} from 'react-redux'
import {RootState} from '../../../../../setup'
import {OnboardingUnlockKeys} from '../../../../modules/onboarding/onboardingSlice'

type Props = {
    getDailyTime: (type: string) => void
    slotDuration: any
    uniq:(type:any)=> void
    fitlerOnDay:(type: any) => void
    mapOnDays:(type: any) => void
    workingHours:(type: Array<any>) => void
}
const timeSlotArray = ["00:00","06:00","06:15", "06:30", "06:45","07:00","07:15", "07:30", "07:45","08:00", "08:15", "08:30", "08:45", "09:00",
    "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00",
    "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45", "17:00", "17:15", "17:30", "17:45", "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00",
    "21:15", "21:30", "21:45", "22:00", "22:15", "22:30", "22:45", "23:00", "23:15", "23:30", "23:45"
]

const EditWorkingHours: FC<Props> = ({ getDailyTime, uniq, fitlerOnDay, mapOnDays, workingHours, slotDuration }) => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const {unlockedItems} = useSelector((state: RootState) => state.onboarding)
    const [loading, setLoading] = useState<boolean>(false);
    const weekDay = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    // console.log("filter on day", fitlerOnDay);
    // console.log("toal day slot", uniq);
    const [onDays, setOnDays] = useState<any>(fitlerOnDay);
    // console.log("slotDuration", slotDuration);
    const [onlyDayName, setOnlyDayName] = useState<any>(workingHours);
    const [closeDays, setCloseDays] = useState<boolean>(false);
    const Monday = onlyDayName?.filter((i: any) => { return i.weekday === "monday"});
    const Tuesday = onlyDayName?.filter((i: any) => { return i.weekday === "tuesday"});
    const Wednesday = onlyDayName?.filter((i: any) => { return i.weekday === "wednesday"});
    const Thursday = onlyDayName?.filter((i: any) => { return i.weekday === "thursday"});
    const Friday = onlyDayName?.filter((i: any) => { return i.weekday === "friday"});
    const Saturday = onlyDayName?.filter((i: any) => { return i.weekday === "saturday"});
    const Sunday = onlyDayName?.filter((i: any) => { return i.weekday === "sunday"});
    // console.log("monday--", Monday)
    // console.log("tuesday--", Tuesday)
    // console.log("Wednesday--", Wednesday)
    // console.log("Thursday--", Thursday)
    // console.log("Friday--", Friday)
    // console.log("Saturday--", Saturday)
    // console.log("Sunday--", Sunday)
    
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

    // editable value for Monday
    const [mondaySlotOneStime, setMondaySlotOneStime] = useState<string>("");
    const [mondaySlotOneEtime, setMondaySlotOneSEtime] = useState<string>("");
    const [mondaySlotTwoStime, setMondaySlotTwoStime] = useState<string>("");
    const [mondaySlotTwoEtime, setMondaySlotTwoSEtime] = useState<string>("");
    const [unChanged, setUnChanged] = useState<object>({})
    const [timeChange1,setTimeChange1] = useState<number>(0);
    const [timeChange2,setTimeChange2] = useState<number>(0);
    const [timeChange3,setTimeChange3] = useState<number>(0);
    const [timeChange4,setTimeChange4] = useState<number>(0);
    // add custom duration
    const [cDuration, setCDuration] = useState<string>("")

    // console.log("2nd slot added", addWhour1)
    // console.log("monday slot one", timeChange1,timeChange2, mondaySlotOneStime, mondaySlotOneEtime, mondaySlotTwoStime, mondaySlotTwoEtime)
    
    // console.log("monday slot one",mondaySlotOneStime, mondaySlotOneEtime, mondaySlotTwoStime, mondaySlotTwoEtime)
    // console.log("working time ",workingTime)
    // console.log("unchange object ",unChanged)
    // console.log("time change state 0 for no change ",timeChange1,timeChange2,timeChange3,timeChange4)
    
    const deleteSlotMonday=()=>{
        const cmst = moment.unix(Monday[0]?.s_time).utcOffset('+0000').format('HH:mm')
        const cmet = moment.unix(Monday[0]?.e_time).utcOffset('+0000').format('HH:mm')
        setMondaySlotOneStime(cmst);
        setMondaySlotOneSEtime(cmet);
        if (timeChange1 !== 0 && timeChange2 === 0) {
            const newObject = { ...unChanged, s1_start_time: mondaySlotOneStime }
            setUnChanged(newObject)
        }
        if (timeChange2 !== 0 && timeChange1 === 0) {
            const newObject = { ...unChanged, s1_end_time: mondaySlotOneEtime }
            setUnChanged(newObject)
        }
        if (timeChange1 === 0 && timeChange2 === 0) {
            const newObject = {
                s1_start_time: cmst,
                s1_end_time: cmet,
            }
            setUnChanged(newObject)
        }
    }
    useEffect(() => {
        //monday 
        if (Monday.length === 2 && Monday.length !== 0) {
            console.log('monday length 2---')
            setShowWhour1(true);
            setAddwhour1(true);
            const cmst = moment.unix(Monday[0]?.s_time).utcOffset('+0000').format('HH:mm')
            const cmet =  moment.unix(Monday[0]?.e_time).utcOffset('+0000').format('HH:mm')
            setMondaySlotOneStime(cmst);
            setMondaySlotOneSEtime(cmet);
            const cmstwot =  moment.unix(Monday[1]?.s_time).utcOffset('+0000').format('HH:mm')
            const cmetwot = moment.unix(Monday[1]?.e_time).utcOffset('+0000').format('HH:mm')
            setMondaySlotTwoStime(cmstwot);
            setMondaySlotTwoSEtime(cmetwot);
            if (timeChange1 !== 0 && timeChange2 === 0 && timeChange3 === 0 && timeChange4 === 0) {
                const newObject = { ...unChanged, s1_start_time: mondaySlotOneStime }
                setUnChanged(newObject)
                console.log("first field edit", newObject)
            }
            if (timeChange2 !== 0 && timeChange1 === 0 && timeChange3 === 0 && timeChange4 === 0) {
                const newObject = { ...unChanged, s1_end_time: mondaySlotOneEtime }
                setUnChanged(newObject)
                 console.log("2nd field edit", newObject)
            }
            // section 2
            if (timeChange3 !== 0 && timeChange1 === 0 && timeChange2 === 0 && timeChange4 === 0) {
                const newObject = { ...unChanged, s2_start_time: mondaySlotTwoStime }
                setUnChanged(newObject)
                 console.log("3rd field edit", newObject)
            }
            if (timeChange4 !== 0 && timeChange1 === 0 && timeChange2 === 0 && timeChange3 === 0) {
                const newObject = { ...unChanged, s2_end_time: mondaySlotTwoEtime }
                setUnChanged(newObject)
                 console.log("4th field edit", newObject)
            }
            if (timeChange1 === 0 && timeChange2 === 0 && timeChange3 === 0 && timeChange4 === 0) {
                const newObject = {
                    s1_start_time: cmst,
                    s1_end_time: cmet,
                    s2_start_time: cmstwot,
                    s2_end_time: cmetwot
                }
                setUnChanged(newObject)
            }
        }else{
           deleteSlotMonday();
        }
        if (Monday.length === 1 && Monday.length !== 0) {
            // console.log('monday length 1---')
            setShowWhour1(true);
             const cmst = moment.unix(Monday[0]?.s_time).utcOffset('+0000').format('HH:mm')
            const cmet =  moment.unix(Monday[0]?.e_time).utcOffset('+0000').format('HH:mm')
            setMondaySlotOneStime(cmst);
            setMondaySlotOneSEtime(cmet);
            if (timeChange1 !== 0 && timeChange2 === 0) {
                const newObject = { ...unChanged, s1_start_time: mondaySlotOneStime}
                setUnChanged(newObject)
            }
            if (timeChange2 !== 0 && timeChange1 === 0) {
                const newObject = { ...unChanged, s1_end_time: mondaySlotOneEtime }
                setUnChanged(newObject)
            }
            if (timeChange1 === 0 && timeChange2 === 0 ) {
                const newObject = {
                    s1_start_time: cmst,
                    s1_end_time: cmet,
                }
                setUnChanged(newObject)
            }
            if(addWhour1 === true){
                // section 2
                if (timeChange3 !== 0 && timeChange1 === 0 && timeChange2 === 0 && timeChange4 === 0) {
                    const newObject = { ...unChanged, s2_start_time: mondaySlotTwoStime }
                    setUnChanged(newObject)
                }
                if (timeChange4 !== 0 && timeChange1 === 0 && timeChange2 === 0 && timeChange3 === 0) {
                    const newObject = { ...unChanged, s2_end_time: mondaySlotTwoEtime }
                    setUnChanged(newObject)
                }
            }
        }
        
    }, [onlyDayName, timeChange1, timeChange2, timeChange3, timeChange4]);
    // end of monday
    // start Tuesday
    const [tuesdaySlotOneStime, setTuesdaySlotOneStime] = useState<string>("");
    const [tuesdaySlotOneEtime, setTuesdaySlotOneSEtime] = useState<string>("");
    const [tuesdaySlotTwoStime, setTuesdaySlotTwoStime] = useState<string>("");
    const [tuesdaySlotTwoEtime, setTuesdaySlotTwoSEtime] = useState<string>("");
    const [tuesdayUpdate1, setTuesdayUpdate1] = useState<object>({});

    const [tuesdayChange1, setTuesdayChange1] = useState<number>(0);
    const [tuesdayChange2, setTuesdayChange2] = useState<number>(0);
    const [tuesdayChange3, setTuesdayChange3] = useState<number>(0);
    const [tuesdayChange4, setTuesdayChange4] = useState<number>(0);
    const deleteSlotTuesday=()=>{
        const ctust = moment.unix(Tuesday[0]?.s_time).utcOffset('+0000').format('HH:mm')
        const ctuet =moment.unix(Tuesday[0]?.e_time).utcOffset('+0000').format('HH:mm')
        setTuesdaySlotOneStime(ctust);
        setTuesdaySlotOneSEtime(ctuet);
        if (tuesdayChange1 !== 0 && tuesdayChange2 === 0) {
            const newObject = { ...tuesdayUpdate1, s1_start_time: tuesdaySlotOneStime }
            setTuesdayUpdate1(newObject)
        }
        if (tuesdayChange1 === 0 && tuesdayChange2 !== 0) {
            const newObject = { ...tuesdayUpdate1, s1_end_time: tuesdaySlotOneEtime }
            setTuesdayUpdate1(newObject)
        }

        if (tuesdayChange1 === 0 && tuesdayChange2 === 0) {
            const newObject = {
                s1_start_time: ctust,
                s1_end_time: ctuet,
            }
            setTuesdayUpdate1(newObject)
        }
    }
    // console.log('tuesdayUpdate1', tuesdayUpdate1)
    useEffect(()=>{
        //Tuesday
        if (Tuesday.length === 2 && Tuesday.length !== 0) {
            setShowWhour2(true);
            setAddwhour2(true);
            const tust = Tuesday[0].s_time
            const ctust = moment.unix(tust).format("HH:mm")
            const tuet = Tuesday[0].e_time
            const ctuet = moment.unix(tuet).format("HH:mm")
            setTuesdaySlotOneStime(ctust);
            setTuesdaySlotOneSEtime(ctuet);
            const tustwot = Tuesday[1].s_time
            const ctustwot = moment.unix(tustwot).format("HH:mm")
            const tuetwot = Tuesday[1].e_time
            const ctuetwot = moment.unix(tuetwot).format("HH:mm")
            setTuesdaySlotTwoStime(ctustwot);
            setTuesdaySlotTwoSEtime(ctuetwot);
            if (tuesdayChange1 !== 0 && tuesdayChange2 === 0 && tuesdayChange3 === 0 && tuesdayChange4 === 0) {
                const newObject = { ...tuesdayUpdate1, s1_start_time: tuesdaySlotOneStime}
                setTuesdayUpdate1(newObject)
            }
            if (tuesdayChange1 === 0 && tuesdayChange2 !== 0 && tuesdayChange3 === 0 && tuesdayChange4 === 0) {
                const newObject = { ...tuesdayUpdate1, s1_end_time: tuesdaySlotOneEtime }
                setTuesdayUpdate1(newObject)
            }
            // section 2
            if (tuesdayChange1 === 0 && tuesdayChange2 === 0 && tuesdayChange3 !== 0 && tuesdayChange4 === 0) {
                const newObject = { ...tuesdayUpdate1, s2_start_time: tuesdaySlotTwoStime }
                setTuesdayUpdate1(newObject)
            }
            if (tuesdayChange1 === 0 && tuesdayChange2 === 0 && tuesdayChange3 === 0 && tuesdayChange4 !== 0) {
                const newObject = { ...tuesdayUpdate1, s2_end_time: tuesdaySlotTwoEtime }
                setTuesdayUpdate1(newObject)
            }
            if (tuesdayChange1 === 0 && tuesdayChange2 === 0 && tuesdayChange3 === 0 && tuesdayChange4 === 0) {
                const newObject = {
                    s1_start_time: moment.unix(Tuesday[0]?.s_time).utcOffset('+0000').format('HH:mm'),
                    s1_end_time: moment.unix(Tuesday[0]?.e_time).utcOffset('+0000').format('HH:mm'),
                    s2_start_time: moment.unix(Tuesday[1]?.s_time).utcOffset('+0000').format('HH:mm'),
                    s2_end_time: moment.unix(Tuesday[1]?.e_time).utcOffset('+0000').format('HH:mm')
                }
                setTuesdayUpdate1(newObject)
            }
        }
        if (Tuesday.length === 1 && Tuesday.length !== 0) {
            setShowWhour2(true);
            const tust = Tuesday[0].s_time
            const ctust = moment.unix(tust).format("HH:mm")
            const tuet = Tuesday[0].e_time
            const ctuet = moment.unix(tuet).format("HH:mm")
            setTuesdaySlotOneStime(ctust);
            setTuesdaySlotOneSEtime(ctuet);
            if (tuesdayChange1 !== 0 && tuesdayChange2 === 0) {
                const newObject = { ...tuesdayUpdate1, s1_start_time: tuesdaySlotOneStime }
                setTuesdayUpdate1(newObject)
            }
            if (tuesdayChange1 === 0 && tuesdayChange2 !== 0) {
                const newObject = { ...tuesdayUpdate1, s1_end_time: tuesdaySlotOneEtime }
                setTuesdayUpdate1(newObject)
            }
            if (tuesdayChange1 === 0 && tuesdayChange2 === 0) {
                const newObject = {
                    s1_start_time:  moment.unix(Tuesday[0]?.s_time).utcOffset('+0000').format('HH:mm'),
                    s1_end_time: moment.unix(Tuesday[0]?.e_time).utcOffset('+0000').format('HH:mm'),
                }
                setTuesdayUpdate1(newObject)
            }
            if(addWhour2 === true){
                // section 2
                if (tuesdayChange1 === 0 && tuesdayChange2 === 0 && tuesdayChange3 !== 0 && tuesdayChange4 === 0) {
                    const newObject = { ...tuesdayUpdate1, s2_start_time: tuesdaySlotTwoStime }
                    setTuesdayUpdate1(newObject)
                }
                if (tuesdayChange1 === 0 && tuesdayChange2 === 0 && tuesdayChange3 === 0 && tuesdayChange4 !== 0) {
                    const newObject = { ...tuesdayUpdate1, s2_end_time: tuesdaySlotTwoEtime }
                    setTuesdayUpdate1(newObject)
                }
            }
        }
        
    }, [onlyDayName, tuesdayChange1, tuesdayChange2, tuesdayChange3, tuesdayChange4])
    
    // end Tuesday
    // start Wednesday
    const [wednesdaySlotOneStime, setWednesdaySlotOneStime] = useState<string>("");
    const [wednesdaySlotOneSEtime, setWednesdaySlotOneSEtime] = useState<string>("");
    const [wednesdaySlotTwoStime, setWednesdaySlotTwoStime] = useState<string>("");
    const [wednesdaySlotTwoSEtime, setWednesdaySlotTwoSEtime] = useState<string>("");
    const [wednesDayUpdate, setWednesDayUpdate] = useState<object>({});
    const [timeChangeW1, setTimeChangeW1] = useState<number>(0);
    const [timeChangeW2, setTimeChangeW2] = useState<number>(0);
    const [timeChangeW3, setTimeChangeW3] = useState<number>(0);
    const [timeChangeW4, setTimeChangeW4] = useState<number>(0);
    const deleteSlotWednesday=()=>{
        const cwst = moment.unix(Wednesday[0]?.s_time).utcOffset('+0000').format('HH:mm')
        const cwet = moment.unix(Wednesday[0]?.e_time).utcOffset('+0000').format('HH:mm')
        setWednesdaySlotOneStime(cwst);
        setWednesdaySlotOneSEtime(cwet);
        if (timeChangeW1 !== 0 && timeChangeW2 === 0) {
            const newObject = { ...wednesDayUpdate, s1_start_time: wednesdaySlotOneStime, }
            setWednesDayUpdate(newObject)
        }
        if (timeChangeW2 !== 0 && timeChangeW1 === 0) {
            const newObject = { ...wednesDayUpdate, s1_end_time: wednesdaySlotOneSEtime }
            setWednesDayUpdate(newObject)
        }
        if (timeChangeW1 === 0 && timeChangeW2 === 0) {
            const newObject = {
                s1_start_time: cwst,
                s1_end_time: cwet,
            }
            setWednesDayUpdate(newObject)
        }
    }
    useEffect(()=>{
        //Wednesday
        if (Wednesday.length === 2 && Wednesday.length !== 0) {
            setShowWhour3(true);
            setAddwhour3(true);
            // slot 1
            const cwst = moment.unix(Wednesday[0]?.s_time).utcOffset('+0000').format('HH:mm')
            const cwet = moment.unix(Wednesday[0]?.e_time).utcOffset('+0000').format('HH:mm')
            setWednesdaySlotOneStime(cwst);
            setWednesdaySlotOneSEtime(cwet);
            // slot 2
            const cw2st = moment.unix(Wednesday[1]?.s_time).utcOffset('+0000').format('HH:mm')
            const cw2et = moment.unix(Wednesday[1]?.e_time).utcOffset('+0000').format('HH:mm')
            setWednesdaySlotTwoStime(cw2st);
            setWednesdaySlotTwoSEtime(cw2et);
            if (timeChangeW1 !== 0 && timeChangeW2 === 0 && timeChangeW3 === 0 && timeChangeW4 === 0) {
                const newObject = { ...wednesDayUpdate, s1_start_time: wednesdaySlotOneStime }
                setWednesDayUpdate(newObject)
            }
            if (timeChangeW1 === 0 && timeChangeW2 !== 0 && timeChangeW3 === 0 && timeChangeW4 === 0) {
                const newObject = { ...wednesDayUpdate, s1_end_time: wednesdaySlotOneSEtime }
                setWednesDayUpdate(newObject)
            }
            // section 2
            if (timeChangeW1 === 0 && timeChangeW2 === 0 && timeChangeW3 !== 0 && timeChangeW4 === 0) {
                const newObject = { ...wednesDayUpdate, s2_start_time: wednesdaySlotTwoStime }
                setWednesDayUpdate(newObject)
            }
            if (timeChangeW1 === 0 && timeChangeW2 === 0 && timeChangeW3 === 0 && timeChangeW4 !== 0) {
                const newObject = { ...wednesDayUpdate, s2_end_time: wednesdaySlotTwoSEtime }
                setWednesDayUpdate(newObject)
            }
            if (timeChangeW1 === 0 && timeChangeW2 === 0 && timeChangeW3 === 0 && timeChangeW4 === 0) {
                const newObject = {
                    s1_start_time: cwst,
                    s1_end_time: cwet,
                    s2_start_time: cw2st,
                    s2_end_time: cw2et
                }
                setWednesDayUpdate(newObject)
            }
        }
        else{
            deleteSlotWednesday()
        }
        if (Wednesday.length === 1 && Wednesday.length !== 0) {
            setShowWhour3(true);
            const cwst = moment.unix(Wednesday[0]?.s_time).utcOffset('+0000').format('HH:mm')
            const cwet = moment.unix(Wednesday[0]?.e_time).utcOffset('+0000').format('HH:mm')
            setWednesdaySlotOneStime(cwst);
            setWednesdaySlotOneSEtime(cwet);
            if (timeChangeW1 !== 0 && timeChangeW2 === 0) {
                const newObject = { ...wednesDayUpdate, s1_start_time: wednesdaySlotOneStime, }
                setWednesDayUpdate(newObject)
            }
            if (timeChangeW2 !== 0 && timeChangeW1 === 0) {
                const newObject = { ...wednesDayUpdate, s1_end_time: wednesdaySlotOneSEtime }
                setWednesDayUpdate(newObject)
            }
            if (timeChangeW1 === 0 && timeChangeW2 === 0) {
                const newObject = {
                    s1_start_time: cwst,
                    s1_end_time: cwet,
                }
                setWednesDayUpdate(newObject)
            }
            if(addWhour3 === true ){
                // section 2
                if (timeChangeW1 === 0 && timeChangeW2 === 0 && timeChangeW3 !== 0 && timeChangeW4 === 0) {
                    const newObject = { ...wednesDayUpdate, s2_start_time: wednesdaySlotTwoStime }
                    setWednesDayUpdate(newObject)
                }
                if (timeChangeW1 === 0 && timeChangeW2 === 0 && timeChangeW3 === 0 && timeChangeW4 !== 0) {
                    const newObject = { ...wednesDayUpdate, s2_end_time: wednesdaySlotTwoSEtime }
                    setWednesDayUpdate(newObject)
                }
            }
        }
        
    }, [onlyDayName, timeChangeW1, timeChangeW2, timeChangeW3, timeChangeW4])
    // end Wednesday
    // start Thursday
    const [thursdaySlotOneStime, setThursdaySlotOneStime] = useState<string>("");
    const [thursdaySlotOneSEtime, setThursdaySlotOneSEtime] = useState<string>("");
    const [thursdaySlotTwoStime, setThursdaySlotTwoStime] = useState<string>("");
    const [thursdaySlotTwoSEtime, setThursdaySlotTwoSEtime] = useState<string>("");
    const [thursdayUpdate, setThursdayUpdate] = useState<object>({});
    const [thursdayTime1, setThursdayTime1] = useState<number>(0);
    const [thursdayTime2, setThursdayTime2] = useState<number>(0);
    const [thursdayTime3, setThursdayTime3] = useState<number>(0);
    const [thursdayTime4, setThursdayTime4] = useState<number>(0);
    const deleteSlotThursday=()=>{
        const cthst = moment.unix(Thursday[0]?.s_time).utcOffset('+0000').format('HH:mm');
        const cthet = moment.unix(Thursday[0]?.e_time).utcOffset('+0000').format('HH:mm');
        setThursdaySlotOneStime(cthst);
        setThursdaySlotOneSEtime(cthet);
        if (thursdayTime1 !== 0 && thursdayTime2 === 0) {
            const newObject = { ...thursdayUpdate, s1_start_time: thursdaySlotOneStime }
            setThursdayUpdate(newObject)
        }
        if (thursdayTime1 === 0 && thursdayTime2 !== 0) {
            const newObject = { ...thursdayUpdate, s1_end_time: thursdaySlotOneSEtime }
            setThursdayUpdate(newObject)
        }
        if (thursdayTime1 === 0 && thursdayTime2 === 0) {
            const newObject = {
                s1_start_time: cthst,
                s1_end_time: cthet
            }
            setThursdayUpdate(newObject)
        }
    }
    useEffect(()=>{
        if (Thursday.length === 2 && Thursday.length !== 0) {
            setShowWhour4(true);
            setAddwhour4(true);
            // slot 1
            const cthst = moment.unix(Thursday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const cthet = moment.unix(Thursday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setThursdaySlotOneStime(cthst);
            setThursdaySlotOneSEtime(cthet);
            // slot 2
            const cth2st = moment.unix(Thursday[1]?.s_time).utcOffset('+0000').format('HH:mm');
            const cth2et = moment.unix(Thursday[1]?.e_time).utcOffset('+0000').format('HH:mm');
            setThursdaySlotTwoStime(cth2st);
            setThursdaySlotTwoSEtime(cth2et);
            if (thursdayTime1 !== 0 && thursdayTime2 === 0 && thursdayTime3 === 0 && thursdayTime4 === 0) {
                const newObject = { ...thursdayUpdate, s1_start_time: thursdaySlotOneStime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 !== 0 && thursdayTime3 === 0 && thursdayTime4 === 0) {
                const newObject = { ...thursdayUpdate, s1_end_time: thursdaySlotOneSEtime }
                setThursdayUpdate(newObject)
            }
            // section 2
            if (thursdayTime1 === 0 && thursdayTime2 === 0 && thursdayTime3 !== 0 && thursdayTime4 === 0) {
                const newObject = { ...thursdayUpdate, s2_start_time: thursdaySlotTwoStime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 === 0 && thursdayTime3 === 0 && thursdayTime4 !== 0) {
                const newObject = { ...thursdayUpdate, s2_end_time: thursdaySlotTwoSEtime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 === 0 && thursdayTime3 === 0 && thursdayTime4 === 0) {
                const newObject = {
                    s1_start_time: cthst,
                    s1_end_time: cthet,
                    s2_start_time: cth2st,
                    s2_end_time: cth2et
                }
                setThursdayUpdate(newObject)
            }
        }
        else{
            deleteSlotThursday()
        }
        if (Thursday.length === 1 && Thursday.length !== 0) {
            setShowWhour4(true);
            // slot 1
            const cthst = moment.unix(Thursday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const cthet = moment.unix(Thursday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setThursdaySlotOneStime(cthst);
            setThursdaySlotOneSEtime(cthet);
            if (thursdayTime1 !== 0 && thursdayTime2 === 0) {
                const newObject = { ...thursdayUpdate, s1_start_time: thursdaySlotOneStime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 !== 0) {
                const newObject = { ...thursdayUpdate, s1_end_time: thursdaySlotOneSEtime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 === 0) {
                const newObject = {
                    s1_start_time: cthst,
                    s1_end_time: cthet
                }
                setThursdayUpdate(newObject)
            }
        }
        if(addWhour4 === true){
            // section 2
            if (thursdayTime1 === 0 && thursdayTime2 === 0 && thursdayTime3 !== 0 && thursdayTime4 === 0) {
                const newObject = { ...thursdayUpdate, s2_start_time: thursdaySlotTwoStime }
                setThursdayUpdate(newObject)
            }
            if (thursdayTime1 === 0 && thursdayTime2 === 0 && thursdayTime3 === 0 && thursdayTime4 !== 0) {
                const newObject = { ...thursdayUpdate, s2_end_time: thursdaySlotTwoSEtime }
                setThursdayUpdate(newObject)
            }
        }
    }, [onlyDayName, thursdayTime1, thursdayTime2, thursdayTime3, thursdayTime4])
    // end Thursday
    // start Friday
    const [fridaySlotOneStime, setFridaySlotOneStime] = useState<string>("");
    const [fridaySlotOneSEtime, setFridaySlotOneSEtime] = useState<string>("");
    const [fridaySlotTwoStime, setFridaySlotTwoStime] = useState<string>("");
    const [fridaySlotTwoSEtime, setFridaySlotTwoSEtime] = useState<string>("");
    const [fridayUpdate, setFridayUpdate] = useState<object>({});
    const [fridayTime1, setFridayTime1] = useState<number>(0);
    const [fridayTime2, setFridayTime2] = useState<number>(0);
    const [fridayTime3, setFridayTime3] = useState<number>(0);
    const [fridayTime4, setFridayTime4] = useState<number>(0);
    const deleteSlotFriday=()=>{
        const cfrst = moment.unix(Friday[0]?.s_time).utcOffset('+0000').format('HH:mm');
        const cfret = moment.unix(Friday[0]?.e_time).utcOffset('+0000').format('HH:mm');
        setFridaySlotOneStime(cfrst);
        setFridaySlotOneSEtime(cfret);
        if (fridayTime1 !== 0 && fridayTime2 === 0) {
            const newObject = { ...fridayUpdate, s1_start_time: fridaySlotOneStime }
            setFridayUpdate(newObject)
        }
        if (fridayTime1 === 0 && fridayTime2 !== 0) {
            const newObject = { ...fridayUpdate, s1_end_time: fridaySlotOneSEtime }
            setFridayUpdate(newObject)
        }
        if (fridayTime1 === 0 && fridayTime2 === 0) {
            const newObject = {
                s1_start_time: cfrst,
                s1_end_time: cfret
            }
            setFridayUpdate(newObject)
        }
    }
    console.log('setFridayUpdate', fridayUpdate)
    useEffect(()=>{
        if (Friday.length === 2 && Friday.length !== 0) {
            setShowWhour5(true);
            setAddwhour5(true);
            // slot 1
            const cfrst = moment.unix(Friday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const cfret = moment.unix(Friday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setFridaySlotOneStime(cfrst);
            setFridaySlotOneSEtime(cfret);
            // slot 2
            const cfr2st = moment.unix(Friday[1]?.s_time).utcOffset('+0000').format('HH:mm');
            const cfr2et = moment.unix(Friday[1]?.e_time).utcOffset('+0000').format('HH:mm');
            setFridaySlotTwoStime(cfr2st);
            setFridaySlotTwoSEtime(cfr2et);
            if (fridayTime1 !== 0 && fridayTime2 === 0 && fridayTime3 === 0 && fridayTime4 === 0) {
                const newObject = { ...fridayUpdate, s1_start_time: fridaySlotOneStime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 !== 0 && fridayTime3 === 0 && fridayTime4 === 0) {
                const newObject = { ...fridayUpdate, s1_end_time: fridaySlotOneSEtime }
                setFridayUpdate(newObject)
            }
            // section 2
            if (fridayTime1 === 0 && fridayTime2 === 0 && fridayTime3 !== 0 && fridayTime4 === 0) {
                const newObject = { ...fridayUpdate, s2_start_time: fridaySlotTwoStime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 === 0 && fridayTime3 === 0 && fridayTime4 !== 0) {
                const newObject = { ...fridayUpdate, s2_end_time: fridaySlotTwoSEtime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 === 0 && fridayTime3 === 0 && fridayTime4 === 0) {
                const newObject = {
                    s1_start_time: cfrst,
                    s1_end_time: cfret,
                    s2_start_time: cfr2st,
                    s2_end_time: cfr2et
                }
                setFridayUpdate(newObject)
            }
        }else{
            deleteSlotFriday();
        }
        if (Friday.length === 1 && Friday.length !== 0) {
            setShowWhour5(true);
            // slot 1
            const cfrst = moment.unix(Friday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const cfret = moment.unix(Friday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setFridaySlotOneStime(cfrst);
            setFridaySlotOneSEtime(cfret);
            if (fridayTime1 !== 0 && fridayTime2 === 0) {
                const newObject = { ...fridayUpdate, s1_start_time: fridaySlotOneStime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 !== 0) {
                const newObject = { ...fridayUpdate, s1_end_time: fridaySlotOneSEtime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 === 0) {
                const newObject = {
                    s1_start_time: cfrst,
                    s1_end_time: cfret
                }
                setFridayUpdate(newObject)
            }
        }
        if (addWhour5 === true) {
            // section 2
            if (fridayTime1 === 0 && fridayTime2 === 0 && fridayTime3 !== 0 && fridayTime4 === 0) {
                const newObject = { ...fridayUpdate, s2_start_time: fridaySlotTwoStime }
                setFridayUpdate(newObject)
            }
            if (fridayTime1 === 0 && fridayTime2 === 0 && fridayTime3 === 0 && fridayTime4 !== 0) {
                const newObject = { ...fridayUpdate, s2_end_time: fridaySlotTwoSEtime }
                setFridayUpdate(newObject)
            }
        }
    }, [onlyDayName, fridayTime1, fridayTime2, fridayTime3, fridayTime4]);
    // end friday
    // start saturday
    const [saturdaySlotOneStime, setSaturdaySlotOneStime] = useState<string>("");
    const [saturdaySlotOneSEtime, setSaturdaySlotOneSEtime] = useState<string>("");
    const [saturdaySlotTwoStime, setSaturdaySlotTwoStime] = useState<string>("");
    const [saturdaySlotTwoSEtime, setSaturdaySlotTwoSEtime] = useState<string>("");
    const [saturdayTime1, setSaturdayTime1] = useState<number>(0);
    const [saturdayTime2, setSaturdayTime2] = useState<number>(0);
    const [saturdayTime3, setSaturdayTime3] = useState<number>(0);
    const [saturdayTime4, setSaturdayTime4] = useState<number>(0);
    const [saturdayUpdate, setSaturdayUpdate] = useState<object>({})
    const deleteSlotSaturday=()=>{
        const csast = moment.unix(Saturday[0]?.s_time).utcOffset('+0000').format('HH:mm');
        const csaet = moment.unix(Saturday[0]?.e_time).utcOffset('+0000').format('HH:mm');
        setSaturdaySlotOneStime(csast);
        setSaturdaySlotOneSEtime(csaet);
        if (saturdayTime1 !== 0 && saturdayTime2 === 0) {
            const newObject = { ...saturdayUpdate, s1_start_time: saturdaySlotOneStime }
            setSaturdayUpdate(newObject)
        }
        if (saturdayTime1 === 0 && saturdayTime2 !== 0) {
            const newObject = { ...saturdayUpdate, s1_end_time: saturdaySlotOneSEtime }
            setSaturdayUpdate(newObject)
        }
        if (saturdayTime1 === 0 && saturdayTime2 === 0) {
            const newObject = {
                s1_start_time: csast,
                s1_end_time: csaet
            }
            setSaturdayUpdate(newObject)
        }
    }
    useEffect(()=>{
        if (Saturday.length === 2 && Saturday.length !== 0) {
            setShowWhour6(true);
            setAddwhour6(true);
            // slot 1
            const csast = moment.unix(Saturday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const csaet = moment.unix(Saturday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setSaturdaySlotOneStime(csast);
            setSaturdaySlotOneSEtime(csaet);
            // slot 2
            const csa2st = moment.unix(Saturday[1]?.s_time).utcOffset('+0000').format('HH:mm');
            const csa2et = moment.unix(Saturday[1]?.e_time).utcOffset('+0000').format('HH:mm');
            setSaturdaySlotTwoStime(csa2st);
            setSaturdaySlotTwoSEtime(csa2et);
            if (saturdayTime1 !== 0 && saturdayTime2 === 0 && saturdayTime3 === 0 && saturdayTime4 === 0) {
                const newObject = { ...saturdayUpdate, s1_start_time: saturdaySlotOneStime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 !== 0 && saturdayTime3 === 0 && saturdayTime4 === 0) {
                const newObject = { ...saturdayUpdate, s1_end_time: saturdaySlotOneSEtime }
                setSaturdayUpdate(newObject)
            }
            // section 2
            if (saturdayTime1 === 0 && saturdayTime2 === 0 && saturdayTime3 !== 0 && saturdayTime4 === 0) {
                const newObject = { ...saturdayUpdate, s2_start_time: saturdaySlotTwoStime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 === 0 && saturdayTime3 === 0 && saturdayTime4 !== 0) {
                const newObject = { ...saturdayUpdate, s2_end_time: saturdaySlotTwoSEtime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 === 0 && saturdayTime3 === 0 && saturdayTime4 === 0) {
                const newObject = {
                    s1_start_time: csast,
                    s1_end_time: csaet,
                    s2_start_time: csa2st,
                    s2_end_time: csa2et
                }
                setSaturdayUpdate(newObject)
            }
        }
        else{
            deleteSlotSaturday();
        }
        if (Saturday.length === 1 && Saturday.length !== 0) {
            setShowWhour6(true);
            // slot 1
            const csast = moment.unix(Saturday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const csaet = moment.unix(Saturday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setSaturdaySlotOneStime(csast);
            setSaturdaySlotOneSEtime(csaet);
            if (saturdayTime1 !== 0 && saturdayTime2 === 0) {
                const newObject = { ...saturdayUpdate, s1_start_time: saturdaySlotOneStime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 !== 0) {
                const newObject = { ...saturdayUpdate, s1_end_time: saturdaySlotOneSEtime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 === 0) {
                const newObject = {
                    s1_start_time: csast,
                    s1_end_time: csaet
                }
                setSaturdayUpdate(newObject)
            }
        }
        if (addWhour6 === true) {
            // section 2
            if (saturdayTime1 === 0 && saturdayTime2 === 0 && saturdayTime3 !== 0 && saturdayTime4 === 0) {
                const newObject = { ...saturdayUpdate, s2_start_time: saturdaySlotTwoStime }
                setSaturdayUpdate(newObject)
            }
            if (saturdayTime1 === 0 && saturdayTime2 === 0 && saturdayTime3 === 0 && saturdayTime4 !== 0) {
                const newObject = { ...saturdayUpdate, s2_end_time: saturdaySlotTwoSEtime }
                setSaturdayUpdate(newObject)
            }
        }
    }, [onlyDayName, saturdayTime1, saturdayTime2, saturdayTime3, saturdayTime4])
    // end saturday

    // start sunday
    const [sundaySlotOneStime, setSundaySlotOneStime] = useState<string>("");
    const [sundaySlotOneSEtime, setSundaySlotOneSEtime] = useState<string>("");
    const [sundaySlotTwoStime, setSundaySlotTwoStime] = useState<string>("");
    const [sundaySlotTwoSEtime, setSundaySlotTwoSEtime] = useState<string>("");
    const [sundayTime1, setSundayTime1] = useState<number>(0);
    const [sundayTime2, setSundayTime2] = useState<number>(0);
    const [sundayTime3, setSundayTime3] = useState<number>(0);
    const [sundayTime4, setSundayTime4] = useState<number>(0);
    const [sundayUpdate, setSundayUpdate] = useState<object>({});
    const deleteSlotSunday=()=>{
        const csust = moment.unix(Sunday[0]?.s_time).utcOffset('+0000').format('HH:mm');
        const csuet = moment.unix(Sunday[0]?.e_time).utcOffset('+0000').format('HH:mm');
        setSundaySlotOneStime(csust);
        setSundaySlotOneSEtime(csuet);
        if (sundayTime1 !== 0 && sundayTime2 === 0) {
            const newObject = { ...sundayUpdate, s1_start_time: sundaySlotOneStime }
            setSundayUpdate(newObject)
        }
        if (sundayTime1 === 0 && sundayTime2 !== 0) {
            const newObject = { ...sundayUpdate, s1_end_time: sundaySlotOneSEtime }
            setSundayUpdate(newObject)
        }
        if (sundayTime1 === 0 && sundayTime2 === 0) {
            const newObject = {
                s1_start_time: csust,
                s1_end_time: csuet
            }
            setSundayUpdate(newObject)
        }
    }
    useEffect(() => {
        if (Sunday.length === 2 && Sunday.length !== 0) {
            setShowWhour7(true);
            setAddwhour7(true);
            // slot 1
            const csust = moment.unix(Sunday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const csuet = moment.unix(Sunday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setSundaySlotOneStime(csust);
            setSundaySlotOneSEtime(csuet);
            // slot 2
            const csu2st = moment.unix(Sunday[1]?.s_time).utcOffset('+0000').format('HH:mm');
            const csu2et = moment.unix(Sunday[1]?.e_time).utcOffset('+0000').format('HH:mm');
            setSundaySlotTwoStime(csu2st);
            setSundaySlotTwoSEtime(csu2et);

            if (sundayTime1 !== 0 && sundayTime2 === 0 && sundayTime3 === 0 && sundayTime4 === 0) {
                const newObject = { ...sundayUpdate, s1_start_time: sundaySlotOneStime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 !== 0 && sundayTime3 === 0 && sundayTime4 === 0) {
                const newObject = { ...sundayUpdate, s1_end_time: sundaySlotOneSEtime }
                setSundayUpdate(newObject)
            }
            // section 2
            if (sundayTime1 === 0 && sundayTime2 === 0 && sundayTime3 !== 0 && sundayTime4 === 0) {
                const newObject = { ...sundayUpdate, s2_start_time: sundaySlotTwoStime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 === 0 && sundayTime3 === 0 && sundayTime4 !== 0) {
                const newObject = { ...sundayUpdate, s2_end_time: sundaySlotTwoSEtime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 === 0 && sundayTime3 === 0 && sundayTime4 === 0) {
                const newObject = {
                    s1_start_time: csust,
                    s1_end_time: csuet,
                    s2_start_time: csu2st,
                    s2_end_time: csu2et
                }
                setSundayUpdate(newObject)
            }
        }
        else{
            deleteSlotSunday()
        }
        if (Sunday.length === 1 && Sunday.length !== 0) {
            setShowWhour7(true);
            // slot 1
           const csust = moment.unix(Sunday[0]?.s_time).utcOffset('+0000').format('HH:mm');
            const csuet = moment.unix(Sunday[0]?.e_time).utcOffset('+0000').format('HH:mm');
            setSundaySlotOneStime(csust);
            setSundaySlotOneSEtime(csuet);
            if (sundayTime1 !== 0 && sundayTime2 === 0) {
                const newObject = { ...sundayUpdate, s1_start_time: sundaySlotOneStime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 !== 0) {
                const newObject = { ...sundayUpdate, s1_end_time: sundaySlotOneSEtime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 === 0) {
                const newObject = {
                    s1_start_time: csust,
                    s1_end_time: csuet
                }
                setSundayUpdate(newObject)
            }
        }
        if (addWhour7 === true) {
            // section 2
            if (sundayTime1 === 0 && sundayTime2 === 0 && sundayTime3 !== 0 && sundayTime4 === 0) {
                const newObject = { ...sundayUpdate, s2_start_time: sundaySlotTwoStime }
                setSundayUpdate(newObject)
            }
            if (sundayTime1 === 0 && sundayTime2 === 0 && sundayTime3 === 0 && sundayTime4 !== 0) {
                const newObject = { ...sundayUpdate, s2_end_time: sundaySlotTwoSEtime }
                setSundayUpdate(newObject)
            }
        }
    }, [onlyDayName, sundayTime1, sundayTime2, sundayTime3, sundayTime4])
    //end sunday

    const handleTime = (e: any) => {
        const { name, value } = e.target;
        setWorkingTime((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        });
    }
    const handleTime2 = (e: any) => {
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
    const handleTime7 = (e: any) => {
        const { name, value } = e.target;
        setWorkingTime7((preValue) => {
            return {
                ...preValue,
                [name]: value
            }
        })
    }
    const [updateBusinessWorkingHour] = useMutation(WORKING_HOURS_UPDATE,{
        refetchQueries: [{ query: BUSINESS_SETUP_Q }],
        awaitRefetchQueries: true,
    });

    const handleSubmit = () => {
        // setLoading(true);
        const newObj = [
            {
                monday: Monday.length === 0 ? workingTime : showWhour1 === true? unChanged : {}
            },
            {
                tuesday: Tuesday.length === 0 ?  workingTime2 : showWhour2 === true ? tuesdayUpdate1 : {}
            },
            {
                wednesday: Wednesday.length === 0 ? workingTime3 : showWhour3 === true ? wednesDayUpdate : {}
            },
            {
                thursday: Thursday.length === 0 ?  workingTime4 : showWhour4 === true ? thursdayUpdate : {}
            },
            {
                friday: Friday.length === 0 ? workingTime5 : showWhour5 === true ? fridayUpdate : {}
            },
            {
                saturday: Saturday.length === 0 ?  workingTime6 : showWhour6 === true? saturdayUpdate : {}
            },
            {
                sunday: Sunday.length === 0? workingTime7 : showWhour7 === true? sundayUpdate: {}
            }
        ]
        setWorkingDays(newObj);
        console.log("edited day", JSON.stringify(newObj))

        updateBusinessWorkingHour({
            variables: {
                daily_work_hours: JSON.stringify(newObj),
                slot_duration: cDuration ? cDuration : slotDuration ? slotDuration : "30"
            }
        }).then(({ data }) => {
            if (data?.updateBusinessWorkingHour?.status === 1) {
                enqueueSnackbar(data?.updateBusinessWorkingHour?.message, {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                    transitionDuration: {
                        enter: 300,
                        exit: 500
                    }
                });
                setLoading(false);
                history.push('/business/settings')
            }
        })
    }
    getDailyTime(JSON.stringify(workingDays))

    return (
      <div className='w-100'>
        <div className='flex-stack business_details_header mb-3'>
          <div className='mr-2'>
            <button
              onClick={() => {
                history.push('/business/settings')
              }}
              type='button'
              className='btn btn-lg btn-light-primary me-3'
              data-kt-stepper-action='previous'
            >
              <KTSVG path='/media/icons/duotune/arrows/arr063.svg' className='svg-icon-4 me-1' />
            </button>
          </div>
          <h1 className='me-4 mb-0'> Working Hours</h1>
        </div>
        <>
          <div className='d-flex align-items-center mb-3'>
            <h5 className='staff-name me-3' style={{whiteSpace: 'nowrap'}}>
              Set Your Booking Time Slots
            </h5>
            <Form.Select
              className='form-select-solid'
              name='slot_duration'
              defaultValue={slotDuration}
              onChange={(e: any) => {
                setCDuration(e.target.value)
              }}
            >
              <option value='15'>15</option>
              <option value='30'>30</option>
              <option value='45'>45</option>
              <option value='60'>60</option>
              <option value='90'>90</option>
              <option value='120'>120</option>
              <option value='150'>150</option>
              <option value='180'>180</option>
            </Form.Select>
          </div>
        </>

        <div className='mb-0 fv-row'>
          <div className='mb-0 working-hour-wrap'>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour1 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour1(!showWhour1)}
                      type='checkbox'
                      defaultChecked
                      name='monday'
                      value='monday'
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour1(!showWhour1)}
                      type='checkbox'
                      name='monday'
                      value='monday'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Monday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour1 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          onLoad={(e) => {
                            handleTime(e)
                          }}
                          onChange={(e: any) => {
                            handleTime(e)
                            setMondaySlotOneStime(e.target.value)
                            setTimeChange1(timeChange1 + 1)
                            setTimeChange2(0)
                            setTimeChange3(0)
                            setTimeChange4(0)
                          }}
                          defaultValue={moment
                            .unix(Monday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          aria-label='Default select example'
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          defaultValue={moment
                            .unix(Monday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          className='form-select-solid'
                          name='s1_end_time'
                          onChange={(e: any) => {
                            handleTime(e)
                            setMondaySlotOneSEtime(e.target.value)
                            setTimeChange2(timeChange2 + 1)
                            setTimeChange1(0)
                            setTimeChange3(0)
                            setTimeChange4(0)
                          }}
                          aria-label='Default select example'
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour1 ? (
                          <div
                            onClick={() => {
                              setAddwhour1(!addWhour1)
                              deleteSlotMonday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour1(!addWhour1)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour1 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                defaultValue={moment
                                  .unix(Monday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                className='form-select-solid'
                                name='s2_start_time'
                                onChange={(e: any) => {
                                  handleTime(e)
                                  setMondaySlotTwoStime(e.target.value)
                                  setTimeChange3(timeChange3 + 1)
                                  setTimeChange1(0)
                                  setTimeChange2(0)
                                  setTimeChange4(0)
                                }}
                                aria-label='Default select example'
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                defaultValue={moment
                                  .unix(Monday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                className='form-select-solid'
                                name='s2_end_time'
                                onChange={(e: any) => {
                                  handleTime(e)
                                  setMondaySlotTwoSEtime(e.target.value)
                                  setTimeChange4(timeChange4 + 1)
                                  setTimeChange1(0)
                                  setTimeChange2(0)
                                  setTimeChange3(0)
                                }}
                                aria-label='Default select example'
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour2 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour2(!showWhour2)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour2(!showWhour2)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Tuesday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour2 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Tuesday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime2(e)
                            setTuesdaySlotOneStime(e.target.value)
                            setTuesdayChange1(tuesdayChange1 + 1)
                            setTuesdayChange2(0)
                            setTuesdayChange3(0)
                            setTuesdayChange4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Tuesday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime2(e)
                            setTuesdaySlotOneSEtime(e.target.value)
                            setTuesdayChange1(0)
                            setTuesdayChange2(tuesdayChange2 + 1)
                            setTuesdayChange3(0)
                            setTuesdayChange4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour2 ? (
                          <div
                            onClick={() => {
                              setAddwhour2(!addWhour2)
                              deleteSlotTuesday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour2(!addWhour2)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour2 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Tuesday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime2(e)
                                  setTuesdaySlotTwoStime(e.target.value)
                                  setTuesdayChange1(0)
                                  setTuesdayChange2(0)
                                  setTuesdayChange3(tuesdayChange3 + 1)
                                  setTuesdayChange4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Tuesday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime2(e)
                                  setTuesdaySlotTwoSEtime(e.target.value)
                                  setTuesdayChange1(0)
                                  setTuesdayChange2(0)
                                  setTuesdayChange3(0)
                                  setTuesdayChange4(tuesdayChange4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour3 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour3(!showWhour3)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour3(!showWhour3)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Wednesday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour3 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Wednesday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime3(e)
                            setWednesdaySlotOneStime(e.target.value)
                            setTimeChangeW1(timeChangeW1 + 1)
                            setTimeChangeW2(0)
                            setTimeChangeW3(0)
                            setTimeChangeW4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Wednesday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime3(e)
                            setWednesdaySlotOneSEtime(e.target.value)
                            setTimeChangeW1(0)
                            setTimeChangeW2(timeChangeW2 + 1)
                            setTimeChangeW3(0)
                            setTimeChangeW4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour3 ? (
                          <div
                            onClick={() => {
                              setAddwhour3(!addWhour3)
                              deleteSlotWednesday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour3(!addWhour3)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour3 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Wednesday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime3(e)
                                  setWednesdaySlotTwoStime(e.target.value)
                                  setTimeChangeW1(0)
                                  setTimeChangeW2(0)
                                  setTimeChangeW3(timeChangeW3 + 1)
                                  setTimeChangeW4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Wednesday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime3(e)
                                  setWednesdaySlotTwoSEtime(e.target.value)
                                  setTimeChangeW1(0)
                                  setTimeChangeW2(0)
                                  setTimeChangeW3(0)
                                  setTimeChangeW4(timeChangeW4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour4 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour4(!showWhour4)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour4(!showWhour4)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Thursday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour4 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Thursday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime4(e)
                            setThursdaySlotOneStime(e.target.value)
                            setThursdayTime1(thursdayTime1 + 1)
                            setThursdayTime2(0)
                            setThursdayTime3(0)
                            setThursdayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Thursday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime4(e)
                            setThursdaySlotOneSEtime(e.target.value)
                            setThursdayTime1(0)
                            setThursdayTime2(thursdayTime2 + 1)
                            setThursdayTime3(0)
                            setThursdayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour4 ? (
                          <div
                            onClick={() => {
                              setAddwhour4(!addWhour4)
                              deleteSlotThursday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour4(!addWhour4)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour4 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Thursday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime4(e)
                                  setThursdaySlotTwoStime(e.target.value)
                                  setThursdayTime1(0)
                                  setThursdayTime2(0)
                                  setThursdayTime3(thursdayTime3 + 1)
                                  setThursdayTime4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Thursday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime4(e)
                                  setThursdaySlotTwoSEtime(e.target.value)
                                  setThursdayTime1(0)
                                  setThursdayTime2(0)
                                  setThursdayTime3(0)
                                  setThursdayTime4(thursdayTime4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour5 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour5(!showWhour5)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour5(!showWhour5)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Friday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour5 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Friday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime5(e)
                            setFridaySlotOneStime(e.target.value)
                            setFridayTime1(fridayTime1 + 1)
                            setFridayTime2(0)
                            setFridayTime3(0)
                            setFridayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Friday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime5(e)
                            setFridaySlotOneSEtime(e.target.value)
                            setFridayTime1(0)
                            setFridayTime2(fridayTime2 + 1)
                            setFridayTime3(0)
                            setFridayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour5 ? (
                          <div
                            onClick={() => {
                              setAddwhour5(!addWhour5)
                              deleteSlotFriday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour5(!addWhour5)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour5 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Friday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime5(e)
                                  setFridaySlotTwoStime(e.target.value)
                                  setFridayTime1(0)
                                  setFridayTime2(0)
                                  setFridayTime3(fridayTime3 + 1)
                                  setFridayTime4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Friday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime5(e)
                                  setFridaySlotTwoSEtime(e.target.value)
                                  setFridayTime1(0)
                                  setFridayTime2(0)
                                  setFridayTime3(0)
                                  setFridayTime4(fridayTime4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center mb-5 p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour6 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour6(!showWhour6)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour6(!showWhour6)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Saturday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour6 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Saturday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime6(e)
                            setSaturdaySlotOneStime(e.target.value)
                            setSaturdayTime1(saturdayTime1 + 1)
                            setSaturdayTime2(0)
                            setSaturdayTime3(0)
                            setSaturdayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Saturday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime6(e)
                            setSaturdaySlotOneSEtime(e.target.value)
                            setSaturdayTime1(0)
                            setSaturdayTime2(saturdayTime2 + 1)
                            setSaturdayTime3(0)
                            setSaturdayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour6 ? (
                          <div
                            onClick={() => {
                              setAddwhour6(!addWhour6)
                              deleteSlotSaturday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour6(!addWhour6)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour6 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Saturday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime6(e)
                                  setSaturdaySlotTwoStime(e.target.value)
                                  setSaturdayTime1(0)
                                  setSaturdayTime2(0)
                                  setSaturdayTime3(saturdayTime3 + 1)
                                  setSaturdayTime4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Saturday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime6(e)
                                  setSaturdaySlotTwoSEtime(e.target.value)
                                  setSaturdayTime1(0)
                                  setSaturdayTime2(0)
                                  setSaturdayTime3(0)
                                  setSaturdayTime4(saturdayTime4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
            <div className='row align-items-center p-5 working-hour-item'>
              <div className='col-md-4'>
                <Form.Group className='staff d-flex align-items-center'>
                  {showWhour7 === true ? (
                    <Form.Check
                      onClick={() => setShowWhour7(!showWhour7)}
                      type='checkbox'
                      defaultChecked
                      className='me-3'
                    />
                  ) : (
                    <Form.Check
                      onClick={() => setShowWhour7(!showWhour7)}
                      type='checkbox'
                      className='me-3'
                    />
                  )}
                  <h5 className='staff-name mb-1'>Sunday</h5>
                </Form.Group>
              </div>
              <div className='col-md-8'>
                {showWhour7 ? (
                  <div>
                    <Row>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_start_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Sunday[0]?.s_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime7(e)
                            setSundaySlotOneStime(e.target.value)
                            setSundayTime1(sundayTime1 + 1)
                            setSundayTime2(0)
                            setSundayTime3(0)
                            setSundayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        <span>-</span>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={5}
                        className='starttime'
                        controlId='exampleForm.ControlInput1'
                      >
                        <Form.Select
                          className='form-select-solid'
                          name='s1_end_time'
                          aria-label='Default select example'
                          defaultValue={moment
                            .unix(Sunday[0]?.e_time)
                            .utcOffset('+0000')
                            .format('HH:mm')}
                          onChange={(e: any) => {
                            handleTime7(e)
                            setSundaySlotOneSEtime(e.target.value)
                            setSundayTime1(0)
                            setSundayTime2(sundayTime2 + 1)
                            setSundayTime3(0)
                            setSundayTime4(0)
                          }}
                        >
                          {timeSlotArray.map((time) => (
                            <option value={time}>{time}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        sm={1}
                        className='d-flex align-items-center'
                        controlId='exampleForm.ControlInput1'
                      >
                        {addWhour7 ? (
                          <div
                            onClick={() => {
                              setAddwhour7(!addWhour7)
                              deleteSlotSunday()
                            }}
                          >
                            <span>
                              <i className='fa fa-times cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setAddwhour7(!addWhour7)
                            }}
                          >
                            <span>
                              <i className='fa fa-plus cursor-pointer'></i>{' '}
                            </span>
                          </div>
                        )}
                      </Form.Group>
                      {addWhour7 && (
                        <div>
                          <Row className='mt-4'>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_start_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Sunday[1]?.s_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime7(e)
                                  setSundaySlotTwoStime(e.target.value)
                                  setSundayTime1(0)
                                  setSundayTime2(0)
                                  setSundayTime3(sundayTime3 + 1)
                                  setSundayTime4(0)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={1}
                              className='d-flex align-items-center'
                              controlId='exampleForm.ControlInput1'
                            >
                              <span>-</span>
                            </Form.Group>
                            <Form.Group
                              as={Col}
                              sm={5}
                              className='starttime'
                              controlId='exampleForm.ControlInput1'
                            >
                              <Form.Select
                                className='form-select-solid'
                                name='s2_end_time'
                                aria-label='Default select example'
                                defaultValue={moment
                                  .unix(Sunday[1]?.e_time)
                                  .utcOffset('+0000')
                                  .format('HH:mm')}
                                onChange={(e: any) => {
                                  handleTime7(e)
                                  setSundaySlotTwoSEtime(e.target.value)
                                  setSundayTime1(0)
                                  setSundayTime2(0)
                                  setSundayTime3(0)
                                  setSundayTime4(sundayTime4 + 1)
                                }}
                              >
                                {timeSlotArray.map((time) => (
                                  <option value={time}>{time}</option>
                                ))}
                              </Form.Select>
                            </Form.Group>
                          </Row>
                        </div>
                      )}
                    </Row>
                  </div>
                ) : (
                  <div>
                    <span className='text-gray-400 fw-bold fs-6'>Closed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button
          className='btn btn-primary mt-4 text-gray-400 fw-bold fs-6'
          style={{marginLeft: '10px'}}
          onClick={handleSubmit}
          disabled={loading || !unlockedItems.includes(OnboardingUnlockKeys.WORKING_HOURS_EDIT_BUTTON)}
        >
          {!unlockedItems.includes(OnboardingUnlockKeys.WORKING_HOURS_EDIT_BUTTON) && "Complete onboarding to enable"}
          {unlockedItems.includes(OnboardingUnlockKeys.WORKING_HOURS_EDIT_BUTTON) && !loading && <span className='indicator-label'>Save</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Saving...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      </div>
    )
}

export { EditWorkingHours }
