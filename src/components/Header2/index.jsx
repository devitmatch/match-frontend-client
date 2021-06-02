import React from 'react';
import styles from './styles.module.scss'
import logoMatch from '../../assets/images/logo_match_2.svg';
import ShoppingCartIcon from '../../assets/icons/ShoppingCart';
import NotificationIcon from '../../assets/icons/Notification';
import Avatar from '../../assets/icons/Avatar';
import SearchIcon from '../../assets/icons/Search';

export function Header() {
    return(
    <>
       <div className={styles.gradient}/>
       <header className={styles.header}>
           <div className={styles.content}>
               <img src={logoMatch} alt="Logo da Match" />
               <section>
                    <div className={styles.searchInputContainer}>
                        <SearchIcon color="#a3b3c7" />
                        <input type="search" placeholder='O que você procura ?'/>
                    </div>
                    <ShoppingCartIcon color='#202730' width={26} height={26}/>
                    <NotificationIcon color='#202730' width={26} height={26}/>
                    <Avatar
                        img={'https://avatars.githubusercontent.com/u/5678023?s=400&u=dfdc2b3c239f20f288f063357aa497911bad9ade&v=4'}
                    />
               </section>
           </div>
       </header>
    </>
    )
}