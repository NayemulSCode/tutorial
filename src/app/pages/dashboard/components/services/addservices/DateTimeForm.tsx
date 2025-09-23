import moment from 'moment';
import React, { Fragment, useState } from 'react';
interface DateTimeField {
    date: string;
    time: string;
    day: string;
}
interface DateTimeFormProps {
    numberOfFields: number;
    occurrence: string;
    dateTimes: DateTimeField[];
    weekTimes: { date: string, day: string; time: string; sameOthers?: boolean }[];
    setDateTimes: React.Dispatch<React.SetStateAction<DateTimeField[]>>;
    setWeekTimes: React.Dispatch<React.SetStateAction<{ date: string, day: string; time: string; sameOthers?: boolean }[]>>;
    startDate?: string;
}

const DateTimeForm: React.FC<DateTimeFormProps> = ({
    numberOfFields,
    occurrence,
    dateTimes,
    weekTimes,
    setDateTimes,
    setWeekTimes,
    startDate,
}) => {
    const calculateDay = (date: string): string => {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const selectedDate = new Date(date);
        const dayIndex = selectedDate.getDay();
        return daysOfWeek[dayIndex];
    };
    const calculateFirstWeekDay = (date: string): string => {
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const currentDate = new Date(date);
        const currentDayIndex = currentDate.getDay();
        return dayOfWeek[currentDayIndex];
    }

    const handleDateTimeChange = (index: number, field: 'date' | 'time', value: string) => {
        const newDateTimes = [...dateTimes];
        const newDateTime = { ...newDateTimes[index], [field]: value };
        if (field === 'date') {
            // Update the day field when the date changes
            newDateTime.day = calculateDay(value);
            // For the first index, update startDate as well
            newDateTimes[0] = {
                date: startDate || '',
                day: calculateDay(startDate || ''),
                time: newDateTimes[0]?.time,
            };

        }
        newDateTimes[index] = newDateTime;
        setDateTimes(newDateTimes);
    };

    // Function to calculate the next occurrence of the selected day
    const calculateNextDate = (day: string, index: number): string => {
    const currentDate = new Date(startDate || '')
    if (isNaN(currentDate.getTime())) return '' // Check for an invalid start date

    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const dayIndex = dayOfWeek.indexOf(day)

    if (dayIndex === -1) return '' // If the day is invalid, return empty string

    // Calculate the next occurrence of the selected day
    const nextDate = new Date(currentDate)
    const offsetDays = (dayIndex - currentDate.getDay() + 7) % 7
    nextDate.setDate(currentDate.getDate() + index * 7 + offsetDays)

    // Format the date, return empty string if invalid
    const formattedDate = nextDate.toISOString().split('T')[0]
    return isNaN(nextDate.getTime()) ? '' : formattedDate
    }

    const handleWeekTimeChange = (index: number, day: string, time: string) => {
    const newWeekTimes = [...weekTimes]

    // Update the selected day and time for the current index
    newWeekTimes[index] = {
        day,
        time,
        sameOthers: newWeekTimes[index]?.sameOthers || false,
        date: '', // Initialize date as empty
    }

    // 1. Handling the first index (index === 0)
    if (index === 0) {
        const currentDate = new Date(startDate || '')
        const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const dayIndex = dayOfWeek.indexOf(day)

        if (startDate) {
        const nextDate = new Date(currentDate)
        nextDate.setDate(currentDate.getDate() + ((dayIndex - currentDate.getDay() + 7) % 7))

        const formattedDate = startDate
        newWeekTimes[0] = {
            ...newWeekTimes[0],
            day: calculateFirstWeekDay(startDate || ''),
            date: time ? `${formattedDate}` : formattedDate,
        }

        setWeekTimes(newWeekTimes)
        }
    }

    // 2. Handling other indices (index !== 0)
    if (index !== 0 && day) {
        const firstTime = newWeekTimes[0]?.time

        if (firstTime) {
        const updatedWeekTimes = newWeekTimes.map((item, idx) => {
            if (idx === index) {
            const calculatedDate = calculateNextDate(day, index)
            return {
                ...item,
                time,
                day,
                date: calculatedDate || '', // If date is invalid, set as empty string
            }
            }
            return item
        })

        setWeekTimes(updatedWeekTimes)
        } else {
        setWeekTimes(newWeekTimes)
        }
    }

    // Recalculate all dates when the first index time is updated
    if (index === 0 && time) {
        const recalculatedWeekTimes = newWeekTimes.map((item, idx) => {
        if (idx !== 0 && item.day) {
            const calculatedDate = calculateNextDate(item.day, idx)
            return {
            ...item,
            date: calculatedDate || '', // Ensure date is set to empty if invalid
            }
        }
        return item
        })

        setWeekTimes(recalculatedWeekTimes)
    }
    }



    const renderDateTimeFields = () => {
        const fields = [];
        for (let i = 0; i < numberOfFields; i++) {
            fields.push(
                <div key={i}>
                    <div className='row align-items-center mb-3'>
                        <div className="col-md-4">
                            <label className='form-label'>Date and Time #{i + 1}:</label>
                        </div>
                        <div className="col-md-4">
                            <input
                                className='form-control'
                                type="date"
                                value={i === 0 ? startDate || '' : dateTimes[i]?.date || ''}
                                onChange={(e) => handleDateTimeChange(i, 'date', e.target.value)}
                                disabled={i === 0}
                            />
                        </div>
                        <div className='col-md-4'>
                            <input
                                className='form-control'
                                type="time"
                                value={dateTimes[i]?.time || ''}
                                onChange={(e) => handleDateTimeChange(i, 'time', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        return fields;
    };
    const renderWeekTimeFiled = () => {
        const weekFields = [];
        for (let i = 0; i < numberOfFields; i++) {
            weekFields.push(
                <div key={i}>
                    <div className="row align-items-center mb-3">
                        <div className='col-md-3'>
                            <label className='form-label'>Weekday #{i + 1}:</label>
                        </div>
                        <div className='col-md-3'>
                            <select
                                className='form-select'
                                defaultValue={i === 0 ? calculateFirstWeekDay(startDate || '') : weekTimes[i]?.day || ''}
                                onChange={(e) => {
                                    const selectedDay = e.target.value;
                                    handleWeekTimeChange(i, selectedDay, weekTimes[i]?.time || '')
                                }}
                                disabled={i === 0}
                            >
                                <option value="">Select Day</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                        <div className='col-md-2'>
                            <label className='form-label'>Time #{i + 1}:</label>
                        </div>
                        <div className='col-md-4'>
                            <input
                                className='form-control'
                                type="time"
                                value={weekTimes[i]?.time || ''}
                                onChange={(e) => {
                                    const selectedTime = e.target.value;
                                    handleWeekTimeChange(i, weekTimes[i]?.day || '', selectedTime);
                                }}
                                disabled={i !== 0 && weekTimes[0]?.sameOthers}
                            />
                        </div>
                    </div>
                </div>
            );
        }
        return weekFields;
    };
    const renderPriviewSection = () => {
        if (occurrence === 'date') {
            return dateTimes.map((dayTime: any, index: number) => (
                <tr key={index} >
                    {index === 0 ? <>
                        <td className="ps-2 text-dark fw-bolder fs-8">{dayTime?.date ? moment(dayTime?.date).format('MM-DD-YYYY') : moment(startDate).format('MM-DD-YYYY')}</td>
                        <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.time ? moment(dayTime?.time, 'HH:mm').format('hh:mm A') : ""}</td>
                        <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.day ? dayTime?.day : calculateDay(startDate || "")}</td>
                        <td className="pe-2 text-end d-flex align-items-center justify-content-end">
                        </td>
                    </>
                        : <>
                            <td className="ps-2 text-dark fw-bolder fs-8">{dayTime?.date ? moment(dayTime?.date).format('MM-DD-YYYY'): ""}</td>
                            <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.time ? moment(dayTime?.time, 'HH:mm').format('hh:mm A'): ""}</td>
                            <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.day?? ""}</td>
                            <td className="pe-2 text-end d-flex align-items-center justify-content-end">
                            </td>
                        </>
                    }
                </tr>   
            ));
        } else if (occurrence === 'week') {
            return weekTimes.map((dayTime: any, index: number) => (
                <tr key={index}> 
                {index === 0 ? <>
                    <td className="ps-2 text-dark fw-bolder fs-8">{dayTime?.date ? moment(dayTime?.date).format('MM-DD-YYYY') : moment(startDate).format('MM-DD-YYYY')}</td>
                    <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.time ? moment(dayTime?.time, 'HH:mm').format('hh:mm A') : ""}</td>
                    <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.day?? ""}</td>
                </>
                :
                <>
                    <td className="ps-2 text-dark fw-bolder fs-8">{dayTime?.date ? moment(dayTime?.date).format('MM-DD-YYYY') : ""}</td>
                    <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.time ? moment(dayTime?.time, 'HH:mm').format('hh:mm A') : ""}</td>
                    <td className="p-2 text-dark fw-bolder fs-8">{dayTime?.day?? ""}</td>
                </>}
                </tr>
            ));
        }
    };
    return (<Fragment>
        <div className='row'>
            <div className='col-md-7'>
                <label className='form-label mb-4 sh_opening_label'>
                    Set your date and time to match your shop opening date and time.
                </label>
                {occurrence === 'date' && renderDateTimeFields()}
                {occurrence === 'week' && renderWeekTimeFiled()}
            </div>
            <div className='col-md-5'>
                <div className='table-responsive mb-3'>
                    <table className='table table-row-bordered table-row-gray-100 align-middle gs-0 mb-0'>
                        <thead>
                            <tr className='fw-bolder bg-light text-muted'>
                                <th className="ps-2">Date<span>(mm-dd-yyyy)</span></th>
                                <th className="ps-2">Time</th>
                                <th className="ps-2">Day</th>
                                <th className='pe-2 text-end rounded-end'></th>
                            </tr>
                        </thead>
                        <tbody>
                            {renderPriviewSection()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </Fragment>);
};

export default DateTimeForm;