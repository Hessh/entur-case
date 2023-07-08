import axios from "axios";

export default async function handler(req, res) {
  const { searchTerm } = req.query;

  const headers = {
    'Content-type': 'application/json',
    'ET-Client-Name': 'Norsk_luftambulanse_teknologi-Entur_case',
  };

  const params = {
    text: searchTerm,
    lang: 'no',
    "boundary.country": 'NOR',
  };

  try {
    const response = await axios.get('https://api.entur.io/geocoder/v1/autocomplete', {params, headers});
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
