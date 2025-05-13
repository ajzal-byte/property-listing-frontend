// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Fetcher = ({
//   isGetAll = false,
//   url,
//   method = 'GET',
//   data = null,
//   headers = {},
//   params = {},
//   onSuccess = () => {},
//   onError = () => {},
//   trigger = true, // when false, it won't auto-fetch on mount
//   bustCache = false, // bust GET cache by default
//   timeout = 10000, // 10 seconds
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!trigger) return;
    
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const requestConfig = {
//           url,
//           method: method.toLowerCase(),
//           headers,
//           params: { ...(bustCache && method.toUpperCase() === 'GET' ? { _ts: Date.now() } : {}), ...params },
//           data,
//           timeout,
//         };

//         const res = await axios(requestConfig);
//         console.log("response inside fetcher: ",res.data);

//         if(isGetAll){
//           setResponse(res.data.listings);
//           onSuccess(res.data.listings);
//         } else {
//           setResponse(res.data);
//           onSuccess(res.data);
//         }
        
//     } catch (err) {
//         let friendlyError = {
//             message: 'Something went wrong.',
//           status: null,
//           details: null,
//         };

//         if (err.response) {
//           // Server responded with a status outside 2xx
//           friendlyError = {
//               message: err.response.data?.message || 'Server error occurred.',
//               status: err.response.status,
//               details: err.response.data,
//             };
//         } else if (err.request) {
//           // Request was made but no response
//           friendlyError.message = 'No response from server. Please check your network.';
//         } else {
//             // Something happened in setting up the request
//           friendlyError.message = err.message;
//         }
        
//         setError(friendlyError);
//         onError(friendlyError);
//     } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [trigger, url, method, JSON.stringify(params), JSON.stringify(data)]); // re-fetch if any of these change

//   return { loading, response, error };
// };

// export default Fetcher;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Fetcher = ({
  isGetAll = false,
  url,
  method = 'GET',
  data = null,
  headers = {},
  params = {},
  onSuccess = () => {},
  onError = () => {},
  trigger = true,
  bustCache = false,
  timeout = 10000,
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!trigger) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      const baseConfig = {
        method: method.toLowerCase(),
        headers,
        timeout,
      };

      const buildParams = (page = 1) => ({
        ...(bustCache && method.toUpperCase() === 'GET' ? { _ts: Date.now() } : {}),
        ...params,
        ...(isGetAll ? { page } : {})
      });

      try {
        if (isGetAll && method.toUpperCase() === 'GET') {
          const firstRes = await axios({
            ...baseConfig,
            url,
            params: buildParams(1),
          });

          const listings = firstRes.data.listings;
          const allData = [...(listings.data || [])];
          const totalPages = listings.last_page || 1;

          // Fetch remaining pages if more than 1
          const pageFetches = [];
          for (let page = 2; page <= totalPages; page++) {
            pageFetches.push(
              axios({
                ...baseConfig,
                url,
                params: buildParams(page),
              })
            );
          }

          const otherResults = await Promise.all(pageFetches);
          otherResults.forEach(res => {
            if (res?.data?.listings?.data) {
              allData.push(...res.data.listings.data);
            }
          });

          setResponse(allData);
          onSuccess(allData);
        } else {
          const requestConfig = {
            ...baseConfig,
            url,
            params: buildParams(),
            data,
          };

          const res = await axios(requestConfig);
          const resData = res.data;

          if (isGetAll && resData.listings?.data) {
            setResponse(resData.listings.data);
            onSuccess(resData.listings.data);
          } else {
            setResponse(resData);
            onSuccess(resData);
          }
        }
      } catch (err) {
        let friendlyError = {
          message: 'Something went wrong.',
          status: null,
          details: null,
        };

        if (err.response) {
          friendlyError = {
            message: err.response.data?.message || 'Server error occurred.',
            status: err.response.status,
            details: err.response.data,
          };
        } else if (err.request) {
          friendlyError.message = 'No response from server. Please check your network.';
        } else {
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
  }, [trigger, url, method, JSON.stringify(params), JSON.stringify(data)]);

  return { loading, response, error };
};

export default Fetcher;
