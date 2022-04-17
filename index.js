const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

//publishing api -> RapidAPI -> Heroku + .gitignore(node_modules) + full deployment -> Finalize configuration RapidAPI

// scraping these addresses 
const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
     {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
          base: ''
    },
     {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/environment/climate-change',
          base: 'https://www.telegraph.co.uk'
    },
]

const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
     const html = response.data
     const $ = cheerio.load(html)

     $('a:contains("climate")', html).each(function () {
      // whatever comes back -> $(this)
      const title = $(this).text()
      const url = $(this).attr('href')

      // appending
      articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name
      })
     })
    })
})

app.get('/', (req, res) => {
    res.json("Welcome to my Climate Change News Api")
});


//app.get('/news', (req, res) => {
//axios.get('https://www.theguardian.com/environment/climate-crisis')
//.then((response) => {
 //   const html = response.data
    // getting elements
//   const $ = cheerio.load(html)

   //grabbing elements that contain 'climate' and getting text
 //  $('a:contains("climate")', html).each(function () {
  //  const title = $(this).text()
  //  const url = $(this).attr('href')
    // pushing this object in the articles array
 //   articles.push({
   //     title,
   //     url
   // })
  // })
   //parsing and displaying articles
 //  res.json(articles)
// }).catch((err) => console.log(err));
// })

app.get('/', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
  const newspaperId = req.params.newspaperId

  const newspaperAddress = newspaperId.filter(newspaper => newspaper.names == newspaperId)[0].address
  const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

  axios.get(newspaperAddress)
  .then(response => {
      const html = response.data
      const $ = cheerio.load(html)
      const specificArticles = []

     $('a:contains("climate")', html).each(function () {

      const title = $(this).text()
      const url = $(this).attr('href')
      specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId
      })
     })
     res.json(specificArticles)
  }).catch(err => console.log(err))
})



app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));