import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain, faTram, faTrainSubway } from '@fortawesome/free-solid-svg-icons';

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

export default RecentSearches