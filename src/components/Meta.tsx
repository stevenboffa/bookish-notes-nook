
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
    </Helmet>
  );
};
