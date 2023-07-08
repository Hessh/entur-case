export const GET_DEPARTURES_BY_PLACEID = `
  query getDepartures($id: String!) {
    stopPlace(id: $id) {
      name
      id
      estimatedCalls(numberOfDepartures: 20) {
        expectedDepartureTime
        aimedDepartureTime
        destinationDisplay {
          frontText
        }
        serviceJourney {
          id
          line {
            publicCode
            transportMode
          }
        }
      }
    }
  }
`