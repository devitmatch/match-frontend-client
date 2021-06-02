import React from 'react';
import  Home  from '../../assets/icons/Home';
import AttendancePlayer from '../../assets/icons/AttendancePlayer';
export const SidebarData = [
    {
        title: "Home",
        icon: <Home width={28} height={28} color={'#0000'}/>,
        link: '/'
    },
    {
        title: "Atendimentos",
        icon: <AttendancePlayer width={28} height={28}/>,
        link: '/attendance'
    }
];