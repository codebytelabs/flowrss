import type { CuratedPack } from '@/types';

export const curatedPacks: CuratedPack[] = [
  {
    id: 'tech-news',
    name: 'Tech News',
    description: 'Stay updated with the latest technology news and trends',
    category: 'Technology',
    icon: '💻',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://news.ycombinator.com/rss', title: 'Hacker News', description: 'Tech news and discussions' },
      { url: 'https://techcrunch.com/feed/', title: 'TechCrunch', description: 'Startup and tech news' },
      { url: 'https://www.theverge.com/rss/index.xml', title: 'The Verge', description: 'Technology, science, art, and culture' },
      { url: 'https://arstechnica.com/feed/', title: 'Ars Technica', description: 'Technology news and analysis' },
      { url: 'https://www.techmeme.com/feed.xml', title: 'Techmeme', description: 'Tech news aggregation' },
    ],
  },
  {
    id: 'developer',
    name: 'Developer & Engineering',
    description: 'Engineering blogs and developer resources',
    category: 'Development',
    icon: '👨‍💻',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://github.blog/feed/', title: 'GitHub Blog', description: 'Updates from GitHub' },
      { url: 'https://engineering.fb.com/feed/', title: 'Meta Engineering', description: 'Engineering at Meta' },
      { url: 'https://dev.to/feed', title: 'Dev.to', description: 'Developer community blogs' },
      { url: 'https://stackoverflow.blog/feed/', title: 'Stack Overflow Blog', description: 'Developer insights' },
      { url: 'https://blog.cloudflare.com/feed/', title: 'Cloudflare Blog', description: 'DevOps and networking' },
    ],
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    description: 'Artificial intelligence and ML research',
    category: 'AI',
    icon: '🤖',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://deepmind.com/blog/rss.xml', title: 'DeepMind Blog', description: 'AI research from DeepMind' },
      { url: 'https://www.technologyreview.com/feed/', title: 'MIT Technology Review', description: 'Tech and AI research' },
      { url: 'https://lexfridman.com/feed/podcast/', title: 'Lex Fridman Podcast', description: 'AI and research discussions' },
      { url: 'https://huggingface.co/blog/feed.xml', title: 'Hugging Face Blog', description: 'ML and AI developments' },
      { url: 'https://aws.amazon.com/blogs/machine-learning/feed/', title: 'AWS ML Blog', description: 'Machine learning on AWS' },
    ],
  },
  {
    id: 'design-ux',
    name: 'Design & UX',
    description: 'UI/UX design, product design, and creative inspiration',
    category: 'Design',
    icon: '🎨',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://www.smashingmagazine.com/feed/', title: 'Smashing Magazine', description: 'Web design and development' },
      { url: 'https://alistapart.com/main/feed/', title: 'A List Apart', description: 'Design and web standards' },
      { url: 'https://css-tricks.com/feed/', title: 'CSS-Tricks', description: 'CSS and frontend development' },
      { url: 'https://uxdesign.cc/feed', title: 'UX Collective', description: 'UX design articles' },
      { url: 'https://www.nngroup.com/feed/rss/', title: 'Nielsen Norman Group', description: 'UX research and insights' },
    ],
  },
  {
    id: 'business-startups',
    name: 'Business & Startups',
    description: 'Entrepreneurship, startups, and business strategy',
    category: 'Business',
    icon: '🚀',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://www.indiehackers.com/feed', title: 'Indie Hackers', description: 'Indie founder stories' },
      { url: 'https://thehustle.co/rss', title: 'The Hustle', description: 'Business news and insights' },
      { url: 'https://stratechery.com/feed/', title: 'Stratechery', description: 'Business strategy analysis' },
      { url: 'https://hbr.org/rss', title: 'Harvard Business Review', description: 'Business and management' },
      { url: 'https://www.entrepreneur.com/latest.rss', title: 'Entrepreneur', description: 'Startup and business news' },
    ],
  },
  {
    id: 'crypto-web3',
    name: 'Crypto & Web3',
    description: 'Blockchain, cryptocurrency, and decentralized tech',
    category: 'Crypto',
    icon: '₿',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://cointelegraph.com/rss', title: 'Cointelegraph', description: 'Crypto news and analysis' },
      { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', title: 'CoinDesk', description: 'Bitcoin and crypto news' },
      { url: 'https://decrypt.co/feed', title: 'Decrypt', description: 'Crypto and blockchain news' },
      { url: 'https://blog.ethereum.org/feed.xml', title: 'Ethereum Blog', description: 'Official Ethereum blog' },
    ],
  },
  {
    id: 'news-world',
    name: 'News & World',
    description: 'Global news, politics, and current events',
    category: 'News',
    icon: '🌍',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', title: 'BBC News - World', description: 'Global news coverage' },
      { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', title: 'BBC News - Technology', description: 'Tech news from BBC' },
      { url: 'https://www.theguardian.com/uk/technology/rss', title: 'The Guardian - Technology', description: 'Tech news and policy' },
      { url: 'https://www.economist.com/the-world-this-week/rss.xml', title: 'The Economist', description: 'Business and world news' },
      { url: 'https://www.npr.org/rss/rss.php?id=1001', title: 'NPR - Technology', description: 'Public radio tech news' },
    ],
  },
  {
    id: 'science-research',
    name: 'Science & Research',
    description: 'Scientific research, space, and innovation',
    category: 'Science',
    icon: '🔬',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://www.nature.com/nature.rss', title: 'Nature News', description: 'Scientific research and discoveries' },
      { url: 'https://news.mit.edu/rss/feed', title: 'MIT News', description: 'Research and innovation from MIT' },
      { url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', title: 'NASA Breaking News', description: 'Space exploration news' },
      { url: 'https://www.sciencedaily.com/rss/all.xml', title: 'Science Daily', description: 'Latest science news' },
    ],
  },
  {
    id: 'culture-longform',
    name: 'Culture & Longform',
    description: 'Essays, culture, and in-depth storytelling',
    category: 'Culture',
    icon: '📚',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://www.theatlantic.com/feed/all/', title: 'The Atlantic', description: 'Culture and analysis' },
      { url: 'https://www.newyorker.com/feed/news', title: 'The New Yorker', description: 'Longform journalism' },
      { url: 'https://feeds.feedburner.com/brainpickings/rss', title: 'Brain Pickings', description: 'Essays and culture' },
      { url: 'https://waitbutwhy.com/feed', title: 'Wait But Why', description: 'Long-form thinking' },
      { url: 'https://feeds.thisamericanlife.org/talpodcast', title: 'This American Life', description: 'Storytelling podcast' },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity & Growth',
    description: 'Personal development and productivity tips',
    category: 'Productivity',
    icon: '⚡',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://readwise.io/blog/rss', title: 'Readwise Blog', description: 'Reading and note-taking' },
      { url: 'https://www.julian.com/rss.xml', title: 'Julian Shapiro', description: 'Growth and marketing' },
      { url: 'https://jamesclear.com/feed', title: 'James Clear', description: 'Habits and productivity' },
      { url: 'https://tim.blog/feed/', title: 'Tim Ferriss', description: 'Life optimization' },
      { url: 'https://www.calnewport.com/blog/feed/', title: 'Cal Newport', description: 'Deep work and focus' },
    ],
  },
  {
    id: 'fun-comics',
    name: 'Fun & Comics',
    description: 'Comics, humor, and entertainment',
    category: 'Entertainment',
    icon: '😄',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://xkcd.com/atom.xml', title: 'xkcd', description: 'Science and tech comics' },
      { url: 'https://rss.art19.com/the-daily', title: 'The Daily (NYT)', description: 'Daily news podcast' },
    ],
  },
  {
    id: 'fediverse-mastodon',
    name: 'Fediverse - Mastodon',
    description: 'Decentralized social media feeds from Mastodon instances',
    category: 'Fediverse',
    icon: '🐘',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://mastodon.social/@Gargron.rss', title: 'Mastodon Official (@Gargron)', description: 'Mastodon creator and updates' },
      { url: 'https://fosstodon.org/@mozilla.rss', title: 'Mozilla on Fosstodon', description: 'Firefox and open source updates' },
      { url: 'https://mastodon.social/tags/opensource.rss', title: '#OpenSource on Mastodon', description: 'Open source discussions' },
      { url: 'https://mastodon.social/tags/privacy.rss', title: '#Privacy on Mastodon', description: 'Privacy and security topics' },
      { url: 'https://techhub.social/tags/technology.rss', title: '#Technology on TechHub', description: 'Tech discussions from TechHub' },
      { url: 'https://hachyderm.io/tags/programming.rss', title: '#Programming on Hachyderm', description: 'Programming community' },
      { url: 'https://fosstodon.org/tags/linux.rss', title: '#Linux on Fosstodon', description: 'Linux and FOSS community' },
      { url: 'https://hachyderm.io/@fasterthanlime.rss', title: 'fasterthanlime on Hachyderm', description: 'Programming and tech insights' },
    ],
  },
  {
    id: 'fediverse-lemmy',
    name: 'Fediverse - Lemmy',
    description: 'Reddit-like communities from the Fediverse',
    category: 'Fediverse',
    icon: '🦊',
    isPopular: true,
    downloadCount: 0,
    feeds: [
      { url: 'https://openrss.org/lemmy.ml/c/linux', title: 'Lemmy - Linux Community', description: 'Linux discussions and news' },
      { url: 'https://openrss.org/programming.dev/c/programming', title: 'Lemmy - Programming', description: 'Programming community' },
      { url: 'https://openrss.org/lemmy.ml/c/privacy', title: 'Lemmy - Privacy', description: 'Privacy and security discussions' },
      { url: 'https://openrss.org/beehaw.org/c/technology', title: 'Lemmy - Technology (Beehaw)', description: 'Tech news and discussions' },
      { url: 'https://openrss.org/lemmy.world/c/selfhosted', title: 'Lemmy - Self-Hosted', description: 'Self-hosting community' },
      { url: 'https://openrss.org/programming.dev/c/rust', title: 'Lemmy - Rust Programming', description: 'Rust language community' },
      { url: 'https://openrss.org/lemmy.ml/c/opensource', title: 'Lemmy - Open Source', description: 'Open source projects and news' },
    ],
  },
  {
    id: 'fediverse-mixed',
    name: 'Fediverse - Mixed',
    description: 'Curated mix of Fediverse platforms (Mastodon, Lemmy, PeerTube)',
    category: 'Fediverse',
    icon: '🌐',
    isPopular: false,
    downloadCount: 0,
    feeds: [
      { url: 'https://mastodon.social/@Gargron.rss', title: 'Mastodon Official', description: 'Mastodon updates' },
      { url: 'https://hachyderm.io/@fasterthanlime.rss', title: 'fasterthanlime on Hachyderm', description: 'Programming and tech insights' },
      { url: 'https://mastodon.social/tags/fediverse.rss', title: '#Fediverse on Mastodon', description: 'Fediverse discussions' },
    ],
  },
];

export function getCuratedPackById(id: string): CuratedPack | undefined {
  return curatedPacks.find(pack => pack.id === id);
}

export function getPopularPacks(): CuratedPack[] {
  return curatedPacks.filter(pack => pack.isPopular);
}

export function getPacksByCategory(category: string): CuratedPack[] {
  return curatedPacks.filter(pack => pack.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(curatedPacks.map(pack => pack.category)));
}
