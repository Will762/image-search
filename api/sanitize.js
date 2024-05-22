import apiResponses from './apiHandler.js';

export default function handler(request, response) {
  const regex = /^[0-9-_'A-Za-zÀ-ÖØ-öø-ÿŠš\s]+/;
  const sanitizedUserQuery = request.query.userQuery.match(regex)?.[0];
  
  if (!sanitizedUserQuery) return;
  const sanitizedQuery = request.query;
  sanitizedQuery.userQuery = sanitizedUserQuery;

  console.log(request.query);
  apiResponses(sanitizedQuery)
  .then(data => response.json(data));


  // to do ?
  // } else {
  //   return response.json({"msg": "You searched some nonsense"});
  // }
}    
