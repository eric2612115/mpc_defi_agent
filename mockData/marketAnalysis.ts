// mockData/marketAnalysis.ts

// Market Analysis interface based on the API response
export interface MarketAnalysis {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  tags: Tag[];
  coverImage: string;
  readingTime: number;
  featuredTokens: Token[];
  relatedArticles: string[];
  seoMetadata: SEOMetadata;
  viewCount: number;
  featured: boolean;
  category: string;
}

// Market Insight interface
export interface MarketInsight {
  _id: string;
  content: string;
  excerpt?: string;
  card_text?: string;
  publishedAt: string;
  importance: 'low' | 'medium' | 'high';
  relatedTokens: string[];
  source?: string;
  url?: string;
}

// Author interface
interface Author {
  _id: string;
  name: string;
  avatar: string;
  title: string;
  bio?: string;
}

// Tag interface
interface Tag {
  _id: string;
  name: string;
  slug: string;
  color?: string;
}

// Token interface
interface Token {
  symbol: string;
  name: string;
  price: number;
  priceChange24h: number;
  logoUrl?: string;
  description?: string;
  highlighted: boolean;
}

// SEO Metadata interface
interface SEOMetadata {
  metaTitle?: string;
  metaDescription: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
}

// Mock data for market analysis
export const mockMarketAnalysis: MarketAnalysis = {
  _id: "market-analysis-1",
  title: "Bitcoin's Bull Run: What's Next?",
  slug: "bitcoins-bull-run-whats-next",
  summary: "An in-depth look at Bitcoin's recent price surge and what factors could affect its trajectory in the coming months.",
  content: "# Bitcoin's Bull Run: What's Next?\n\nBitcoin has been on a remarkable journey...",
  author: {
    _id: "author-1",
    name: "Alex Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    title: "Senior Crypto Analyst",
    bio: "Alex has been analyzing cryptocurrency markets for over 7 years."
  },
  publishedAt: "2025-03-07T08:00:00Z",
  updatedAt: "2025-03-07T10:30:00Z",
  tags: [
    {
      _id: "tag-btc",
      name: "Bitcoin",
      slug: "bitcoin",
      color: "#F7931A"
    },
    {
      _id: "tag-analysis",
      name: "Market Analysis",
      slug: "market-analysis",
      color: "#3273DC"
    }
  ],
  coverImage: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d",
  readingTime: 7,
  featuredTokens: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: 88907.5,
      priceChange24h: 2.3,
      logoUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
      highlighted: true
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: 2193.05,
      priceChange24h: -1.2,
      logoUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      highlighted: false
    }
  ],
  relatedArticles: ["article-1", "article-2"],
  seoMetadata: {
    metaDescription: "Explore Bitcoin's recent price surge and what factors could affect its trajectory in the coming months.",
    keywords: ["Bitcoin", "BTC", "cryptocurrency", "market analysis", "bull run"]
  },
  viewCount: 3457,
  featured: true,
  category: "Cryptocurrency"
};

// Mock data for market insights
export const mockMarketInsights: MarketInsight[] = [
  {
    _id: "insight-1",
    content: "Bitcoin surpasses $70,000 for the first time in 2025, marking a new all-time high.",
    excerpt: "Bitcoin reaches new all-time high above $70,000",
    card_text: "Bitcoin surpasses $70,000 for the first time in 2025, marking a new all-time high.",
    publishedAt: "2025-03-07T14:30:00Z",
    importance: "high",
    relatedTokens: ["BTC", "Bitcoin"],
    source: "CryptoNews"
  },
  {
    _id: "insight-2",
    content: "Ethereum continues to face resistance at $2,200 level despite network upgrade announcement.",
    excerpt: "Ethereum faces resistance at $2,200",
    card_text: "Ethereum continues to face resistance at $2,200 level despite upgrade announcement.",
    publishedAt: "2025-03-07T13:15:00Z",
    importance: "medium",
    relatedTokens: ["ETH", "Ethereum"],
    source: "DeFi Daily"
  }
];

// Mock function to fetch market analysis
export const fetchMarketAnalysis = async (date: string): Promise<MarketAnalysis> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real implementation, you'd use the date to fetch specific data
  return mockMarketAnalysis;
};

// Mock function to fetch market insights
export const fetchMarketInsights = async (limit: number = 5): Promise<{insights: MarketInsight[], lastUpdated: string}> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    insights: mockMarketInsights.slice(0, limit),
    lastUpdated: new Date().toISOString()
  };
};