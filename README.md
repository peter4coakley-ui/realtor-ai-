# PropertyLens AI

Professional AI-powered photo editing platform that transforms ordinary images into stunning visual content. Built for creative professionals, photographers, and visual artists.

## Features

### Core Editing Capabilities
- **Room Transformation**: Completely clear and redesign rooms with full creative freedom
- **Twilight Conversions**: Transform daytime photos into stunning twilight shots
- **Scene Enhancement**: Perfect skies, vibrant landscaping, and dramatic improvements
- **AI Chat Editing**: Natural language editing - describe any modification you want
- **Material Replacements**: Change flooring, walls, exteriors with photorealistic results
- **Advanced Retouching**: Remove objects, fix imperfections, add/modify elements
- **Structural Modifications**: Add windows, remove walls, change architecture as desired

### Platform Features
- **Unrestricted Creativity**: Full creative freedom for any type of edit or transformation
- **Authentication**: Secure user authentication with Supabase
- **Multi-tier Subscriptions**: Free, Pro, and Enterprise plans
- **Usage Tracking**: Monitor edit usage and subscription limits
- **Project Management**: Organize photos by project or property
- **Version History**: Track all editing iterations with complete history
- **Responsive Design**: Mobile-friendly interface for editing on any device
- **Batch Processing**: Edit multiple photos simultaneously (Pro+)

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Image for photorealistic generation
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Payments**: Stripe (ready for integration)
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google AI Studio API key
- Stripe account (optional, for payments)

### Environment Variables

Create a `.env` file with the following:

```env
VITE_GOOGLE_API_KEY=your_google_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
npm install
npm run dev
```

### Database Setup

The database migrations are already applied. The schema includes:

- **profiles**: User profiles with subscription information
- **properties**: Projects or property collections
- **image_projects**: Individual images within projects
- **image_versions**: Different edited versions of images
- **chat_messages**: AI conversation history
- **usage_logs**: Track API usage for billing
- **team_members**: Team collaboration (future feature)

### Storage Setup

Supabase Storage bucket `property-images` is configured with:
- 10MB file size limit
- Allowed formats: JPG, PNG, WEBP
- User-scoped access control
- Organized by: `{user_id}/{project_id}/{image_project_id}/{version_id}.png`

## Project Structure

```
project/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── ChatPanel.tsx   # AI chat interface
│   ├── ImagePanel.tsx  # Image editing canvas
│   └── Header.tsx      # Navigation header
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state
├── hooks/              # Custom React hooks
│   └── usePhotoMind.ts # Main editing logic
├── lib/                # Library configurations
│   └── supabase.ts     # Supabase client
├── pages/              # Page components
│   ├── LandingPage.tsx # Marketing landing page
│   ├── AuthPage.tsx    # Sign in/up
│   ├── HomePage.tsx    # Project dashboard
│   ├── PropertyPage.tsx # Project photos view
│   ├── EditorPage.tsx  # Photo editor
│   └── SettingsPage.tsx # Account settings
├── services/           # API services
│   ├── geminiService.ts # Google AI integration
│   ├── supabaseService.ts # Database operations
│   └── listingScraperService.ts # URL import
├── utils/              # Utility functions
│   ├── fileUtils.ts    # File operations
│   └── imageUtils.ts   # Image processing
├── constants.ts        # Editing presets
├── theme.ts            # Design system
└── types.ts            # TypeScript types
```

## Subscription Tiers

### Free Plan
- 10 edits per month
- All editing presets
- AI chat editing
- HD downloads
- 7-day free trial

### Pro Plan - $29/month
- 200 edits per month
- All editing presets
- Advanced AI features
- Batch processing
- Priority support

### Enterprise Plan - $99/month
- Unlimited edits
- Team collaboration
- API access
- White-label options
- Dedicated support

## AI Prompt Engineering

The platform uses advanced prompt engineering for professional results:

- **Creative Freedom**: Prompts support any type of modification including structural changes
- **Photorealism**: Emphasis on natural lighting, shadows, and texture preservation
- **Quality Control**: Multi-step validation for professional-grade output
- **Context Awareness**: Prompts adapt based on image type and edit complexity
- **Cumulative Editing**: Intelligent preservation of previous edits while adding new modifications

## Stripe Integration

Stripe integration is prepared but requires configuration:

1. Create Stripe account and get API keys
2. Set up subscription products in Stripe Dashboard
3. Configure webhook endpoints for subscription events
4. Update environment variables with Stripe keys

Integration points are marked in the code with placeholder functions.

## Mobile Responsiveness

The platform is fully responsive with:
- Mobile-optimized navigation and interface
- Touch-friendly editing controls and gestures
- Collapsible chat panel on mobile devices
- Responsive grid layouts (5 columns → 1 column)
- Mobile-first Tailwind CSS breakpoints

## SEO & LLMO Optimization

- Semantic HTML5 structure
- Schema.org markup (SoftwareApplication, FAQPage)
- OpenGraph and Twitter Card meta tags
- Descriptive alt text for all images
- Proper heading hierarchy (H1 → H6)
- Fast page loads with code splitting

## Security

- Row Level Security (RLS) on all database tables
- User-scoped data access
- Secure authentication with Supabase Auth
- Protected API routes
- Input validation and sanitization
- HTTPS-only in production

## Performance

- Code splitting for optimal bundle sizes
- Image optimization with progressive loading
- CDN delivery through Supabase Storage
- Client-side caching
- Debounced API calls
- Optimistic UI updates

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Contributing

This project follows professional photography standards and quality guidelines. All contributions must maintain photorealistic output quality and seamless editing capabilities.

## License

Proprietary - All rights reserved

## Support

For support, email support@propertylens.ai or visit our help center.

---

Built with ❤️ for creative professionals and visual artists
