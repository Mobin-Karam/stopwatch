const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "تایم",
  url: "https://divtime.ir/",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://divtime.ir/?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
  inLanguage: "fa-IR",
};

export default function Head() {
  return (
    <>
      <meta name="enamad" content="65366516" />
      <link rel="manifest" href="/manifest.webmanifest" />
      <link rel="preconnect" href="https://divtimebackend.liara.run" crossOrigin="anonymous" />
      <script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
