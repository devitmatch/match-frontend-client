import React, { useEffect, useState } from 'react';
import { AttendanceCard } from '../../components/AttendanceCard';
import styles from './styles.module.scss';
import Loading from '../../components/Loading/Loading';
import { Sidebar } from '../../components/Sidebar';
import Api from '../../libs/Api';


export function NewAttendances() {
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
    console.log(attendances)
    return(
        <div className={styles.fullPage}>
            {loading && <Loading />}
            <Sidebar />
            <div className={styles.container}>
                <div className={styles.content}>
                    <section className={styles.titleSection}>
                        <h1>Atendimentos</h1>
                        <p>Explorar</p>
                    </section>

                    <div className={styles.attendanceGrid}>
                            {attendances.map(attendance => {
                                return (
                                    <AttendanceCard 
                                    key={attendance.id} 
                                    id={attendance.id} 
                                    imagem={attendance.cover_url} 
                                    title={attendance.name}/>
                                    
                                )
                            })}
                    </div>

                    <footer className={styles.pagination}>
                        <button className={styles.previousPage}>Anterior</button>
                        <button className={styles.numbers}>1</button>
                        <button className={styles.numbers}>2</button>
                        <button className={styles.numbers}>3</button>
                        <button className={styles.previousPage}>Próximo</button>
                    </footer>
                </div>
            </div>
        </div>
    )
}