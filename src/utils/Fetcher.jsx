import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fetcher = ({
  url,
  method = 'GET',
  data = null,
  headers = {},
  params = {},
  onSuccess = () => {},
  onError = () => {},
  trigger = true, // when false, it won't auto-fetch on mount
  bustCache = false, // bust GET cache by default
  timeout = 10000, // 10 seconds
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trigger) return;
    console.log("hea",headers);
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const requestConfig = {
          url,
          method: method.toLowerCase(),
          headers,
          params: { ...(bustCache && method.toUpperCase() === 'GET' ? { _ts: Date.now() } : {}), ...params },
          data,
          timeout,
        };

        const res = await axios(requestConfig);
        setResponse(res.data);
        onSuccess(res.data);
        
    } catch (err) {
        let friendlyError = {
            message: 'Something went wrong.',
          status: null,
          details: null,
        };

        if (err.response) {
          // Server responded with a status outside 2xx
          friendlyError = {
              message: err.response.data?.message || 'Server error occurred.',
              status: err.response.status,
              details: err.response.data,
            };
        } else if (err.request) {
          // Request was made but no response
          friendlyError.message = 'No response from server. Please check your network.';
        } else {
            // Something happened in setting up the request
          friendlyError.message = err.message;
        }
        
        setError(friendlyError);
        onError(friendlyError);
    } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, url, method, JSON.stringify(params), JSON.stringify(data)]); // re-fetch if any of these change

  return { loading, response, error };
};

export default Fetcher;
