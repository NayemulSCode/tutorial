import React, { FC } from 'react'
import { Button } from "react-bootstrap-v5";
type ButtonProps={
  loading: boolean;
  OnClick: (e:any)=> void;
  name: string;
  type?: string;
  variant?: string;
  class_name?: string;
}
const ButtonR:FC<ButtonProps> = ({loading, OnClick, name, type, variant, class_name}) => {
  console.log("🚀 ~ variant:", variant)
  return (
     <Button
        className={class_name ?? 'btn btn-sm'}
        variant= {variant ?? 'success'}
        type= {type ?? 'button'}
        disabled={loading}
        onClick={OnClick}
    >
        {!loading && <span className='indicator-label'>{name}</span>}
        {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
            Please wait...
            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
        )}
    </Button>
  )
}

export default ButtonR