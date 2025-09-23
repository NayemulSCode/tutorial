import React, { ChangeEvent, FC, Fragment, useContext } from 'react'
import { Col, Form } from 'react-bootstrap-v5';
import { frequency, occurrence } from '../../../../modules/util';
import { ShouldRepeated } from '../../../../modules/generates.type';
import { AppContext } from '../../../../../context/Context';
type ShouldRepeat={
    client: any;
    shouldRepeatedGuest: boolean;
    setShouldRepeatedGuest:(x:boolean)=>void;
    shouldRepeatedInfo: ShouldRepeated;
    setShouldRepeatedInfo: React.Dispatch<React.SetStateAction<{occurrences: string, frequency: string}>>;
}
const GuestShouldRepeated: FC<ShouldRepeat> = ({ client, shouldRepeatedGuest, setShouldRepeatedGuest, shouldRepeatedInfo, setShouldRepeatedInfo }) => {
    const { guests, groupInfo, } = useContext(AppContext);
    console.log("🚀 ~ file: GuestShouldRepeated.tsx:13 ~ groupInfo:", groupInfo)
    const handleOccurrencesChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShouldRepeatedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFrequencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setShouldRepeatedInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (<Fragment>
        <div className='row p-3'>
          <Form.Group as={Col} md={4}>
              <Form.Check
                  type='switch'
                  name='repeated_group'
                  id={`repeated-group`} // Ensure unique IDs
                  label='Repeated Group'
                  checked
                  //defaultChecked={client?.group_type === "repeated_group " ? true : false}
                //   onChange={() => {
                //       setShouldRepeatedGuest(true);
                //   }}
                  className='single_group_switch flex-column-reverse rpt_switch'
              />
          </Form.Group>
          {shouldRepeatedGuest &&
            <>
                <Form.Group as={Col} sm={4} className=''>
                    <Form.Label className='occrance_label'>Frequency</Form.Label>
                    <Form.Select className='occurance_select' name='frequency'
                        onChange={handleFrequencyChange}
                        defaultValue={client?.frequency != "" ? client?.frequency  : groupInfo.frequency}
                        disabled
                      >
                        {
                        //     <option
                        //     key={client?.frequency}
                        //     value={client?.frequency}
                        // >
                        //     {client?.frequency}
                        // </option>
                        // {
                            frequency &&
                            frequency.map((frequency) => (
                                <option
                                    key={frequency.id}
                                    value={frequency.value}
                                >
                                    {frequency.value}
                                </option>
                            ))
                        }
                    </Form.Select>
                </Form.Group>
                    <Form.Group as={Col} sm={4} className=''>
                        <Form.Label className='occrance_label'>Occurrences</Form.Label>
                        <Form.Select
                            className='occurance_select'
                            name='occurrences'
                            onChange={handleOccurrencesChange}
                            defaultValue={client?.occurrences || ""} // Set the value attribute
                        >
                            <option value='' selected disabled>
                                Choose
                            </option>
                            {occurrence &&
                                occurrence
                                    .filter((item) => item.value <= (groupInfo?.occurrences || 0))
                                    .map((occurrenceItem) => (
                                        <option
                                            key={occurrenceItem.id}
                                            value={occurrenceItem.value}
                                        >
                                            {occurrenceItem.value}
                                        </option>
                                    ))}
                        </Form.Select>
                    </Form.Group>

            </>
          }
        </div>
    </Fragment>)
}

export default GuestShouldRepeated