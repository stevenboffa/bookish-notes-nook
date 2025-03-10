
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
  const ogImage = "https://bookishnotes.com/lovable-uploads/a86f382a-f265-4e32-8b2f-29ce02995a74.png";
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="icon" href="/lovable-uploads/41ae37f8-6871-4b3b-ad5d-9f6cc38a795e.png" type="image/png" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl || "https://bookishnotes.com"} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl || "https://bookishnotes.com"} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={description || defaultDescription} />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};
