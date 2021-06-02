import React from 'react';
import styles from './styles.module.scss';
import { SidebarData } from './SidebarData.js';
import { useHistory, NavLink } from 'react-router-dom'


export function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <ul>
                {SidebarData.map((value, key) => {
                    return(
                        <li key={key}>
                            <NavLink exact to={value.link} activeClassName={styles.activeLink}>
                                {value.icon}
                                {value.title}
                            </NavLink>
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}