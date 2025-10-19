# Working RSS Feeds by Category

This document lists verified working RSS feeds organized by category. Last updated: January 2025

## Technology & News

### General Tech News
- **Hacker News**: https://news.ycombinator.com/rss
- **TechCrunch**: https://techcrunch.com/feed/
- **The Verge**: https://www.theverge.com/rss/index.xml
- **Ars Technica**: https://arstechnica.com/feed/
- **Wired**: https://www.wired.com/feed/rss
- **MIT Technology Review**: https://www.technologyreview.com/feed/

## Development & Engineering

### Developer Blogs
- **Go Blog**: https://blog.golang.org/feed.atom ✅ Working
- **Rust Blog**: https://blog.rust-lang.org/feed.xml ✅ Working
- **Meta Engineering**: https://engineering.fb.com/feed/ ✅ Working
- **GitHub Blog**: https://github.blog/feed/ ✅ Working
- **Stack Overflow Blog**: https://stackoverflow.blog/feed/
- **Dev.to**: https://dev.to/feed
- **Hashnode**: https://hashnode.com/rss

### Company Engineering Blogs
- **Stripe Engineering**: https://stripe.com/blog/feed.rss
- **Airbnb Engineering**: https://medium.com/feed/airbnb-engineering
- **Uber Engineering**: https://eng.uber.com/feed/
- **Spotify Engineering**: https://engineering.atspotify.com/feed/
- **Dropbox Tech**: https://dropbox.tech/feed

## AI & Machine Learning

### AI Research & News
- **DeepMind Blog**: https://www.deepmind.com/blog/rss.xml ✅ Working
- **Hugging Face Blog**: https://huggingface.co/blog/feed.xml
- **AWS Machine Learning Blog**: https://aws.amazon.com/blogs/machine-learning/feed/
- **Machine Learning Mastery**: https://machinelearningmastery.com/feed/
- **Towards Data Science**: https://towardsdatascience.com/feed
- **Papers with Code**: https://paperswithcode.com/feed.xml

### Note on Broken AI Feeds
- ❌ **OpenAI Blog**: https://openai.com/blog/rss/ (403 Forbidden - blocks automated access)
- ❌ **Anthropic Blog**: https://blog.anthropic.com/rss (DNS/Network issues)
- ❌ **Google AI Blog**: https://ai.googleblog.com/feeds/posts/default (404 - discontinued)

## Crypto & Web3

### Blockchain & Crypto News
- **Cointelegraph**: https://cointelegraph.com/rss
- **Decrypt**: https://decrypt.co/feed
- **CoinDesk**: https://www.coindesk.com/arc/outboundfeeds/rss/
- **Ethereum Blog**: https://blog.ethereum.org/feed.xml
- **Bitcoin Magazine**: https://bitcoinmagazine.com/.rss/full/

## Design & UX

### Design Resources
- **Smashing Magazine**: https://www.smashingmagazine.com/feed/
- **Nielsen Norman Group**: https://www.nngroup.com/feed/rss/
- **UX Collective**: https://uxdesign.cc/feed
- **Designer News**: https://www.designernews.co/?format=rss
- **CSS-Tricks**: https://css-tricks.com/feed/

## Productivity & Lifestyle

### Personal Development
- **James Clear**: https://jamesclear.com/feed
- **Tim Ferriss**: https://tim.blog/feed/
- **Cal Newport**: https://www.calnewport.com/blog/feed/
- **Wait But Why**: https://waitbutwhy.com/feed
- **Farnam Street**: https://fs.blog/feed/

## Business & Startups

### Indie Hackers & Bootstrapping
- **Indie Hackers**: https://www.indiehackers.com/feed ✅ Working
- **SaaStr**: https://www.saastr.com/feed/
- **Groove Blog**: https://www.groovehq.com/blog/feed
- **Baremetrics Blog**: https://baremetrics.com/blog/feed

### Note on Broken Business Feeds
- ❌ **MicroConf**: https://microconf.com/feed/ (404 Not Found)
- ❌ **Starter Story**: https://www.starterstory.com/rss (404 Not Found)

## Science & Research

### Science News
- **Nature News**: https://www.nature.com/nature.rss
- **Science Daily**: https://www.sciencedaily.com/rss/all.xml
- **Quanta Magazine**: https://www.quantamagazine.org/feed/
- **Scientific American**: https://www.scientificamerican.com/feed/

## Security & Privacy

### Cybersecurity
- **Krebs on Security**: https://krebsonsecurity.com/feed/
- **Schneier on Security**: https://www.schneier.com/feed/atom/
- **The Hacker News**: https://feeds.feedburner.com/TheHackersNews
- **Troy Hunt**: https://www.troyhunt.com/rss/

## Common RSS Feed Issues

### SSL Certificate Errors
Some feeds like Netflix Tech Blog may have SSL certificate verification issues:
- ❌ **Netflix Tech Blog**: https://netflixtechblog.com/feed (UNABLE_TO_VERIFY_LEAF_SIGNATURE)

### Solutions:
1. Use alternative feeds from the same source
2. Check if the feed has moved to a new URL
3. Contact the site administrator
4. Use RSS feed aggregators that handle SSL issues

## Tips for Finding RSS Feeds

1. **Look for RSS icons** on websites (usually in header/footer)
2. **Common patterns**:
   - `/feed/`
   - `/rss/`
   - `/feed.xml`
   - `/rss.xml`
   - `/atom.xml`
3. **Use RSS discovery tools**:
   - Browser extensions like "RSS Feed Reader"
   - Online tools like "RSS Feed Finder"
4. **Check Medium publications**: `https://medium.com/feed/@username` or `https://medium.com/feed/publication-name`

## Maintenance Notes

- Feeds should be tested periodically as URLs can change
- Some sites block automated RSS fetching (403 errors)
- DNS issues may be temporary network problems
- 404 errors usually mean the feed has been discontinued
