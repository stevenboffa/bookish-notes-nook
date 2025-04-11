import { Helmet } from "react-helmet";

interface MetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  customTitle?: string;
  ogImage?: string;
}

export const Meta = ({
  title,
  description,
  canonicalUrl,
  customTitle,
  ogImage = "https://bookishnotes.com/og-image.png",
}: MetaProps) => {
  const siteTitle = customTitle || (title ? `${title} | BookishNotes` : "BookishNotes");
  const defaultDescription = "Track your reading journey, take notes on books, and connect with other readers.";
  const currentUrl = canonicalUrl || "https://bookishnotes.com";
  
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description || defaultDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage} />

      {/* Other Meta Tags */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="icon" href="/favicon.ico" type="image/x-icon" />
    </Helmet>
  );
};
