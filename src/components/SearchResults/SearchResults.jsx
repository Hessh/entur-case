import React from 'react'
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain, faTram, faTrainSubway } from '@fortawesome/free-solid-svg-icons';

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

export default SearchResults