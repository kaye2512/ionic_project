import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonImg,
    IonSpinner,
    IonButton,
    IonGrid,
    IonRow,
    IonCol
} from '@ionic/react';

interface Film {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    overview: string;
}

const Film: React.FC = () => {
    const [movies, setMovies] = useState<Film[]>([]);
    const [query, setQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(0); // Pour gérer le nombre total de pages

    useEffect(() => {
        const fetchMovies = async () => {
            if (!query) return; // Ne fait rien si aucune recherche n'a été effectuée

            setLoading(true);
            try {
                const response = await fetch(`http://movies-api.julienpoirier-webdev.com/search/movies/${query}/${page}`);
                const data = await response.json();
                setMovies(data.results);
                setTotalPages(data.total_pages);
            } catch (error) {
                console.error('Erreur lors de la récupération des films', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [query, page]);

    const handleSearch = (event: CustomEvent) => {
        setQuery(event.detail.value);
        setPage(1);
    };

    const goToFirstPage = () => setPage(1);
    const goToLastPage = () => setPage(totalPages);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Movies</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonSearchbar
                    value={query}
                    debounce={500}
                    onIonChange={handleSearch}
                    placeholder="Search for a movie"
                />

                {loading ? (
                    <IonSpinner name="crescent" />
                ) : (
                    <IonList>
                        {movies.map(movie => (
                            <IonItem key={movie.id} routerLink={`/movies/${movie.id}`}>
                                <IonImg src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} />
                                <IonLabel>
                                    <h2>{movie.title}</h2>
                                    <p>{movie.release_date}</p>
                                    <p>{movie.overview.substring(0, 100)}...</p>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                )}

                <IonGrid>
                    <IonRow>
                        <IonCol>
                            <IonButton disabled={page === 1} onClick={goToFirstPage}>
                                First Page
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton disabled={page === 1} onClick={() => setPage(page - 1)}>
                                Previous
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                                Next
                            </IonButton>
                        </IonCol>
                        <IonCol>
                            <IonButton disabled={page === totalPages} onClick={goToLastPage}>
                                Last Page
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    );
};

export default Film;