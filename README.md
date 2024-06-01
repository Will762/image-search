# Infinite Image Search app

## What?

This is an image searching app that returns free-to-use (upon condition of attribution) images from a number of provider APIs. At the moment those include:
- Unsplash
- Pexels
- Pixabay

It's designed to be easily extensible to more providers. To do that one must simply:
- Add a variable on the front-end that will add the provider into the search parameters of the fetch (this variable also keeps track of "remaining" results from the search, ensuring we don't a request a page of results that doesn't exist)
- add the endpoint into the "back-end" (which is a Vercel serverless function, a node runtime environment)
- normalize the data sent to the front-end

It has infinite scroll – for when you need to mainline cat content. 

## Tech used

- Vue.js
- Vite
- Vercel (Node.js runtime)

Vite and Vercel provide a starting point and back-end for secrets, but everything else is handcrafted, avoiding excessive boilerplate, UI frameworks etc. I believe in keeping things pared back where possible. Vue.js provides a nice reactive framework, however, I use native browser APIs where I think that makes more sense. For example, the modal template uses a <dialog> element, where simply pointing a <div> with v-if at a variable is arguably easier, but worse for accessibility and maybe performance.

## Why?

1. I use a lot of placeholder images in my day job building front-ends, this app conveniently pulls several together for me
2. For fun