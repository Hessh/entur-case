import Layout from '@/components/Layout/Layout'
import axios from 'axios';
import { useState } from 'react'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(results)

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('/api/location', {
      params: {
        searchTerm: searchTerm,
      },
    });

      if (response.status !== 200) {
        throw new Error('Error fetching data');
      }

      const data = await response.data;
      const results = data.features.filter(result => result.properties.layer === 'venue');
      setResults(results);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (id) => {
    console.log(id)
    // setLoading(true);
    // setError(null);

    // try {
    //   const response = await axios.get('/api/location', {
    //   params: {
    //     searchTerm: searchTerm,
    //   },
    // });

    //   if (response.status !== 200) {
    //     throw new Error('Error fetching data');
    //   }

    //   const data = await response.data;
    //   const results = data.features.filter(result => result.properties.layer === 'venue');
    //   setResults(results);
    // } catch (error) {
    //   setError(error.message);
    // } finally {
    //   setLoading(false);
    // }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Public Transportation Departures</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter a location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded w-64"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 ml-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : results ? (
          <ul>
            {results.map((result) => (
              <div key={result.id} className="mb-4">
              <button key={result.id} className="" onClick={(e) => handleSelect(e.target.value)}>
                {result.properties.name}
              </button>
              </div>
            ))}
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </Layout>
  )
}

export default Home;
