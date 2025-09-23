
import React, { FC, useEffect, useState } from "react"
type Props = {
    content: any
}
const ShowServices: FC<Props> = ({ content }) => {
    // console.log("ShowServices component-----------------", content)
    return (
        <div>
            {
               content && content.map((y: any, index:number) => {
                    return <p key={index}>{y.label}</p>
                })
            }
        </div>
    )
}
export { ShowServices}