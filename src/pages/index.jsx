import { useEffect, useState } from 'react'
import { debounce } from 'lodash';
import axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain, faTram, faTrainSubway, faRocket, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

import Layout from '@/components/Layout/Layout'
import Image from 'next/image';

const SearchInput = ({ searchTerm, onSearch }) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Finn stoppested"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="p-3 text-lg border border-gray-300 rounded w-full"
      />
    </div>
  );
};

const SearchResults = ({ searchResults, onResultSelect }) => {
  if (searchResults.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center mt-8">
        <Image src='/images/empty.svg' alt='No data' width={300} height={300}/>
        <p className='text-primary-blue text-lg font-semibold mt-8'>Vi finner ingen steder med dette navnet.</p>
        <p className='font-medium mt-2'>Sjekk at du har skrevet det riktig, og at du er koblet til internett.</p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Søkeresultater</h2>
      <ul className='md:h-full md:max-h-[59vh] md:overflow-y-scroll md:pb-8'>
        {searchResults.map(({ properties }) => (
          <li
            key={properties?.id}
            className="p-4 mb-4 flex flex-row justify-between items-center cursor-pointer rounded shadow-box bg-white hover:shadow-hover hover:bg-blue-50"
            onClick={() => onResultSelect(properties)}
          >
            <div>
              <p className='text-text text-base font-medium'>{properties?.name}</p>
              {properties?.locality === properties?.county ? 
                <p className='text-text text-sm font-light'>{properties?.locality}</p> : 
                <p className='text-text text-sm font-light'><span>{properties?.locality}</span>, <span>{properties?.county}</span></p>
              }
            </div>
            <div>
              {properties?.category.includes('onstreetBus') && <FontAwesomeIcon icon={faBus} size='xl' className="ml-2 text-red-500" />}
              {properties?.category.includes('onstreetTram') && <FontAwesomeIcon icon={faTram} size='xl' className="ml-2 text-blue-500" />}
              {properties?.category.includes('railStation') && <FontAwesomeIcon icon={faTrain} size='xl' className="ml-2 text-primary-blue" />}
              {properties?.category.includes('metroStation') && <FontAwesomeIcon icon={faTrainSubway} size='xl' className="ml-2 text-orange-600" />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

const RecentSearches = ({ recentSearches, onRecentSearchSelect }) => {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Siste søk</h2>
      <ul className='md:h-full md:max-h-[59vh] md:overflow-y-scroll md:pb-8'>
        {recentSearches.map((properties) => (
          <li
            key={properties.id}
            className="p-4 mb-4 flex flex-row justify-between items-center cursor-pointer rounded shadow-box bg-white hover:shadow-hover hover:bg-blue-50"
            onClick={() => onRecentSearchSelect(properties)}
          >
            <div>
              <p className='text-text text-base font-medium'>{properties?.name}</p>
              {properties?.locality === properties?.county ? 
                <p className='text-text text-sm font-light'>{properties?.locality}</p> : 
                <p className='text-text text-sm font-light'><span>{properties?.locality}</span>, <span>{properties?.county}</span></p>
              }
            </div>
            <div>
              {properties?.category.includes('onstreetBus') && <FontAwesomeIcon icon={faBus} size='xl' className="ml-2 text-red-500" />}
              {properties?.category.includes('onstreetTram') && <FontAwesomeIcon icon={faTram} size='xl' className="ml-2 text-blue-500" />}
              {properties?.category.includes('railStation') && <FontAwesomeIcon icon={faTrain} size='xl' className="ml-2 text-primary-blue" />}
              {properties?.category.includes('metroStation') && <FontAwesomeIcon icon={faTrainSubway} size='xl' className="ml-2 text-orange-600" />}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

const DepartureTimes = ({ stopPlace }) => {
  const [showSituations, setShowSituations] = useState(false);

  // Formater tid for avgangstider
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Vis/skjul situasjoner for avganger
  const toggleSituations = (id) => {
    if(showSituations === id) {
      setShowSituations(false);
      return;
    }
    setShowSituations(id);
  }

  return (
    <div className='h-full'>
      {stopPlace.estimatedCalls?.length === 0 ? (
        <div className="w-full h-full flex flex-col items-center mt-24">
          <Image src='/images/loading.svg' alt='No data' width={250} height={250}/>
          <p className='text-primary-blue text-lg font-semibold mt-8'>Finner ingen avganger.</p>
          <p className='font-medium mt-2'>Vi kan ikke finne avganger fra dette stoppestedet akkurat nå.</p>
        </div>
      ) : (
        <ul className='md:h-full md:max-h-[73vh] md:overflow-y-scroll md:pb-8'>
          {stopPlace.estimatedCalls?.map((call) => {
            let icon
            let bgColor
            switch (call.serviceJourney.line.transportMode) {
              case 'bus':
                icon = faBus
                bgColor = 'bg-red-500'
                break;
              case 'tram':
                icon = faTram;
                bgColor = 'bg-blue-500'
                break;
                case 'rail':
                  icon = faTrain;
                  bgColor = 'bg-primary-blue'
                break;
                case 'metro':
                  icon = faTrainSubway;
                  bgColor = 'bg-orange-600'
                break;
              default:
                icon = faRocket;
                bgColor = 'bg-gray-500'
                break;
            }
            return (
              <li
                key={call?.serviceJourney.id}
                className={`p-5 border border-gray-300 mb-4 rounded shadow-box bg-white ${call.situations.length > 0 && "cursor-pointer"}`}
                onClick={() => toggleSituations(call.aimedDepartureTime)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-row">
                    <div className={`flex items-center justify-start mr-4 py-1 px-2 rounded ${bgColor}`}>
                      <FontAwesomeIcon icon={icon} size='lg' className="mr-2 text-white" />
                      <span className="text-white text-base font-medium">{call?.serviceJourney.line.publicCode}</span>
                    </div>
                    <div className="flex items-center justify-start">
                      <span className="text-text text-base font-medium">{call?.destinationDisplay.frontText}</span>
                      {call.situations.length > 0 && <FontAwesomeIcon icon={faCircleInfo} size='lg' className="ml-2 text-orange-500" />}
                    </div>
                  </div>
                  <span className="flex items-center justify-end text-text text-base font-semibold">
                    {call?.aimedDepartureTime
                      ? formatTime(new Date(call?.aimedDepartureTime))
                      : formatTime(new Date(call?.expectedDepartureTime))}
                  </span>
                </div>
                {showSituations === call.aimedDepartureTime && call.situations.length > 0 && call.situations[0].summary.filter(situation => situation.language === 'no').map((situation) => {
                  return (
                    <div key={situation.value} className="flex flex-row mt-2 border border-gray-200 p-2 bg-yellow-200">
                      <FontAwesomeIcon icon={faCircleInfo} size='lg' className="mr-2" />
                      <span className="text-text text-sm font-semibold">{situation.value}</span>
                    </div>
                  )
                })}
              </li>
          )})}
        </ul>
      )}
    </div>
  );
};

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