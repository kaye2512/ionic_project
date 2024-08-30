import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonAvatar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

type Pokemon = {
    pokedex_id: number;
    generation: number;
    category: string;
    name: {
        fr: string;
        en: string;
        jp: string;
    };
    sprites: {
        regular: string;
        shiny: string;
        gmax: string | null;
    };
    types: {
        name: string;
        image: string;
    }[];
    talents: {
        name: string;
        tc: boolean;
    }[];
    stats: {
        hp: number;
        atk: number;
        def: number;
        spe_atk: number;
        spe_def: number;
        vit: number;
    };
    resistances: {
        name: string;
        multiplier: number;
    }[];
    evolution: {
        pre:
            | {
            pokedex_id: number;
            name: string;
            condition: string;
        }[]
            | null;
        next:
            | {
            pokedex_id: number;
            name: string;
            condition: string;
        }[]
            | null;
        mega:
            | {
            orbe: string;
            sprites: {
                regular: string;
                shiny: string;
            };
        }[]
            | null;
    };
    height: string;
    weight: string;
    egg_groups: string[];
    sexe: {
        male: number;
        female: number;
    };
    catch_rate: number;
    level_100: number;
    formes: any;
};

const PokemonDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // ID du Pokémon depuis l'URL
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const history = useHistory();

    useEffect(() => {
        const getPokemon = async () => {
            try {
                const response = await fetch(`https://tyradex.vercel.app/api/v1/pokemon/${id}`);
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du Pokémon', error);
            }
        };

        getPokemon();
    }, [id]);

    if (!pokemon) {
        return <IonContent>Chargement des détails...</IonContent>;
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{pokemon.name.en} - Détails</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonCard>
                    <IonCardHeader>
                        <IonAvatar>
                            <img src={pokemon.sprites.regular || 'https://via.placeholder.com/150'} alt={pokemon.name.en} />
                        </IonAvatar>
                        <IonCardTitle>{pokemon.name.en}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonLabel>
                            <p><strong>Catégorie :</strong> {pokemon.category}</p>
                            <p><strong>Génération :</strong> {pokemon.generation}</p>
                            <p><strong>Taille :</strong> {pokemon.height}</p>
                            <p><strong>Poids :</strong> {pokemon.weight}</p>
                            <p><strong>Types :</strong> {pokemon.types ? pokemon.types.map(t => t.name).join(', ') : 'N/A'}</p>
                        </IonLabel>
                        <IonButton onClick={() => history.goBack()}>
                            Retour
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default PokemonDetail;
