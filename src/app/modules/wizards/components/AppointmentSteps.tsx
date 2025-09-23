import React, {FC, useEffect, useRef, useState} from 'react'
import {Form,Card} from 'react-bootstrap-v5'
import {Link} from 'react-router-dom'


const AppointmentSteps: FC = () => {
  return (
    <>
    <section id="appointmentWrapper">
      <div className="">
        <div className="row">
          <div className="col-lg-8 ps-0 pe-4">
            <Card className="appointmentLeft">
                  <Form>
                    <div className="aptopbar mb-40">
                    <Form.Group className="date" controlId="exampleForm.ControlInput1">
                      <Form.Control type="date" />
                    </Form.Group>
                      <div className="repeatBtn">
                        <i className="fas fa-sync-alt"></i>
                        <Link to="/">Repeat</Link>
                      </div>
                    </div>
                    <div className="scheduleWrap">
                      <div className="scheduleInner">
                      <div className="row mb-40 schedulerow">
                          <div className="col-lg-4">
                            <div className="left">
                            <Form.Group className="starttime mb-5" controlId="exampleForm.ControlInput1">
                              <Form.Label>Start time</Form.Label>
                              <Form.Select aria-label="Default select example">
                                <option>16.00</option>
                                <option value="1">11.00</option>
                                <option value="2">12.00</option>
                                <option value="3">14.00</option>
                              </Form.Select>
                            </Form.Group>
                            <Form.Group className="duration mb-5" controlId="exampleForm.ControlInput1">
                              <Form.Label>Duration</Form.Label>
                              <Form.Select aria-label="Default select example">
                                <option></option>
                                <option value="1">40min</option>
                                <option value="2">30min</option>
                                <option value="3">1hr</option>
                              </Form.Select>
                            </Form.Group>
                            </div>
                          </div>
                        <div className="col-lg-8">
                          <div className="Right">
                            <Form.Group className="duration mb-5" controlId="exampleForm.ControlInput1">
                              <Form.Label>Service</Form.Label>
                              <Form.Select aria-label="Default select example">
                                <option>Chose a Service</option>
                                <option value="1">Women's Haircut(45 min,€30)</option>
                                <option value="2">Men's Cut(20 min,€90)</option>
                                <option value="3">Hair Colour(30 min,€80)</option>
                                <option value="4">Nails(1hr,€50)</option>
                              </Form.Select>
                            </Form.Group>
                            <Form.Group className="duration mb-5" controlId="exampleForm.ControlInput1">
                              <Form.Label>Staff</Form.Label>
                              <Form.Select aria-label="Default select example">
                                <option value="1">Select staff</option>
                                <option value="2">Hammad Rahman</option>
                                <option value="3">Wendy Smith</option>
                                <option value="4">Jhon Doe</option>
                              </Form.Select>
                            </Form.Group>
                          </div>
                        </div>
                        </div>
                        <div className="row">
                          <div className="notes">
                            <Form.Group className="date" controlId="exampleForm.ControlInput1">
                            <Form.Label>Appointment notes</Form.Label>
                            <Form.Control as="textarea" placeholder="add an appointment note(visible to staff only)" />
                            </Form.Group>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Form>
            </Card>
          </div>
          <div className="col-lg-4 pe-0 ps-3">
              <Card className="appointmentRight">
                <div className="head">
                  <div className="searchWrap">
                    <i className="fas fa-search"></i>
                    <input type="text" name="search" id="headerSearch" placeholder="Search Guest" />
                  </div>
                </div>
                <div className="body">
                  <div className="result">
                    <i className="fas fa-search"></i>
                    <span>Use the search to add a guest, or keep empty to save as walk-in.</span>
                  </div>
                </div>
                <div className="footer">
                  <h6>Total: Free (0min)</h6>
                  <div className="apnBtn">
                    <button type="submit">Express Checkout</button>
                    <button type="submit">Save appointment</button>
                  </div>
                </div>
              </Card>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export { AppointmentSteps}
