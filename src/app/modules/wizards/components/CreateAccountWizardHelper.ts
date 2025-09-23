import * as Yup from 'yup'

export interface ICreateAccount {
  accountType: string
  serviceType: string
  accountTeamSize: string
  numberOfChairs: string

}

const createAccountSchemas = [
  Yup.object({
    accountType: Yup.string(),
  }),
  Yup.object({
    serviceType: Yup.string(),
  }),
  Yup.object({
    accountTeamSize: Yup.string(),
  }),
  Yup.object({
    numberOfChairs: Yup.string(),
  }),
  
]

const inits: ICreateAccount = {
  accountType: '',
  serviceType: '',
  accountTeamSize: '',
  numberOfChairs: ''
}

export {createAccountSchemas, inits}
