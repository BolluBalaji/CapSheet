import React from 'react'

function ResponseMessages(props:any) {
    return (
        <div>
            {props.messages.map((msg:any,ind:any) => (
                <h5 key={ind} style={{color: props.isError? 'red' : 'green'}}>{msg}</h5>
            ))}
        </div>
    )
}

export default ResponseMessages
