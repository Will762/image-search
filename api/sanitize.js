import apiResponses from './apiHandler.js';

export default function handler(request, response) {
  const regex = /^[0-9-_'A-Za-zÀ-ÖØ-öø-ÿŠš\s]+/;
  const sanitizedQuery = request.query.userQuery.match(regex)?.[0];

  console.log(request.query);
  console.log(sanitizedQuery)

  if (!sanitizedQuery) return;

  apiResponses(sanitizedQuery, request.query.page)
  .then(data => response.json(data));


  // to do ?
  // } else {
  //   return response.json({"msg": "You searched some nonsense"});
  // }
}    
