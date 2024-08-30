import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonAvatar,
    IonSpinner,
    IonButton,
    IonSelect,
    IonSelectOption
} from '@ionic/react';
import { useState, useEffect } from "react";
import './pokemon.css';
import {useHistory} from "react-router"; // Assure-toi d'ajouter des styles pour améliorer l'apparence

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

const Pokemon: React.FC = () => {
    const [pokemonsList, setPokemonList] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
    const history = useHistory();  // Pour la navigation


    useEffect(() => {
        const getPokemons = async () => {
            try {
                const response = await fetch('https://tyradex.vercel.app/api/v1/pokemon');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setPokemonList(data);
            } catch (error) {
                console.error('Erreur lors de la récupération des Pokémon', error);
            } finally {
                setLoading(false);
            }
        };

        getPokemons();
    }, []);

    const handleSelectChange = (event: CustomEvent) => {
        setSelectedPokemonId(event.detail.value);
    };

    const handleButtonClick = (pokedex_id: number) => {
        setSelectedPokemonId(pokedex_id);
    };

    const handleBackToList = () => {
        setSelectedPokemonId(null);
    };
    const handleDetailsClick = (pokedex_id: number) => {
        history.push(`/pokemon/${pokedex_id}`);  // Redirige vers la page des détails
    };

    const selectedPokemon = pokemonsList.find(pokemon => pokemon.pokedex_id === selectedPokemonId);

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Pokédex</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Pokédex</IonTitle>
                    </IonToolbar>
                </IonHeader>

                {loading ? (
                    <div className="spinner-container">
                        <IonSpinner name="crescent" />
                    </div>
                ) : (
                    <>
                        {/* Affichage de la liste des Pokémon si aucun n'est sélectionné */}
                        {!selectedPokemonId && (
                            <>
                                <IonItem>
                                    <IonLabel>Select a Pokémon</IonLabel>
                                    <IonSelect
                                        value={selectedPokemonId}
                                        placeholder="Select a Pokémon"
                                        onIonChange={handleSelectChange}
                                    >
                                        {pokemonsList.map(pokemon => (
                                            <IonSelectOption key={pokemon.pokedex_id} value={pokemon.pokedex_id}>
                                                {pokemon.name.en}
                                            </IonSelectOption>
                                        ))}
                                    </IonSelect>
                                </IonItem>

                                <IonList>
                                    {pokemonsList.map(pokemon => (
                                        <IonItem key={pokemon.pokedex_id} className="pokemon-item">
                                            <IonAvatar slot="start" className="pokemon-avatar">
                                                <img
                                                    src={pokemon.sprites.regular || 'https://via.placeholder.com/150'}
                                                    alt={pokemon.name.en}
                                                />
                                            </IonAvatar>
                                            <IonLabel className="pokemon-info">
                                                <h2>{pokemon.name.en}</h2>
                                                <p>Catégorie: {pokemon.category}</p>
                                                <p>Génération: {pokemon.generation}</p>
                                            </IonLabel>
                                            <IonButton
                                                slot="end"
                                                onClick={() => handleDetailsClick(pokemon.pokedex_id)}
                                            >
                                                Voir plus
                                            </IonButton>
                                        </IonItem>
                                    ))}
                                </IonList>
                            </>
                        )}

                        {/* Affichage des détails du Pokémon sélectionné */}
                        {selectedPokemon && (
                            <IonList>
                                <IonItem className="pokemon-item">
                                    <IonAvatar slot="start" className="pokemon-avatar">
                                        <img
                                            src={selectedPokemon.sprites.regular || 'https://via.placeholder.com/150'}
                                            alt={selectedPokemon.name.en}
                                        />
                                    </IonAvatar>
                                    <IonLabel className="pokemon-info">
                                        <h2>{selectedPokemon.name.en}</h2>
                                        <p>Catégorie: {selectedPokemon.category}</p>
                                        <p>Génération: {selectedPokemon.generation}</p>
                                        <div className="pokemon-details">
                                            <p>Height: {selectedPokemon.height || 'N/A'}</p>
                                            <p>Weight: {selectedPokemon.weight || 'N/A'}</p>
                                            <p>Types: {selectedPokemon.types.map(type => type.name).join(', ')}</p>
                                        </div>
                                        <IonButton onClick={handleBackToList}>
                                            Retour à la liste
                                        </IonButton>
                                    </IonLabel>
                                </IonItem>
                            </IonList>
                        )}
                    </>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Pokemon;