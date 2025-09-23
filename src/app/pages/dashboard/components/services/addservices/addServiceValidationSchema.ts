import * as yup from 'yup'
export const addServiceValidationSchema = yup.object().shape({
  serviceName: yup.string().required('Service name is required'),
  // treatment: yup
  //     .string()
  //     .required("Treatment type is required"),
  serviceCategory: yup.string().required('Service category is required'),
  // staff: yup.bool()
  //     .oneOf([true], 'Accept Ts & Cs is required'),
  // .required('You must check minimun one staff'),

  is_personal: yup.boolean().default(false).required(),
  serviceDescription: yup.string().when('is_personal', {
    is: false,
    then: yup.string().required('Service description is required'),
  }),
  pricing: yup.array().when('is_personal', {
    is: false,
    then: yup.array().of(
      yup.object().shape({
        price: yup
          .number()
          .required()
          .typeError('price is required')
          .test('is-positive', 'Price must be a positive number', (value) => {
            return value === null || value === undefined || value > 0
          })
          .nullable(),
        specialPrice: yup
          .number()
          .nullable()
          .notRequired()
          .test({
            name: 'special-price',
            message: 'The special price is higher than the price',
            test: function () {
              const {price, specialPrice} = this.parent
              if (+specialPrice > price) {
                return false
              }
              return true
            },
          }),
      })
    ),
  }),
  guest_per_class: yup.string().when('group_service', {
    is: true,
    then: yup.string().required('Gest per class is required'),
  }),
  start_date: yup.string().when('group_service', {
    is: true,
    then: yup.string().required('Start date is required'),
  }),
  group_frequency: yup.string().when('repeated_group', {
    is: true,
    then: yup.string().required('Frequency is required'),
  }),
  sessions_per_course: yup.string().when('course', {
    is: true,
    then: yup.string().required('Sessions per course is required'),
  }),
  special_deposit: yup.string().when('is_special_deposit', {
    is: true,
    then: yup.string().required('Special deposit is required'),
  }),
})
