import apiResponses from './apiHandler.js';

export default function handler(request, response) {
  const regex = /^[\w\s0-9-_']+/;
  const sanitizedQuery = request.headers.userquery.match(regex)?.[0];

  if (!sanitizedQuery) return;

  apiResponses(sanitizedQuery, request.headers.page)
    .then(data => response.json(data));
}    
