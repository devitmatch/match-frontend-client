import React, { useEffect, useState } from 'react';
import { AttendanceCard } from '../../components/AttendanceCard';
import { Sidebar } from '../../components/Sidebar';
import styles from './styles.module.scss';
import { ScrollingCarousel } from '@trendyol-js/react-carousel';
import Api from '../../libs/Api';
import { Link } from 'react-router-dom';

export function NewHome() {
    const [attendances, setAttendances] = useState([]);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(false);

    const [page, setPage] = useState(1);
    const [lastPage, setLastPage] = useState(0);
    const [updatedPage, setUpdatedPage] = useState();
    const [counter, setCounter] = useState();

    useEffect(() => {
        setLoading(true);

        Api.getAttendances(`page=${page - 1}`)
        .then((res) => {
          setAttendances(res.result);
          setCounter(res.count);
          let numberOfPages = parseInt(res.count / 30, 10);
          if (res.count % 30) {
            numberOfPages += 1;
          }
          setLastPage(numberOfPages);
        })
        .catch()
        .finally(() => {
          setLoading(false);
          setInitialLoad(true);
        });
    }, [page]);

    return( 
        <>
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.content}>
                    <section className={styles.titleSection}>
                        <h1>Moda é sobre sonhar e fazer outras pessoas sonharem.</h1>
                        <p>- Donatella Versace</p>
                    </section>

                    <section className={styles.attendancesSection}>
                        <div className={styles.attendancesTitleSection}>
                            <h1>Atendimentos</h1>
                            <Link to={'/attendance'}>Ver tudo</Link>
                        </div>
                        <div className={styles.attendanceCards}>
                            <ScrollingCarousel className={styles.carousel}>
                                {attendances.map(attendance => {
                                    return (
                                        <AttendanceCard 
                                        key={attendance.id} 
                                        id={attendance.id} 
                                        imagem={attendance.cover_url} 
                                        title={attendance.name}/>
                                    )
                                })}
                            </ScrollingCarousel>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}