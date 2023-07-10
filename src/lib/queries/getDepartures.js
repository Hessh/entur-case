export const GET_DEPARTURES_BY_PLACEID = `
  query getDepartures($id: String!) {
    stopPlace(id: $id) {
      name
      id
      estimatedCalls(numberOfDepartures: 5) {
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
        situations {
          summary {
            value
            language
          }
        }
      }
    }
  }
`