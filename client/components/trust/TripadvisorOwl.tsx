/**
 * Tripadvisor's official "Ollie" owl, served by Tripadvisor (the image from
 * the badge they give listing owners). We show it as a plain image rather than
 * embedding their widget script, which slows the page and can set cookies
 * before a visitor has accepted them.
 */
const OWL_SRC = "https://www.tripadvisor.com/img/cdsi/img2/badges/ollie-11424-2.gif";

export default function TripadvisorOwl({ className }: { className?: string }) {
  return (
    <img
      src={OWL_SRC}
      alt=""
      width={31}
      height={20}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
