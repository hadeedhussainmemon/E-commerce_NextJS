"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import config from '../../config';
import { getAuthorSignature } from '../../utils/signature';

/**
 * SEO Component for managing document head
 * Updates document title, meta descriptions, and canonical URLs dynamically
 */
const SEO = ({
  title = `${config.appName} | ${config.tagline}`,
  description = config.description,
  canonical = config.api.baseUrl,
  image = `${config.api.baseUrl}/og-image.jpg`,
  type = 'website',
  prev = null,
  next = null
}) => {
  const pathname = usePathname();
  const location = { pathname };

  useEffect(() => {
    // Update page title
    document.title = title;

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update Author meta
    let authorMeta = document.querySelector('meta[name="author"]');
    if (!authorMeta) {
      authorMeta = document.createElement('meta');
      authorMeta.setAttribute('name', 'author');
      document.head.appendChild(authorMeta);
    }
    authorMeta.setAttribute('content', getAuthorSignature(config._sig));

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', image);

    const ogType = document.querySelector('meta[property="og:type"]');
    if (ogType) ogType.setAttribute('content', type);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', canonical);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute('content', title);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute('content', description);

    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', image);
    const twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (twitterCard) twitterCard.setAttribute('content', 'summary_large_image');

    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Update rel=prev/next for paginated lists
    // Remove any existing prev/next to avoid duplicates
    document.querySelectorAll('link[rel="prev"], link[rel="next"]').forEach(el => el.parentNode.removeChild(el));
    if (prev) {
      const prevLink = document.createElement('link');
      prevLink.setAttribute('rel', 'prev');
      prevLink.setAttribute('href', prev);
      document.head.appendChild(prevLink);
    }
    if (next) {
      const nextLink = document.createElement('link');
      nextLink.setAttribute('rel', 'next');
      nextLink.setAttribute('href', next);
      document.head.appendChild(nextLink);
    }

    // Inject Product-specific JSON-LD if technical type is 'product'
    if (type === 'product' && !document.getElementById('structured-data-product')) {
      const productLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': title.split('|')[0].trim(),
        'description': description,
        'image': image,
        'offers': {
          '@type': 'Offer',
          'url': canonical,
          'priceCurrency': 'PKR',
          'price': '3999', // Fallback or dynamic value
          'availability': 'https://schema.org/InStock'
        },
        'brand': {
          '@type': 'Brand',
          'name': 'Vanguard'
        }
      };

      const script = document.createElement('script');
      script.id = 'structured-data-product';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(productLd);
      document.head.appendChild(script);
    }

    // Inject Breadcrumb JSON-LD
    if (!document.getElementById('structured-data-breadcrumb')) {
      const paths = pathname.split('/').filter(Boolean);
      const breadcrumbList = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
          {
            '@type': 'ListItem',
            'position': 1,
            'name': 'Home',
            'item': config.api.baseUrl
          },
          ...paths.map((p, i) => ({
            '@type': 'ListItem',
            'position': i + 2,
            'name': p.charAt(0).toUpperCase() + p.slice(1),
            'item': `${config.api.baseUrl}/${paths.slice(0, i + 1).join('/')}`
          }))
        ]
      };

      const script = document.createElement('script');
      script.id = 'structured-data-breadcrumb';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(breadcrumbList);
      document.head.appendChild(script);
    }

    // Inject global Organization + WebSite (SearchAction) structured data only once
    if (!document.getElementById('structured-data-global')) {
      const orgLd = {
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${config.api.baseUrl}/#organization`,
            'name': config.appName,
            'url': config.api.baseUrl,
            'logo': {
              '@type': 'ImageObject',
              'url': `${config.api.baseUrl}/logo.png`
            },
            'sameAs': [
              `https://www.facebook.com/${config.socials.facebook}`,
              `https://www.instagram.com/${config.socials.instagram}`
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${config.api.baseUrl}/#website`,
            'url': config.api.baseUrl,
            'name': config.appName,
            'publisher': { '@id': `${config.api.baseUrl}/#organization` },
            'potentialAction': {
              '@type': 'SearchAction',
              'target': `${config.api.baseUrl}/?q={search_term_string}`,
              'query-input': 'required name=search_term_string'
            }
          }
        ]
      };
      const script = document.createElement('script');
      script.id = 'structured-data-global';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(orgLd);
      document.head.appendChild(script);
    }

    // Track page view for analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: canonical,
        page_path: location.pathname
      });
    }
  }, [title, description, canonical, image, type, prev, next, location.pathname]);

  return null; // This component doesn't render anything
};

export default SEO;
