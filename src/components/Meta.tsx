
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
  
  return (
    <Helmet>
      <title>{siteTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      <link rel="icon" href="/lovable-uploads/41ae37f8-6871-4b3b-ad5d-9f6cc38a795e.png" type="image/png" />
    </Helmet>
  );
};
