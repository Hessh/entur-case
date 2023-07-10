import { useEffect, useState } from 'react'
import { debounce } from 'lodash';
import Image from 'next/image';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain, faTram, faTrainSubway, faFerry } from '@fortawesome/free-solid-svg-icons';

import Layout from '@/components/Layout/Layout'
import SearchInput from '@/components/SearchInput/SearchInput';
import SearchResults from '@/components/SearchResults/SearchResults';
import RecentSearches from '@/components/RecentSearches/RecentSearches';
import DepartureTimes from '@/components/DepartureTimes/DepartureTimes';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [stopPlace, setStopPlace] = useState();
  const [stopPlaceLoading, setStopPlaceLoading] = useState(false);
  const [stopPlaceError, setStopPlaceError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);

  // Hent siste søk fra sessionStorage på initial load
  useEffect(() => {
    const savedSearches = sessionStorage.getItem('recentSearches');
    if (savedSearches) {
      setRecentSearches(JSON.parse(savedSearches));
    }
  }, []);

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

        // Hvis det finnes resultater, filtrer ut stoppesteder og lagre i state
        const data = await response.data;
        const results = data.features.filter(result => result.properties.layer === 'venue');
        setSearchResults(results);
      } else {
        setSearchResults(recentSearches);
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
   
    // Legg til valgt sted i listen over siste søk
    const updatedSearches = [location, ...recentSearches.filter((result) => result.id !== location.id)].slice(0, 5);
    setRecentSearches(updatedSearches);

    // Lagre oppdatert liste over siste søk i sessionStorage
    sessionStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Hent avgangstider for valgt sted
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

  return (
    <Layout>
      <div className="container md:min-h-[85vh] md:max-h-[85vh] overflow-y-clip mx-auto py-8 md:grid md:grid-cols-2 ">
        <div className="w-full md:h-full mb-8 md:mb-0 md:border-r md:border-gray-300 md:pr-4">
          <h1 className="text-3xl font-bold mb-4">Se avganger</h1>
          <SearchInput searchTerm={searchTerm} onSearch={handleSearch} />
          {searchLoading && <p>Laster inn resultater...</p>}
          {searchError && <p>En feil har oppstått.</p>}
          {!searchLoading && !searchError && searchTerm !== '' && (
            <SearchResults searchResults={searchResults} onResultSelect={handleSelect} />
          )}
          {!searchLoading && !searchError && searchTerm === '' && recentSearches.length > 0 && (
            <RecentSearches recentSearches={recentSearches} onRecentSearchSelect={handleSelect} />
          )}
          {!searchLoading && !searchError && searchTerm === '' && recentSearches.length === 0 && (
            <>
              <p className='text-primary-blue text-base font-normal'>Her kan du søke opp stoppesteder og se de neste avgangene derifra.</p>
              <ul className='mt-12 md:mt-40 flex flex-row w-full justify-around items-center'>
                <li className='flex flex-col justify-center items-center'>
                  <FontAwesomeIcon icon={faBus} size='xl' className="text-red-500" />
                  <p className='text-xs font-light mt-1'>Buss</p>
                </li>
                <li className='flex flex-col justify-center items-center'>
                  <FontAwesomeIcon icon={faTram} size='xl' className="text-blue-500" />
                  <p className='text-xs font-light mt-1'>Trikk</p>
                </li>
                <li className='flex flex-col justify-center items-center'>
                  <FontAwesomeIcon icon={faTrain} size='xl' className="text-primary-blue" />
                  <p className='text-xs font-light mt-1'>Tog</p>
                </li>
                <li className='flex flex-col justify-center items-center'>
                  <FontAwesomeIcon icon={faTrainSubway} size='xl' className="text-orange-600" />
                  <p className='text-xs font-light mt-1'>T-bane</p>
                </li>
                <li className='flex flex-col justify-center items-center'>
                  <FontAwesomeIcon icon={faFerry} size='xl' className="text-blue-900" />
                  <p className='text-xs font-light mt-1'>Ferje</p>
                </li>
              </ul>
            </>
          )}
        </div>
        {stopPlace ? (
          <div className="w-full md:h-full md:pl-4">
            <h1 className="text-3xl font-bold mb-4">{stopPlace?.name}</h1>
            {stopPlaceLoading && <p>Laster inn avgangstider...</p>}
            {stopPlaceError && <p>Feil: {stopPlaceError}</p>}
            {!stopPlaceLoading && !stopPlaceError && (
              <DepartureTimes stopPlace={stopPlace} />
            )}
          </div>
        ) : (
          <div className="mt-12 md:mt-0 w-full md:h-full flex justify-center items-center md:pl-4">
            <Image src='/images/destination.svg' alt='No data' width={400} height={400}/>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Home;