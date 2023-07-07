import axios from "axios";

export default async function handler(req, res) {
  const { searchTerm } = req.query;

  const headers = {
    "ET-Client-Name": "NLT-EnturCase",
  }

  try {
    const response = await axios.get('https://api.entur.io/geocoder/v1/autocomplete', {
      params: {
        text: searchTerm,
        lang: 'no',
        "boundary.country": 'NOR',
      },
    }, { headers: headers });
    res.status(200).json(response.data);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Error fetching data' });
  }
}
