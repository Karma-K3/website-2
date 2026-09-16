/* ============================================================
   ASCENSION COMICS — CATALOG DATA
   Edit this file to add/modify your originals. No other file
   needs to change when you add a new comic or chapter.
   ============================================================

   STRUCTURE PER COMIC:
   {
     slug:        URL-safe id (lowercase, dashes)
     title:       Display name
     author:      Creator name
     cover:       Direct image URL (Postimages/Imgur) OR "" for gradient
     coverTint:   CSS gradient used when cover is "" (optional)
     genre:       Short tag
     description: 1-2 sentence blurb
     freeChapters: How many chapters before paywall (default 5)
     chapters: [
       { number: 1, title: "Episode title", panels: [ "url1", "url2" ] }
     ]
   }

   PLACEHOLDER PANELS:
   If you don't have art yet, use the placeholder panels below.
   They render as real images so you can test the reader + paywall
   without uploading anything.
   ============================================================ */

const PLACEHOLDER_PANELS = [
  "https://placehold.co/800x1200/1a1a2e/eaeaf2?text=Panel+1",
  "https://placehold.co/800x1200/2a1a3e/eaeaf2?text=Panel+2",
  "https://placehold.co/800x1200/3e1a2e/eaeaf2?text=Panel+3",
  "https://placehold.co/800x1200/1e2e1a/eaeaf2?text=Panel+4",
  "https://placehold.co/800x1200/2e1e1a/eaeaf2?text=Panel+5"
];

/* Helper: build a chapter with placeholder panels if none supplied */
function makeChapter(number, title, panels) {
  return {
    number,
    title,
    panels: panels && panels.length ? panels : PLACEHOLDER_PANELS
  };
}

const COMICS = [
  {
    slug: "whispers-of-the-seraphim",
    title: "Whispers of the Seraphim",
    author: "DivineCreator_01",
    cover: "", // leave "" to use gradient fallback
    coverTint: "linear-gradient(45deg, #ffe6e6, #ffb3b3)",
    genre: "Fantasy",
    description: "A mortal bound by a scarlet thread climbs the ivory tower to reclaim a stolen divine destiny.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "The Gathering Storm"),
      makeChapter(2, "Ivory Threshold"),
      makeChapter(3, "Feathers & Ash"),
      makeChapter(4, "The Silent Choir"),
      makeChapter(5, "Descent of Light"),
      makeChapter(6, "The First Seal"),
      makeChapter(7, "Wings Unfurled")
    ]
  },
  {
    slug: "sins-of-crimson",
    title: "Sins of Crimson",
    author: "H.V. Aura",
    cover: "",
    coverTint: "linear-gradient(45deg, #ffe6e6, #ffb3b3)",
    genre: "Action",
    description: "Blood magic, broken oaths, and a city that feeds on secrets.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "Red Dawn"),
      makeChapter(2, "The Debt Collector"),
      makeChapter(3, "Sanguine Vow"),
      makeChapter(4, "The Butcher's Garden"),
      makeChapter(5, "Crimson Ascension"),
      makeChapter(6, "The Ninth Circle")
    ]
  },
  {
    slug: "the-alabaster-court",
    title: "The Alabaster Court",
    author: "Luna Cross",
    cover: "",
    coverTint: "linear-gradient(45deg, #ffffff, #d9f2ff)",
    genre: "Mystery",
    description: "A palace of white stone hides a throne carved from memory itself.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "The Pale Invitation"),
      makeChapter(2, "Marble & Lies"),
      makeChapter(3, "The Silent Queen"),
      makeChapter(4, "Veiled Assembly"),
      makeChapter(5, "The Cracked Crown"),
      makeChapter(6, "Court of Echoes")
    ]
  },
  {
    slug: "under-scarlet-skies",
    title: "Under Scarlet Skies",
    author: "K. R. Thorne",
    cover: "",
    coverTint: "linear-gradient(45deg, #ffb3b3, #ff6666)",
    genre: "Adventure",
    description: "Two wanderers cross a dying world lit only by a red sun.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "The Red Horizon"),
      makeChapter(2, "Salt & Static"),
      makeChapter(3, "The Hollow Road"),
      makeChapter(4, "Skies That Burn"),
      makeChapter(5, "The Last Green"),
      makeChapter(6, "Beyond the Dust")
    ]
  },
  {
    slug: "halo-breakdown",
    title: "Halo Breakdown",
    author: "V. Gabriel",
    cover: "",
    coverTint: "linear-gradient(45deg, #e6ffe6, #ffffff)",
    genre: "Sci-Fi",
    description: "Angels aren't divine. They're manufactured — and one just went offline.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "Signal Lost"),
      makeChapter(2, "The Gold Room"),
      makeChapter(3, "Fractured Wings"),
      makeChapter(4, "Protocol: Halo"),
      makeChapter(5, "Descent Into Wire"),
      makeChapter(6, "Static Prayer")
    ]
  },
  {
    slug: "ruby-shards",
    title: "Ruby Shards",
    author: "Ember Gray",
    cover: "",
    coverTint: "linear-gradient(45deg, #ffccd5, #ffb3b3)",
    genre: "Romance",
    description: "A jeweler, a thief, and a gem that remembers every hand that touched it.",
    freeChapters: 5,
    chapters: [
      makeChapter(1, "The Red Vault"),
      makeChapter(2, "Facets & Faults"),
      makeChapter(3, "Cutting Room"),
      makeChapter(4, "The Appraiser"),
      makeChapter(5, "Hardness of Heart"),
      makeChapter(6, "The Last Carat")
    ]
  }
];

/* ---------- Helper utilities ---------- */
function getComic(slug) {
  return COMICS.find(c => c.slug === slug) || null;
}

function getChapter(slug, number) {
  const c = getComic(slug);
  if (!c) return null;
  return c.chapters.find(ch => ch.number === number) || null;
}

function isChapterFree(slug, number) {
  const c = getComic(slug);
  if (!c) return false;
  return number <= (c.freeChapters ?? 5);
}

// Make available globally for inline onclick handlers
window.COMICS = COMICS;
window.getComic = getComic;
window.getChapter = getChapter;
window.isChapterFree = isChapterFree;