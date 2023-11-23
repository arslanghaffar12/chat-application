import React from 'react'

import { Users, User } from "react-feather"
import "../css/sidebar.css"
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
    const iconColor = "#fff"
    const menu = [
        { title: 'Profile', icon: <User size={15} color={iconColor} />, to: "/" },
        { title: 'Users', icon: <Users size={15} color={iconColor} />, to: "/users" },
        { title: 'Chat', icon: <User size={15} color={iconColor} />, to: "/" },
        { title: 'Profile', icon: <User size={15} color={iconColor} />, to: "/" },

    ]
    return (
        <div className='sidebar'>
            <ul >

                {menu.map((item, ind) => {
                    return (
                        <li key={ind} className='p-2' >
                            <NavLink to={item.to} style={{ textDecoration: 'none' }}>
                                <h3 className='title'>
                                    <span >{item.icon}</span> <span className='mx-2'>{item.title}</span>

                                </h3>

                            </NavLink>

                        </li>
                    )
                })}
            </ul>



        </div>
    )
}
