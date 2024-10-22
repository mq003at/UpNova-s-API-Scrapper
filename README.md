
# Welcome to Shoplify's API Scrapper

Shoplify's API Scrapper is an API that can be used to extract data from Shoplify websites, specificly the ``Cart`` button and the ``Product's Header`` font. 

Note: this API will only works on specific product page.

# Tech used
![Generic badge](https://img.shields.io/badge/Express-v.4.21.1-red.svg) ![Generic badge](https://img.shields.io/badge/puppeteer-v.23.6.0-blue.svg)

# Guide
First, after downloading the API, you need to install all the dependancies by using

    npm install

Then, you run the server with 

    npm run dev

When the Terminal shows the line `Server is running at http://localhost:3000`, it means the server has been setuped and run correctly. We can use any web browser to extracts the data using this URL prompt

    http://localhost:3000/scrape?url=insert-your-shoplify-website-here

So for example, if I want to scrap the website `https://growgrows.com/en-us/products/plentiful-planets-sleepsuit`, this will be our URL.

    http://localhost:3000/scrape?url=https://growgrows.com/en-us/products/plentiful-planets-sleepsuit

Result:
