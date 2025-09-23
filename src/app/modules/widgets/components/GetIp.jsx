import { useState, useEffect } from 'react';
import axios from 'axios';

const GetIp = () => {
    //creating IP state
    const [data, setData] = useState({});
    
    const getData = async () => {
        try {
            await fetch('https://geolocation-db.com/json/')
            .then(res => res.json())
            .then( res => {
                setData(res)
                console.log('get ip',res)
            })
        } catch (e) {
            // console.log("error", e)
            setData("error")
        }
    }
    useEffect(() => {
        getData()
    }, [])
    return data;
}

export default GetIp