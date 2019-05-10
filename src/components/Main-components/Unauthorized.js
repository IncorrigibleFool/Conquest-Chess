import React from 'react'
import {Redirect} from 'react-router-dom'

export default function Unauthorized(){
    return(
        <>
        <h1>You must be logged-in to view this page.</h1>
        <h2>You will be redirected to the login page momentarily.</h2>
        {/* <Redirect to='/login'>
            <link>Click here if you are not redirected.</link>
        </Redirect> */}
        </>
    )
}