// models/MarketAnalysis.ts

// Main article type with rich markdown content and metadata
export interface MarketAnalysis {
  _id: string;             // MongoDB document ID
  title: string;           // Article title
  slug: string;            // URL-friendly version of title
  summary: string;         // Short summary for previews
  content: string;         // Full markdown content
  author: Author;          // Author information
  publishedAt: string;     // ISO date string
  updatedAt: string;       // ISO date string
  tags: Tag[];             // Array of tags
  coverImage: string;      // URL to cover image
  readingTime: number;     // Estimated reading time in minutes
  featuredTokens: Token[]; // Tokens mentioned/analyzed in the article
  relatedArticles: string[]; // IDs of related articles
  seoMetadata: SEOMetadata; // SEO-related information
  viewCount: number;       // Number of views
  featured: boolean;       // Whether this is a featured article
  category: string;        // Main category (e.g., "Market Analysis", "DeFi", "NFTs")
}

// Author information
export interface Author {
_id: string;
name: string;
avatar: string;
title: string;           // E.g., "Senior Market Analyst"
bio?: string;            // Optional short bio
}

// Tags for categorization
export interface Tag {
_id: string;
name: string;
slug: string;
color?: string;          // Optional color for UI display
}

// Token information for tokens mentioned in article
export interface Token {
symbol: string;           // Token symbol (e.g., "ETH")
name: string;             // Token name (e.g., "Ethereum")
price: number;            // Current price in USD
priceChange24h: number;   // 24h price change percentage
logoUrl?: string;         // URL to token logo
description?: string;     // Optional short description
highlighted: boolean;     // Whether this token is particularly highlighted in the article
}

// SEO metadata
export interface SEOMetadata {
metaTitle?: string;       // Custom meta title if different from article title
metaDescription: string;  // Meta description for search engines
keywords: string[];       // SEO keywords
canonical?: string;       // Canonical URL if needed
ogImage?: string;         // Open Graph image URL
}

// Market news/insights feed item - shorter updates
export interface MarketInsight {
_id: string;
content: string;          // Can contain simple markdown
excerpt?: string;         // Short excerpt of the content
card_text?: string;       // Short text displayed in the card
publishedAt: string;      // ISO date string
importance: 'low' | 'medium' | 'high'; // Importance level
relatedTokens: string[];  // Token symbols related to this insight
source?: string;          // Optional source attribution
url?: string;             // Optional link to full article or external source
}

// Example query interface for getting market analysis
export interface GetMarketAnalysisParams {
category?: string;
tag?: string;
date?: string;            // Date in YYYY-MM-DD format
featured?: boolean;
limit?: number;
skip?: number;
sort?: 'newest' | 'oldest' | 'popular';
}

// Example response from the API
export interface MarketAnalysisResponse {
analysis: MarketAnalysis[];
total: number;
hasMore: boolean;
}

// Example response for market insights feed
export interface MarketInsightsResponse {
insights: MarketInsight[];
lastUpdated: string;      // ISO date string of last update
}