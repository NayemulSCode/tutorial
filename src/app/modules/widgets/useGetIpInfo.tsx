import axios from 'axios';
import {useState, useEffect} from 'react'
const useGetIpInfo = () => {
    //creating IP state
    const [data, setData] = useState<object>({});
      const getData = async () => {
        try {
          const res = await axios.get('https://geolocation-db.com/json/')
          setData(res.data)
        } catch (e) {
          setData({error: 'Unable to fetch IP info'})
        }
      }

    useEffect(() => {
        getData()
    }, [])
    return data;
}

export default useGetIpInfo