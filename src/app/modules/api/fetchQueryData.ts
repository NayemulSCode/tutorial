import { useQuery } from "@apollo/client";
import { SINGLE_APPOINTMENT, SINGLE_SERVICE, STAFF_WISE_APPOINTMENT } from "../../../gql/Query";
import { CONFLICT_CHECKING } from "../../../gql/Mutation";

export const useStaffWiseAappointment = (staffId:any, charisId:any) => {
    const { data, error, loading } = useQuery(STAFF_WISE_APPOINTMENT, {
        variables: {
            staff_id: +staffId,
            chair_id: +charisId
        },
        fetchPolicy: "network-only"
    });

    return { data, error, loading };
};
// single service data
export const useService = (serviceId:any) => {
    const { data: singleServiceData, error: singleServiceError, loading: singleServiceLoading } = useQuery(SINGLE_SERVICE, {
        variables: {
            id: +serviceId
        },
        fetchPolicy: 'network-only'
    })

    return { singleServiceData, singleServiceError, singleServiceLoading };
};

// appointment details fetcher
export const useAppointmentDetails = (appointmentId: string | number, shouldFetch: boolean) => {
    // const shouldFetch = Boolean(appointmentId); // Add your additional condition here

    const { data: appointmentDetails, error: appointmentDetailsError, loading: appointmentDetailsLoading /* , refetch: singleAppointmentFetch */, } = useQuery(SINGLE_APPOINTMENT, {
        variables: {
            id: shouldFetch ? +appointmentId : undefined,
        },
        fetchPolicy: 'network-only',
        skip: !shouldFetch, // Skip the query if shouldFetch is false
    });

    return { appointmentDetails, appointmentDetailsError, appointmentDetailsLoading };
};
