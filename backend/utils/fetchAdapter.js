import fetch from 'node-fetch';

const fetchAdapter = {
  fetch: async (url, options) => {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export default fetchAdapter;