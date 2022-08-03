import type { NavbarConfig } from '@svelteness/kit-docs';

type Config = {
  siteUrl: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  openGraph: {
    title: string;
    url: string;
    image: string;
    siteName: string;
    type: string;
    description: string;
    locale: string;
  };
  github: string;
  discord: string;
  algolia: {
    apiKey: string;
    appId: string;
  };
};

const isProduction = false;

export const config = Object.freeze<Config>({
  siteUrl: isProduction
    ? 'https://fast-endpoints.com'
    : 'https://fast-endpoints-doc-site.vercel.app',
  seo: {
    title: 'FastEndpoints',
    description: 'FastEndpoints is a developer friendly alternative to Minimal APIs & MVC',
    keywords: [
      'fastendpoints',
      'rest api',
      'restful api',
      'web api',
      'minimal apis',
      'mvc',
      '.net',
      '.net6',
      'dotnet',
      'csharp',
      'backend development'
    ]
  },
  openGraph: {
    title: 'FastEndpoints',
    url: 'https://fast-endpoints.com',
    image: '/fe-og-image.png',
    siteName: 'FastEndpoints',
    type: 'website',
    description:
      'FastEndpoints is a developer friendly alternative to Minimal APIs & MVC for rapid REST API development.',
    locale: 'en'
  },
  github: 'https://github.com/dj-nitehawk/FastEndpoints',
  discord: 'https://discord.com/invite/yQZ4uvfF2E',
  algolia: {
    apiKey: 'dbd4bfe95a65436b50a0749102e9f96a',
    appId: '8VRRQJZ5I9'
  }
});

// Navigation
export const navbar: NavbarConfig = {
  links: [
    { title: 'Documentation', slug: '/docs', match: /\/docs/ },
    { title: 'Benchmarks', slug: '/benchmarks', match: /\/benchmarks/ },
    {
      title: 'Tutorial',
      slug: 'https://dev.to/djnitehawk/building-rest-apis-in-net-6-the-easy-way-3h0d'
    },
    {
      title: 'API Reference',
      slug: 'https://api-ref.fast-endpoints.com/api/FastEndpoints.html'
    },
    { title: 'Donate', slug: 'https://www.paypal.com/donate/?hosted_button_id=AU3SCQX9FXYCS' }
  ]
};
