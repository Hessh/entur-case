import { useEffect, useState } from 'react'
import axios from 'axios';

import { debounce } from 'lodash';
import Layout from '@/components/Layout/Layout'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  // const [recentSearches, setRecentSearches] = useState([]);
  const [stopPlace, setStopPlace] = useState([]);
  const [stopPlaceLoading, setStopPlaceLoading] = useState(false);
  const [stopPlaceError, setStopPlaceError] = useState(null);

  // Debounce søk
  const debouncedSearch = debounce(async (value) => {
    // Reset state
    setSearchError(null);

    // Søk etter steder i APIet
    try {
      if(value.length > 0) {
        const response = await axios.get('/api/location', {
          params: {
            searchTerm: value,
          },
        });

        if (response.status !== 200) {
          throw new Error('Error fetching data');
        }

        // Hvis det finnes resultater, filtrer ut holdeplasser og lagre i state
        const data = await response.data;
        const results = data.features.filter(result => result.properties.layer === 'venue');
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      setSearchError(error.message);
    } finally {
      setSearchLoading(false);
    }
  }, 300);

  // Søk etter steder
  const handleSearch = async (value) => {
    setSearchLoading(true);
    setSearchTerm(value);
    debouncedSearch(value);
  }

  // Velg sted
  const handleSelect = async (location) => {
    // // Lagre siste søkte resultater i et state array på 5? resultater
    // setRecentSearches((prevResults) => {
    //   const updatedResults = [location, ...prevResults.filter((result) => result.id !== location.id)];
    //   return updatedResults.slice(0, 5);
    // });

    // // Sjekk om det finnes en match i arrayet, hvis ikke, legg til i arrayet
    // const matchIndex = recentSearches.findIndex((result) => result.id === location.id);
    // if (matchIndex === -1) {
    //   setRecentSearches((prevResults) => [location, ...prevResults].slice(0, 5));
    // }
    
    // // Hvis det finnes en match, flytt den til toppen av arrayet
    // if (matchIndex > 0) {
    //   setRecentSearches((prevResults) => {
    //     const updatedResults = [...prevResults];
    //     const [matchedResult] = updatedResults.splice(matchIndex, 1);
    //     updatedResults.unshift(matchedResult);
    //     return updatedResults;
    //   });
    // }
    
    
    // // Hvis arrayet er fullt, fjern den eldste matchen
    // if (recentSearches.length >= 5) {
    //   setRecentSearches((prevResults) => prevResults.slice(0, 4));
    // }
    
    
    // // Hvis det finnes en match, bruk den
    // if (matchIndex > -1) {
    //   const matchedLocation = recentSearches[matchIndex];
    //   // Call the appropriate function or perform the desired action using the matchedLocation
    //   // Example: setDepartureLocation(matchedLocation);
    // }

    
    // Hvis det ikke finnes en match, gjør et nytt kall til APIet
    try {
      // Reset state
      setStopPlaceLoading(true);
      setStopPlaceError(null);

      // Søk etter avgangstider i APIet
      const response = await axios.get('/api/departures', {
        params: {
          placeId: location.id,
        },
      });

      if (response.status !== 200) {
        throw new Error('Error fetching data');
      }

      // Lagre avgangstider i state
      const { data: { stopPlace } } = response.data;
      setStopPlace(stopPlace);
    } catch (error) {
      setStopPlaceError(error.message);
    } finally {
      setStopPlaceLoading(false);
    }
  };

  // Håndter søkefeil for inspisering
  useEffect(() => {
    if (searchError) {
      console.log(searchError)
    }
  }, [searchError]);

  // Formater tid for avgangstider
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return (
    <Layout>
      <div className="container mx-auto py-8 flex flex-col md:flex-row md:justify-around">
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Finn stoppested</h1>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter a location"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="p-2 border border-gray-300 rounded w-64"
            />
          </div>
          {/* {searchTerm === '' && recentSearches.length > 0 && recentSearches.map((properties) => {
            return(
            <li key={properties.id} className="mb-4" onClick={() => handleSelect(properties)}>
                  {properties.name}
                </li>
          )})} */}
          {searchLoading && <p>Laster inn resultater...</p>}
          {searchError && <p>En feil har oppstått.</p>}
          {!searchLoading && !searchError && (
            <ul>
              {searchResults.map(({properties}) => {
                return(
                <li key={properties.id} className="mb-4" onClick={() => handleSelect(properties)}>
                  {properties.name}
                </li>
              )})}
            </ul>
          )}
        </div>
        <div className="">
          <h1 className="text-3xl font-bold mb-4">Se avgangstider</h1>
          {stopPlaceLoading && <p>Loading departure times...</p>}
          {stopPlaceError && <p>Error: {stopPlaceError}</p>}
          {!stopPlaceLoading && !stopPlaceError && (
            <div>
              <h2>Avgangstider for {stopPlace?.name}</h2>
              <ul className="my-4">
                {stopPlace?.estimatedCalls?.length > 0 ? stopPlace?.estimatedCalls?.map((call) => {
                  // console.log(call)
                  return(
                    <div key={call.serviceJourney.id} className="grid grid-cols-layout mb-4">
                      <div className="flex">{call.serviceJourney.line.publicCode} 
                        {/* {call.serviceJourney.line.transportMode} */}
                        {/* Spor (?) */}
                      </div>
                      <p>{call.destinationDisplay.frontText}</p>
                      <p>{call.aimedDepartureTime ? formatTime(new Date(call.aimedDepartureTime)) : formatTime(new Date(call.expectedDepartureTime))}</p>
                    </div>
                    // <li key={time.id} className="mb-4">{time.time}</li>
                  )}) : <p>Ingen avganger</p>}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Home;
