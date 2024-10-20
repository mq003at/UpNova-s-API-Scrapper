import express, { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Shoplify Scraper');
});

app.get('/scrape', async (req: Request, res: Response, next: NextFunction) => {
  const url = 'https://devonandlang.com/products/journey-boxer-brief-puglie'

  // Check if the URL is provided
  if (!url) {
    return res.status(400).json({ error: 'Please provide a valid URL' });
  }

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // // product-title's font
    const productTitleStyles = await page.evaluate(() => {
      const productTitle = document.querySelector('.product-title');

      if (!productTitle) {
        return { error: 'Element with class "product-title" not found' };
      }

      const computedStyles = window.getComputedStyle(productTitle);

      const fontUrl = productTitle.closest('a')?.getAttribute('href') || 'N/A';
      return {
        fontFamily: computedStyles.getPropertyValue('font-family'),
        fontVariantAlternates: computedStyles.getPropertyValue('font-variant-alternates'),
        letterSpacing: computedStyles.getPropertyValue('letter-spacing'),
        fontWeight: computedStyles.getPropertyValue('font-weight'),
        fontUrl
      };
    });

    // fontUrl
    const fontUrl = await page.evaluate(() => {
      let fontUrl = 'N/A';

      document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
        const href = link.getAttribute('href');
        if (href && href.includes('fonts')) {
          fontUrl = href; 
        }
      });

      document.querySelectorAll('style').forEach((styleTag) => {
        const styleContent = styleTag.innerHTML;
        if (styleContent.includes('@font-face') && styleContent.includes('src:')) {
          const fontFaceMatch = styleContent.match(/src:\s*url\(([^)]+)\)/);
          if (fontFaceMatch) {
            fontUrl = fontFaceMatch[1];  
          }
        }
      });

      return fontUrl;
    });

    const titleFontDetails = {...productTitleStyles, fontUrl};

    // primary button
    const fontDetails = await page.evaluate(() => {
      const button = document.querySelector('form[action*="/cart/add"] button');

      if (!button) {
        return { error: 'Button not found' };
      }

      const computedStyles = window.getComputedStyle(button);
      
      return {
        fontFamily: computedStyles.getPropertyValue('font-family'),
        fontSize: computedStyles.getPropertyValue('font-size'),
        lineHeight: computedStyles.getPropertyValue('line-height'),
        letterSpacing: computedStyles.getPropertyValue('letter-spacing'),
        textTransform: computedStyles.getPropertyValue('text-transform'),
        textDecoration: computedStyles.getPropertyValue('text-decoration'),
        textAlign: computedStyles.getPropertyValue('text-align'),
        backgroundColor: computedStyles.getPropertyValue('background-color'),
        color: computedStyles.getPropertyValue('color'),
        borderColor: computedStyles.getPropertyValue('border-color'),
        borderWidth: computedStyles.getPropertyValue('border-width'),
        borderRadius: computedStyles.getPropertyValue('border-radius')
      };
    });

    await browser.close();

    // Error at fontDetails
    if (fontDetails.error) {
      return res.status(404).json({ error: fontDetails.error });
    }

    if (productTitleStyles.error) {
      return res.status(404).json({ error: productTitleStyles.error });
    }
    

    return res.json({
      url: url,
      fonts: titleFontDetails,
      primaryButton: fontDetails
    });
  } catch (error) {
    next(error);
  }
});


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
