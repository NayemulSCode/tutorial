import { systemLogTypes } from "../../types";
import { useTostMessage } from "./widgets/components/useTostMessage";

export const videoCategory=(list:any)=>{
    let categories = list.map((a:any)=>{
        return(
            {
                id: a.id,
                name: a.name
            }
        )
    })
    categories.unshift({id: '0', name: 'All'})
    return categories;
}

export const allVideo = (list: any, selectedTab:number) => {
  console.log("allVideo ~ selectedTab:", selectedTab)
  let vList: any = []
  list?.forEach(function (e: any) {
    e.business_videos.forEach(function (x: any) {
      let obj = {
        ...x,
        c_id: e.id,
      }
      vList.push(obj)
    })
  })
  if(selectedTab !== 0){
      return vList.filter((v:any)=> +v.c_id == selectedTab);
  }else{
    return vList;
  }
}

//input filed only allow number

export const allowOnlyNumber= (event: any) => {
  // Allow backspace
  if (event.key === 'Backspace') {
    return
  }

  // Allow only numbers and dot
  if (!/^[0-9]*\.?[0-9]*$/.test(event.key)) {
    event.preventDefault()
  }
}
// showing currency 
export const currency = (countryName: any) => {
  if (countryName === 'ireland') {
    return '€'
  }
  if (countryName === 'uk') {
    return '£'
  }
  if (countryName === 'bangladesh') {
    return '৳'
  }
};
export const timeDurationArray = [
  {id: 15, text: '15min'},
  {id: 20, text: '20min'},
  {id: 25, text: '25min'},
  {id: 30, text: '30min'},
  {id: 35, text: '35min'},
  {id: 40, text: '40min'},
  {id: 45, text: '45min'},
  {id: 50, text: '50min'},
  {id: 55, text: '55min'},
  {id: 60, text: '60min'},
  {id: 65, text: '1h 5min'},
  {id: 70, text: '1h 10min'},
  {id: 75, text: '1h 15min'},
  {id: 80, text: '1h 20min'},
  {id: 85, text: '1h 25min'},
  {id: 90, text: '1h 30min'},
  {id: 95, text: '1h 35min'},
  {id: 100, text: '1h 40min'},
  {id: 105, text: '1h 45min'},
  {id: 110, text: '1h 50min'},
  {id: 115, text: '1h 55min'},
  {id: 120, text: '2h'},
  {id: 135, text: '2h 15min'},
  {id: 155, text: '2h 30min'},
  {id: 165, text: '2h 45min'},
  {id: 180, text: '3h'},
]
export const preventWhiteSpace = (e: any) => {
    const value = e.currentTarget.value
    const key = e.key
    if (key === ' ' && value === '') {
      e.preventDefault()
    }
  }
export const frequency= [
  { id: 1, value: 'daily', name: 'Daily', status: true},
  {id: 2, value: "weekly", name:'Weekly', status: true},
  { id: 3, value: 'bi-weekly', name:'Bi-Weekly', status: true},
  { id: 4, value: 'once-a-month', name:'Once a Month', status: true}
];
export const occurrence = [
  {id: 1, value: '1', status: true},
  {id: 2, value: '2', status: true},
  {id: 3, value: '3', status: true},
  {id: 4, value: '4', status: true},
  {id: 5, value: '5', status: true},
  {id: 6, value: '6', status: true},
  {id: 7, value: '7', status: true},
  {id: 8, value: '8', status: true},
  {id: 9, value: '9', status: true},
  {id: 10, value: '10', status: true},
  {id: 11, value: '11', status: true},
  {id: 12, value: '12', status: true},
  {id: 13, value: '13', status: true},
  {id: 14, value: '14', status: true},
]

export const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    
    // Detect device type based on user agent string
    if (/android/i.test(userAgent)) {
        return "Android Device";
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
        return "iOS Device";
    } else if (/Windows/i.test(userAgent)) {
        return "Windows PC";
    } else if (/Macintosh/i.test(userAgent)) {
        return "Mac Device";
    } else if (/Linux/i.test(userAgent)) {
        return "Linux PC";
    } else {
        return "Unknown Device";
    }
};

export const systemLogPayload:systemLogTypes = {
  api: '',
  user: "",
  body: "",
  response: "",
  exception: "",
  source: 'web-business',
  version: '1.1.0',
  priority: 'high',
  device: getDeviceInfo(),
}

export const imageUrl = 
  window.location.host.includes('localhost') ||
  window.location.host.includes('testbusiness.chuzeday.com') ? 
  'https://testguest.chuzeday.com' : 'https://chuzeday.com'


export const xllExportUrl = 
  window.location.host.includes('localhost') ||
  window.location.host.includes('testbusiness.chuzeday.com') ? 
  'https://testbackend.chuzeday.com' : 'https://backend.chuzeday.com'
