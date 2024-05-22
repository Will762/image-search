import fetch from 'node-fetch';

export default (query) => {

  const searches = [];
  for (const [key, value] of Object.entries(query)) {
    if (key.match('search') && value) {
      searches.push(funcObj[key](query.userQuery, query.page));
    }
  }
  return Promise.allSettled(searches).then(results => results);
}

const funcObj = {
  async searchUnsplash(query, page, per_page = 24) {
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.append('query', query);
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', per_page);
  
    const headers = {
      'Authorization': 'Client-ID ' + process.env.UNSPLASH_KEY,
    };
    const options = {
      'headers': headers,
    };
  
    const response = await fetch(url, options);
    const json = await response.json();
    
    const totalResults = json.total;
    const photos = json.results.map(photo => {
      return {
        id: photo.id,
        smallURL: photo.urls.small,
        largeURL: photo.urls.raw,
        user: photo.user.name,
        userProfile: photo.links.html,
        userPic: photo.user.profile_image.large,
      }
    });
  
    return {
      api: 'searchUnsplash',
      totalResults: totalResults,
      photos
    };
  },
  
  async searchPexels(query, page, per_page = 24) {
    const url = new URL('https://api.pexels.com/v1/search');
    url.searchParams.append('query', query);
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', per_page);
  
    const headers = {
      'Authorization': process.env.PEXELS_KEY,
    };
    const options = {
      'headers': headers,
    };
  
    const response = await fetch(url, options);
    const json = await response.json();
  
    const totalResults = json.total_results;
    const photos = json.photos.map(photo => {
      return {
        id: photo.id,
        smallURL: photo.src.medium,
        largeURL: photo.original,
        user: photo.photographer,
        userProfile: photo.photographer_url,
        userPic: photo.userImageURL,
      }
    });
  
    return {
      api: 'searchPexels',
      totalResults: totalResults,
      photos
    };
  },
  
  async searchPixabay(query, page, per_page = 24) {
    const url = new URL('https://pixabay.com/api/');
    url.searchParams.append('q', query);
    url.searchParams.append('page', page);
    url.searchParams.append('per_page', per_page);
    url.searchParams.append('key', process.env.PIXABAY_KEY);
  
    const response = await fetch(url);
    const json = await response.json();
    
    const totalResults = json.total;
    const photos = json.hits.map(photo => {
      return {
        id: photo.id,
        smallURL: photo.webformatURL,
        largeURL: photo.largeImageURL,
        user: photo.user,
        userProfile: `https://pixabay.com/users/${photo.user}-${photo.user_id}`,
        userPic: photo.userImageURL,
      }
    });
  
    return {
      api: 'searchPixabay',
      totalResults: totalResults,
      photos,
    };
  },

}
