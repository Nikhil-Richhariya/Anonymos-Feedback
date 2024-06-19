"use client"

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'


const NavBar = () => {

    const {data : session} = useSession(); 

    return (
        <div>NavBar</div>
    )
}

export default NavBar