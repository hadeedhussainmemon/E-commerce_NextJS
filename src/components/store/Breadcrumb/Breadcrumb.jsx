import config from '@/config';

function makeAbsolute(href, { useCanonicalDomain = false, canonicalDomain = config.api.baseUrl } = {}) {
  if (!href) return undefined;
  try {
    // if already absolute
    const u = new URL(href);
    return u.href;
  } catch (e) {
    // relative -> use canonicalDomain if requested, otherwise window.origin if available
    const base = useCanonicalDomain ? canonicalDomain : (typeof window !== 'undefined' ? window.location.origin : config.api.baseUrl);
    return `${base}${href.startsWith('/') ? href : `/${href}`}`;
  }
}

export default function Breadcrumb({ items = [], renderLd = true, className = '', useCanonicalDomain = false, canonicalDomain = config.api.baseUrl }) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: makeAbsolute(it.to || '', { useCanonicalDomain, canonicalDomain })
    }))
  };

  return (
    <>
      {/* Minimal breadcrumb */}
      <div className={`text-xs text-gray-600 mb-3 ${className}`}>
        {items.map((it, i) => (
          <React.Fragment key={`${it.name}-${i}`}>
            {i > 0 && <span className="mx-1.5">/</span>}
            {it.to && i !== items.length - 1 ? (
              <Link href={it.to} className="hover:text-black transition-colors">{it.name}</Link>
            ) : (
              <span className="text-gray-800">{it.name}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {renderLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      )}
    </>
  );
}
