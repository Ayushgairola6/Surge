# Kindered - Dating Gossip Social Platform
(Although the name of the repo is Kindered the name of the platform has been changed to kindered)
 <!-- Add your banner image here -->

Kindered is a niche social networking platform focused exclusively on dating-related gossip. Unlike larger platforms (Reddit, X, Facebook), Kindered offers a streamlined space where users can share experiences without getting lost in noise.

## Key Differentiators
✅ **Focused content** - Only dating gossip, no off-topic clutter  
✅ **Community-first design** - Everyone gets heard  
✅ **Real-time interactions** - Live notifications & chats  

## Tech Stack

### Frontend
- **Next.js** (App Router) - SSR for performance & SEO  
- **Tailwind CSS** - Optimized styling (no UI libs to reduce bundle size)  
- **Micro-component architecture** - Buttery smooth UX  

### Backend  
- **Node.js + Express** - Multi-threaded request handling  
- **Socket.IO** - Real-time features  
- **MySQL** - Relational data storage  
- **Firebase Storage** - Media handling  

## Core Features

### 🔍 Filter-Based Posts
- Categorized content (Red Flags, First Date Stories, Hookups, etc.)  
- Preview cards with author info & post snippets  
- "Read More" redirect to full posts  

### 📖 Detailed Post View
- Blog-style formatting (text + images)  
- Clean reading experience  

### 🤖 AI Summarizer (Gemini 2.0 Flash)  
- Instant post summaries  
- Multi-language support  
- *Future: Premium feature after user growth*  

### 💬 Author Connections  
- Direct chat initiation from posts  
- *Future: Request/accept connection system*  

### ⚡ Real-Time Features  
- Live notifications (likes, messages)  
- Socket.IO powered chats  

### 🚀 Performance Optimizations  
- Next.js SSR  
- Minimal bundle size  
- Optimized component rendering  

## Future Roadmap
- [ ] UI/UX refinements based on feedback  
- [ ] Caching implementation  
- [ ] Scalability optimizations  
- [ ] Premium features (AI summarizer paywall)  

## Project Structure (Monorepo)
