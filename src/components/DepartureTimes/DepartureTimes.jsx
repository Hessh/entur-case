import React, { useState } from 'react'
import Image from 'next/image';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain, faTram, faTrainSubway, faFerry, faRocket, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const DepartureTimes = ({ stopPlace }) => {
  const [showSituations, setShowSituations] = useState(false);

  // Sorter avganger etter tid
  stopPlace.estimatedCalls.sort((a, b) => {
    return new Date(a.expectedDepartureTime) - new Date(b.expectedDepartureTime);
  });

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
                case 'water':
                  icon = faFerry;
                  bgColor = 'bg-blue-900'
                break;
              default:
                icon = faRocket;
                bgColor = 'bg-gray-500'
                break;
            }
            return (
              <li
                key={call?.serviceJourney.id}
                className={`p-5 border border-gray-300 mb-4 rounded shadow-box bg-white ${call.situations.length > 0 && "cursor-pointer hover:shadow-hover hover:bg-blue-50"}`}
                onClick={() => toggleSituations(call.expectedDepartureTime)}
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
                    {call?.expectedDepartureTime
                      ? formatTime(new Date(call?.expectedDepartureTime))
                      : formatTime(new Date(call?.aimedDepartureTime))}
                  </span>
                </div>
                {showSituations === call.expectedDepartureTime && call.situations.length > 0 && call.situations[0].summary.filter(situation => situation.language === 'no').map((situation) => {
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

export default DepartureTimes