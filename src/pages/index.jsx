import { useEffect, useState } from 'react'
import axios from 'axios';

import Layout from '@/components/Layout/Layout'

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (value) =>{
    setSearchTerm(value);
    setLoading(true);
    setError(null);

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

        const data = await response.data;
        const results = data.features.filter(result => result.properties.layer === 'venue');
        setResults(results);
      } else {
        setResults([]);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSelect = async (placeId) => {
    console.log(placeId)
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

  useEffect(() => {
    if (error) {
      console.log(error)
    }
  }, [error]);
  
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Finn avganger</h1>
        <div className="mb-4">
        <input
          type="text"
          placeholder="Enter a location"
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="p-2 border border-gray-300 rounded w-64"
        />
      </div>

        {loading ? (
          <p>Laster inn resultater...</p>
        ) : error ? (
          <p>En feil har oppstått: {error}</p>
        ) : results ? (
          <ul>
            {results.map(({properties}) => {
              return(
                <div key={properties.id} className="mb-4">
                  <button className="" onClick={() => handleSelect(properties.id)}>
                    {properties.name}
                  </button>
                </div>
            )})}
          </ul>
        ) : (
          <p>Fant ingen resultater.</p>
        )}
      </div>
    </Layout>
  )
}

export default Home;
