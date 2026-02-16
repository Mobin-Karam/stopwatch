const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "تایم",
  url: "https://time.example.com/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://time.example.com/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  inLanguage: "fa-IR",
};

export default function Head() {
  return (
    <>
      <meta name="enamad" content="65366516" />
      <script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
