import { GET_DEPARTURES_BY_PLACEID } from "@/lib/queries/getDepartures";
import axios from "axios";

export default async function handler(req, res) {
  const { placeId } = req.query;

  const headers = {
    'Content-Type': 'application/json',
    'ET-Client-Name': 'Norsk_luftambulanse_teknologi-Entur_case',
  };

  const requestBody = {
    query: GET_DEPARTURES_BY_PLACEID,
    variables: {
      id: placeId,
    },
  };

  try {
    const response = await axios.post(
      'https://api.entur.io/journey-planner/v3/graphql',
      requestBody,
      { headers }
    );

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}