import fetch from 'node-fetch';

export default (query, page) => {
  const allSearches = [
    searchUnsplash (query, page),
    searchPexels   (query, page),
    searchPixabay  (query, page),
  ];
  return Promise.allSettled(allSearches).then(results => results);
}

async function searchUnsplash(query, page, per_page = 20) {
  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.append("query", query);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", per_page);

  const headers = {
    "Authorization": "Client-ID " + process.env.UNSPLASH_KEY,
  };
  const options = {
    "headers": headers,
  };

  const response = await fetch(url, options);
  const parsedResponse = await response.json();
  const photos = parsedResponse["results"];
  return {"unsplash": photos};
}

async function searchPexels(query, page, per_page = 20) {
  const url = new URL("https://api.pexels.com/v1/search");
  url.searchParams.append("query", query);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", per_page);

  const headers = {
    "Authorization": process.env.PEXELS_KEY,
  };
  const options = {
    "headers": headers,
  };

  const response = await fetch(url, options);
  const parsedResponse = await response.json();
  const photos = parsedResponse["photos"];
  return {"pexels": photos};
}

async function searchPixabay(query, page, per_page = 20) {
  const url = new URL("https://pixabay.com/api/");
  url.searchParams.append("q", query);
  url.searchParams.append("page", page);
  url.searchParams.append("per_page", per_page);
  url.searchParams.append("key", process.env.PIXABAY_KEY);

  const response = await fetch(url);
  const parsedResponse = await response.json();
  const photos = parsedResponse["hits"];
  return {"pixabay": photos};
}
