import React from 'react';
import styles from './styles.module.scss';
import { useHistory } from 'react-router-dom';

export function AttendanceCard( { imagem, title, id } ) {
    const history = useHistory()
    return (
        <div className={styles.card} onClick={() => {history.push(`/attendances/${id}`)}}>
            <img src={imagem} alt="capa de apresentacao" />
            <h2>{title}</h2>
        </div>
    )

}