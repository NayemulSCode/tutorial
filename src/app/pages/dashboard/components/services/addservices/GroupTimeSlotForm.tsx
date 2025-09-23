import React, { useEffect, useState } from 'react';
import { GroupTimeSlot } from '../../../../../modules/generates.type';

interface GroupsTimeSlotType{
    groupTimeSlots: GroupTimeSlot[];
    setGroupTimeSlots: React.Dispatch<React.SetStateAction<{ id: number; hours: number; minutes: number }[]>>;
}

const GroupTimeSlotForm: React.FC<GroupsTimeSlotType> = ({ groupTimeSlots, setGroupTimeSlots }) => {
  const minutesPerQuarter = 15;
  const startHour = 8;
  const endHour = 24;

  useEffect(() => {
    // Set initial time for the first time slot when component mounts
    if (groupTimeSlots.length === 0) {
      setGroupTimeSlots([{ id: 1, hours: startHour, minutes: 0 }]);
    }
  }, [groupTimeSlots, setGroupTimeSlots]);

  const addTimeSlot = () => {
    const newId = groupTimeSlots.length + 1;
    setGroupTimeSlots([...groupTimeSlots, { id: newId, hours: startHour , minutes: 0 }]);
  };

  const removeTimeSlot = (id: number) => {
    setGroupTimeSlots(groupTimeSlots.filter(slot => slot.id !== id));
  };

  const formatTime = (hours: number, minutes: number) => {
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}`;
  };

  const handleTimeChange = (id: number, hours: number, minutes: number) => {
    setGroupTimeSlots(prevSlots =>
      prevSlots.map(slot => (slot.id === id ? { ...slot, hours, minutes } : slot))
    );
  };

    return (
        <div>
            <div className="time-slot-container">
                {groupTimeSlots.map((timeSlot) => (
                    <div key={timeSlot.id} className="time-slot row align-items-center mb-3">
                        <div className="col-md-2">
                            <label className='form-label' htmlFor={`timeSlotInput-${timeSlot.id}`}>Time Slot:</label>
                        </div>
                        <div className="col-md-3">
                            <select
                                className='form-select'
                                id={`timeSlotInput-${timeSlot.id}`}
                                name={`timeSlotInput-${timeSlot.id}`}
                                value={formatTime(timeSlot.hours, timeSlot.minutes)}
                                onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(':').map(Number);
                                    handleTimeChange(timeSlot.id, hours, minutes);
                                }}
                                required
                            >
                                 {Array.from({ length: (endHour - startHour) * (60 / minutesPerQuarter) }, (_, index) => {
                                    const hour = Math.floor((index * minutesPerQuarter) / 60) + startHour;
                                    const minute = (index * minutesPerQuarter) % 60;
                                    return (
                                    <option key={index} value={formatTime(hour, minute)}>
                                        {formatTime(hour, minute)}
                                    </option>
                                    );
                                })}
                            </select>
                        </div>
                        {groupTimeSlots.length > 1 && (
                            <div className="col-md-2">
                                <span
                                    className="remove-time-slot"
                                    onClick={() => removeTimeSlot(timeSlot.id)}
                                >
                                    <i className='far fa-trash-alt btn btn-icon btn-bg-light text-hover-primary btn-sm me-2 text-muted'></i>
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div>
                <button type="button" onClick={addTimeSlot} className='add-price-btn btn btn-light d-flex align-items-center px-4 py-2 mb-3'>
                    <i className="fa fa-plus-circle"></i>
                    <span>Add Time Slot</span>
                </button>
            </div>
        </div>
    );
};

export default GroupTimeSlotForm;
