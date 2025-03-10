
import { Helmet } from "react-helmet";

interface MetaProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

export const Meta = ({
  title,
  description,
  canonicalUrl,
}: MetaProps) => {
  const siteTitle = title ? `${title} | BookishNotes.com` : "BookishNotes.com";
  const defaultDescription = "Track your reading journey, take notes on books, and connect with other readers.";
  const ogImage = "/lovable-uploads/4bd228ff-1a0e-4841-a5de-fc9f548c91ed.png";
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="icon" href="/lovable-uploads/41ae37f8-6871-4b3b-ad5d-9f6cc38a795e.png" type="image/png" />
      
      {/* Open Graph / Social Media Meta Tags */}
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content="website" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};
