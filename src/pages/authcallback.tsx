import React from 'react'
import { NextPage } from 'next'

const AuthCallbackPage: NextPage = () => {
return <></>
}


AuthCallbackPage.getInitialProps = async (ctx) => {
    console.log(ctx.query)
    return {}
}


export default AuthCallbackPage
