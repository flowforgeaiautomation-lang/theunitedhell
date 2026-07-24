import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import type { Article, ArticleSummary, Briefing, CommentRow, VocabEntry } from "./types";

import { relatedCategorySlugs } from "./categories";
import { lookupWords } from "./dictionary.server";

function publicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false, storage: undefined } },
  );
}

const summaryCols =
  "id,slug,title,dek,category,subcategory,cover_image_url,read_time_minutes,country_code,featured_slot,published_at,created_at,view_count,like_count,bookmark_count,comment_count";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  ldquo: "\u201C", rdquo: "\u201D", lsquo: "\u2018", rsquo: "\u2019",
  hellip: "\u2026", mdash: "\u2014", ndash: "\u2013", trade: "\u2122",
  copy: "\u00A9", reg: "\u00AE", deg: "\u00B0", middot: "\u00B7",
};

function decodeEntities(input: unknown): string {
  if (typeof input !== "string" || !input) return (input as string) ?? "";
  return input
    .replace(/&#(\d+);/g, (_, n) => {
      const code = parseInt(n, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => {
      const code = parseInt(h, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : "";
    })
    .replace(/&([a-zA-Z]+);/g, (m, name) => NAMED_ENTITIES[name] ?? m)
    .replace(/&#(\d{1,5})(?![;\d])/g, (_, n) => {
      const code = parseInt(n, 10);
      return code >= 32 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-fA-F]{1,4})(?![;0-9a-fA-F])/gi, (_, h) => {
      const code = parseInt(h, 16);
      return code >= 32 && code <= 0x10ffff ? String.fromCodePoint(code) : "";
    });
}

function decodeListMaybe<T>(items: T): T {
  if (!Array.isArray(items)) return items;
  return items.map((s) => (typeof s === "string" ? decodeEntities(s) : s)) as unknown as T;
}

function decodeSummary<T extends { title?: string | null; dek?: string | null }>(row: T): T {
  return {
    ...row,
    title: row.title ? decodeEntities(row.title) : row.title,
    dek: row.dek ? decodeEntities(row.dek) : row.dek,
  };
}

function normalizeText(s = "") {
  return s.toLowerCase().replace(/[^a-z0-9\s]+/g, " ").replace(/\s+/g, " ").trim();
}

function dedupeSummaries(rows: ArticleSummary[], limit: number) {
  const seen = new Set<string>();
  const out: ArticleSummary[] = [];
  for (const raw of rows) {
    const row = decodeSummary(raw);
    const key = normalizeText(row.title || row.dek || row.slug);
    const softKey = normalizeText(row.dek || row.title).slice(0, 110);
    if (!key || seen.has(row.id) || seen.has(key) || (softKey && seen.has(softKey))) continue;
    seen.add(row.id);
    seen.add(key);
    if (softKey) seen.add(softKey);
    out.push(row);
    if (out.length >= limit) break;
  }
  return out;
}

function looksVague(text?: string | null) {
  if (!text) return true;
  return /original source|the united hell is preserving|broader impact depends|verified new development|reliable, recent information|full primary account|future coverage in this field|published this article|this is a current|readers should check|category:/i.test(text);
}

function cleanStoryText(text?: string | null) {
  if (!text) return undefined;
  const decoded = decodeEntities(text);
  const cleaned = decoded
    // Strip ALL advertising code — scripts, ad slots, tracking, publisher code
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<ins\b[^>]*>[\s\S]*?<\/ins>/gi, "")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, "")
    .replace(/<!--[^]*?-->/g, "")
    .replace(/blogherads\.[^;]*;?/gi, "")
    .replace(/googletag\.[^;]*;?/gi, "")
    .replace(/gpt-dsk[^\s"]*/gi, "")
    .replace(/setTargeting\([^)]*\)\s*;?/gi, "")
    .replace(/defineSlot\([^)]*\)\s*;?/gi, "")
    .replace(/\.addService\([^)]*\)\s*;?/gi, "")
    .replace(/\.collapseEmptyDivs\([^)]*\)\s*;?/gi, "")
    .replace(/\.enableSingleRequest\(\)\s*;?/gi, "")
    .replace(/\.enableLazyLoad\([^)]*\)\s*;?/gi, "")
    .replace(/window\.(googletag|blogherads|adUnits|adthrive)[^;]*;?/gi, "")
    .replace(/adthrive\.[^;]*;?/gi, "")
    .replace(/data-ad-[a-z]+="[^"]*"/gi, "")
    .replace(/<div[^>]*class="[^"]*(?:ad-|ads-|advert|sponsor|promo)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<aside\b[^>]*>[\s\S]*?<\/aside>/gi, "")
    .replace(/<div[^>]*id="div-gpt-ad-[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    // Strip JavaScript code blocks that survive tag stripping (pmcCnx, connatix, etc.)
    .replace(/pmcCnx\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "")
    .replace(/pmcCnx\(\{[^}]*\}\)\.render\([^)]*\)/gi, "")
    .replace(/window\.pmc\.harmony[^;]*;?/gi, "")
    .replace(/if\s*\(\s*!?\s*window\.pmc[^;]*;?/gi, "")
    .replace(/else\s*\{[^}]*\}/gi, "")
    .replace(/pmcAtlasMG\s*:\s*\{[^}]*\}/gi, "")
    .replace(/iabPlcmt\s*:\s*\d+/gi, "")
    .replace(/playerId\s*:\s*'[^']*'/gi, "")
    .replace(/playlistId\s*:\s*'[^']*'/gi, "")
    .replace(/settings\s*:\s*\{[^}]*\}/gi, "")
    .replace(/plugins\s*:\s*\{[^}]*\}/gi, "")
    .replace(/connatix_contextual_player_div/gi, "")
    .replace(/isEventAdScheduledTime/gi, "")
    .replace(/switchToHarmonyPlayer/gi, "")
    .replace(/\.cmd\.push\(function\s*\{[^}]*\}\)/gi, "")
    .replace(/\}\)\s*;?/g, "")
    .replace(/\}\s*else\s*\{[^}]*\}/gi, "")
    // Strip "Popular on [outlet]" social embed headers
    .replace(/Popular on \w+[^\n]*(?:\n|$)/gi, "")
    // Strip "posted by an X user" / social media embed text
    .replace(/posted by an? \w+ user[^\n]*(?:\n|$)/gi, "")
    // Strip any remaining lines containing JavaScript code patterns
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (/pmcCnx|connatix|pmcAtlasMG|isEventAdScheduledTime|playlistId|playerId|pmc\.harmony|switchToHarmonyPlayer|\.cmd\.push|window\.pmc/i.test(t)) return false;
      return true;
    })
    .join("\n")
    // Strip any remaining HTML tags
    .replace(/<[^>]+>/g, "")
    // Strip boilerplate section prefixes
    .replace(/^Expert analysis:\s*/i, "")
    .replace(/^Why it matters:\s*/i, "")
    .replace(/^Did you know\?\s*/i, "")
    .replace(/^Future outlook:\s*/i, "")
    .replace(/^Historical context:\s*/i, "")
    .replace(/^What happens next:\s*/i, "")
    // Strip photo credits and attribution lines
    .replace(/\|\s*Photo Credit:[^\n]*/gi, "")
    .replace(/Photo Credit:\s*[^\n.]*/gi, "")
    .replace(/Image Credit:\s*[^\n.]*/gi, "")
    .replace(/Credit:\s*[^\n.]*/gi, "")
    // Strip comment platform boilerplate
    .replace(/Comments have to be in English[^]*(?:accounts on Vuukle\.?|accounts on Vuukle\.?)/gi, "")
    .replace(/We have migrated to a new commenting platform[^]*(?:accounts on Vuukle\.?)/gi, "")
    .replace(/Live news \/(?:[^\n]*)(?:\n|$)/gi, "")
    .replace(/Parliament proceedings[^\n]*(?:\n|$)/gi, "")
    .replace(/Cockroach Janta Party[^\n]*(?:\n|$)/gi, "")
    // Strip login/subscription/paywall/newsletter/cookie prompts
    .replace(/You can save this article by registering[^\n]*(?:\n|$)/gi, "")
    .replace(/Or sign-in if you have an account[^\n]*(?:\n|$)/gi, "")
    .replace(/Register for free[^\n]*(?:\n|$)/gi, "")
    .replace(/Subscribe to (?:read|continue|unlock)[^\n]*(?:\n|$)/gi, "")
    .replace(/Subscription required[^\n]*(?:\n|$)/gi, "")
    .replace(/Continue reading[^\n]*(?:\n|$)/gi, "")
    .replace(/Newsletter sign[^\n]*(?:\n|$)/gi, "")
    .replace(/Cookie (?:notice|policy)[^\n]*(?:\n|$)/gi, "")
    .replace(/We use cookies[^\n]*(?:\n|$)/gi, "")
    .replace(/This site uses cookies[^\n]*(?:\n|$)/gi, "")
    .replace(/Accept cookies[^\n]*(?:\n|$)/gi, "")
    .replace(/Register to read[^\n]*(?:\n|$)/gi, "")
    .replace(/Login to read[^\n]*(?:\n|$)/gi, "")
    .replace(/Sign in to read[^\n]*(?:\n|$)/gi, "")
    .replace(/Create a free account[^\n]*(?:\n|$)/gi, "")
    .replace(/Already a subscriber[^\n]*(?:\n|$)/gi, "")
    .replace(/Subscribe now[^\n]*(?:\n|$)/gi, "")
    .replace(/Unlock full access[^\n]*(?:\n|$)/gi, "")
    .replace(/Premium content[^\n]*(?:\n|$)/gi, "")
    .replace(/Members only[^\n]*(?:\n|$)/gi, "")
    .replace(/Exclusive access[^\n]*(?:\n|$)/gi, "")
    .replace(/Join now[^\n]*(?:\n|$)/gi, "")
    .replace(/Sign up for[^\n]*(?:\n|$)/gi, "")
    .replace(/Sponsored content[^\n]*(?:\n|$)/gi, "")
    .replace(/Sponsored by[^\n]*(?:\n|$)/gi, "")
    .replace(/Promo code[^\n]*(?:\n|$)/gi, "")
    // Strip any remaining lines that look like UI prompts
    .split(/\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      return !/^(save this article|sign-?in|register|subscribe|log ?in|create.*account|unlock|premium content|members only|cookie|newsletter|email address|password|remember me|forgot password|join now|sign up|sponsored|promo code|continue reading|already a subscriber)/i.test(t);
    })
    .join("\n")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => line && !/published this article|published by|source says|readers should check|category:|photo credit|image credit|credit:\s*sansad|sansad tv|vuukle|community guidelines|migrated to a new commenting|registered user|older comments|comments have to be|abusive or personal|abide by our|posting your comments|log in to post|engage with our articles|live news \/.*parliament proceedings|parliament proceedings|cockroach janta party|^\s*\d{1,3}\s*$/i.test(line))
    // Filter out login/subscription/paywall/cookie/newsletter lines
    .filter((line) => {
      const t = line.trim();
      if (!t) return false;
      if (/^(save this article|sign-?in|register|subscribe|log ?in|create.*account|unlock|premium content|members only|cookie|newsletter|email address|password|remember me|forgot password|join now|sign up|sponsored|promo code|continue reading|already a subscriber)/i.test(t)) return false;
      if (/save this article by registering|sign-in if you have an account|register for free|subscribe to|subscription required|paywall|continue reading|cookie notice|cookie policy|we use cookies|this site uses cookies/i.test(t)) return false;
      return true;
    })
    // Eliminate broken sentences — fragments, cut-offs, abrupt endings
    .filter((line) => {
      const trimmed = line.trim();
      if (trimmed.length < 15) return false;
      if (/^(,|but if|and then|\.\.\.|…|\s+but|\s+and)/i.test(trimmed)) return false;
      if (/\.{2,}|…$/.test(trimmed) && trimmed.length < 40) return false;
      return true;
    })
    .join("\n\n")
    .replace(/\b(According to|Per|As reported by|Reported by|As per|A report by|Writing for)\s+(the\s+)?[A-Z][A-Za-z0-9 .'&-]{1,40}(,|\s+said|\s+reported|\s+wrote|\s+noted)?\s*/g, "")
    .replace(/\b(Reuters|BBC(?:\s+News)?|GNews|NewsAPI|The Hindu|Times of India|Associated Press|AP News|The Associated Press|The Guardian|New York Times|NYT|CNN|Al Jazeera|Bloomberg|Financial Times|Washington Post|NPR|Fox News|Sky News|France ?24|Deutsche Welle|DW|NDTV|Hindustan Times|Indian Express|Sansad TV|Vuukle)\b/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\}\);\s*/g, "")
    .replace(/\(\)\s*;?\s*$/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned && !looksVague(cleaned) ? cleaned : undefined;
}

function splitParagraphs(text?: string) {
  return (text || "")
    .split(/\n{2,}|\r?\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function similarity(a: string, b: string) {
  const aa = new Set(normalizeText(a).split(" ").filter((w) => w.length > 2));
  const bb = new Set(normalizeText(b).split(" ").filter((w) => w.length > 2));
  if (!aa.size || !bb.size) return 0;
  let overlap = 0;
  for (const w of aa) if (bb.has(w)) overlap++;
  return overlap / Math.min(aa.size, bb.size);
}

function uniqueList(items?: (string | null | undefined)[] | null, compareAgainst: string[] = [], limit = 6) {
  const out: string[] = [];
  const normalizedAgainst = new Set(compareAgainst.map(normalizeText));
  for (const item of cleanList(items) || []) {
    const key = normalizeText(item);
    if (!key || normalizedAgainst.has(key) || out.some((old) => normalizeText(old) === key)) continue;
    // Also drop bullets that are near-duplicates (substring containment) of already-kept bullets.
    if (out.some((old) => key.length > 18 && (key.includes(normalizeText(old)) || normalizeText(old).includes(key)))) continue;
    out.push(item);
    if (out.length >= limit) break;
  }
  return out.length ? out : undefined;
}

// Split prose into sentences for cross-section dedup.
function splitSentences(text?: string | null): string[] {
  if (!text) return [];
  return text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+(?=[A-Z0-9"'])/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

// Truncate text at a complete sentence boundary — never cut mid-word or mid-sentence.
// Returns a clean summary of at most maxChars characters, ending with proper punctuation.
function truncateAtSentence(text: string | undefined | null, maxChars = 300): string | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  const sentences = splitSentences(cleaned);
  if (sentences.length === 0) return cleaned.slice(0, maxChars);
  let result = "";
  for (const sentence of sentences) {
    if ((result + " " + sentence).trim().length > maxChars && result) break;
    result = result ? result + " " + sentence : sentence;
  }
  if (!result) result = sentences[0];
  return result.replace(/\s+/g, " ").trim() || undefined;
}

// Trim a title so it never ends mid-word or mid-sentence. If the title doesn't
// end with proper punctuation, cut it back to the last complete sentence.
function cleanTitle(text: string | undefined | null): string | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return undefined;
  // If it ends with proper punctuation, it's complete
  if (/[.!?]["'')]*$/.test(cleaned)) return cleaned;
  // If it ends with an ellipsis or trailing fragment, trim back to last sentence boundary
  const sentences = splitSentences(cleaned);
  if (sentences.length > 1) {
    // Keep all complete sentences, drop the last incomplete fragment
    const complete = sentences.slice(0, -1).join(" ");
    if (complete.length > 10) return complete.replace(/\s+/g, " ").trim();
  }
  // Single sentence with no ending punctuation — return as-is (it's a headline, not truncated)
  return cleaned;
}

// Remove sentences from `target` that already appear (normalized) in `keep`.
function dedupeSentencesAgainst(target: string, keep: string[]): string | undefined {
  if (!target) return undefined;
  const keepSet = new Set(keep.map(normalizeText));
  const filtered = splitSentences(target).filter((s) => {
    const key = normalizeText(s);
    if (key.length < 24) return true; // keep short clauses/labels
    return !keepSet.has(key);
  });
  const out = filtered.join(" ").replace(/\s+/g, " ").trim();
  return out || undefined;
}


function cleanList(items?: (string | null | undefined)[] | null): string[] | undefined {
  if (!Array.isArray(items)) return undefined;
  const BOILERPLATE_LINE = /photo credit|image credit|credit:\s*sansad|sansad tv|vuukle|community guidelines|migrated to a new commenting|registered user|older comments|comments have to be|abusive or personal|abide by our|posting your comments|log in to post|engage with our articles|live news \/|parliament proceedings|cockroach janta party|^\s*\d+\s*$/i;
  const cleaned = items
    .map((s) => (typeof s === "string" ? (cleanStoryText(s) ?? "") : ""))
    .filter((s): s is string => s.length > 0 && !looksVague(s) && !BOILERPLATE_LINE.test(s));
  return cleaned.length ? cleaned : undefined;
}

// Generate vocabulary from article text when AI vocabulary is missing or inadequate.
// Uses real dictionary lookups (dictionary API + AI fallback) — never fake definitions.
const FALLBACK_STOP = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","is","was","are","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","can","this","that","these","those","it","its","as","if","then","than","so","not","no","yes","also","about","after","before","because","while","during","through","between","against","without","within","across","among","around","above","below","up","down","out","over","under","again","further","once","here","there","when","where","why","how","all","any","both","each","few","more","most","other","some","such","only","own","same","very","just","now","said","says","say","one","two","three","new","old","good","bad","big","small","high","low","long","short","great","little","get","got","make","made","go","went","come","came","take","took","give","gave","find","found","think","thought","know","knew","tell","told","ask","asked","work","worked","look","looked","seem","seemed","feel","felt","try","tried","leave","left","call","called","want","need","use","used","put","mean","meant","keep","kept","let","begin","began","help","helped","show","showed","run","play","move","live","believe","hold","bring","happen","write","sit","stand","lose","pay","meet","include","continue","set","learn","change","lead","understand","watch","follow","stop","create","speak","read","allow","add","spend","grow","open","walk","win","offer","remember","love","consider","appear","buy","wait","serve","die","send","expect","build","stay","fall","cut","reach","kill","remain","suggest","raise","pass","sell","require","report","decide","pull","break","receive","agree","pick","wear","support","hit","produce","eat","cover","catch","draw","choose","cause","point","hear","explain","hope","develop","carry","thank","improve","sign","notice","prepare","relate","represent","reveal","secure","separate","seek","share","spread","spring","stick","strike","struggle","supply","suppose","survive","target","teach","tend","test","threat","throw","touch","trade","train","treat","trouble","trust","turn","vary","view","visit","voice","vote","warn","waste","wear","week","weight","wish","wonder","worry","year","yet","young","able","address","adult","affect","age","ago","ahead","aid","aim","air","almost","alone","along","already","although","always","amount","answer","anti","apply","area","argue","arm","army","art","assault","asset","attempt","attention","attorney","audience","author","authority","available","avoid","award","aware","away","baby","back","bag","ball","band","bank","bar","base","battle","beach","beat","beautiful","bed","behind","benefit","best","better","beyond","bill","billion","bit","black","blood","blue","board","boat","body","book","born","box","boy","brain","brand","bridge","brief","broad","brother","brown","budget","building","business","busy","cabinet","campaign","cancer","candidate","capital","car","card","care","career","case","cell","center","central","century","certain","chain","chair","challenge","chance","charge","check","child","choice","church","city","civil","claim","class","clean","clear","climate","climb","clock","close","cloth","clothes","cloud","club","coach","coast","code","coffee","cold","collect","college","color","comfort","common","community","company","compare","computer","concern","condition","consumer","contain","control","cost","could","country","couple","course","court","cover","create","crime","crisis","critic","cross","crowd","current","customer","dad","damage","dance","danger","dark","data","daughter","day","dead","deal","death","debate","decade","decision","deep","defense","degree","democrat","describe","design","despite","detail","determine","development","device","difference","different","difficult","dinner","direction","director","discover","discuss","disease","doctor","dog","door","down","draw","dream","drive","drop","drug","dry","due","during","each","earlier","early","earn","earth","east","easy","economic","economy","edge","education","effect","effort","eight","either","election","electric","else","employee","end","energy","enjoy","enough","enter","entire","environment","environmental","especially","establish","even","evening","event","ever","every","everybody","everyone","everything","evidence","exactly","example","executive","exist","experience","expert","explain","eye","face","fact","factor","fail","family","far","farm","fast","father","fear","federal","few","field","fight","figure","fill","final","finally","financial","fine","finger","finish","fire","firm","first","fish","five","floor","fly","focus","follow","food","foot","force","foreign","forest","forget","form","former","forward","four","free","friend","front","full","fund","future","game","garden","gas","gate","gather","general","generation","girl","glass","global","goal","god","gold","government","green","ground","group","growth","guess","gun","guy","hair","half","hall","hand","handle","hang","happy","hard","hat","head","health","hear","heart","heat","heavy","her","herself","hide","him","himself","his","history","hit","hold","home","hope","hospital","hot","hotel","hour","house","huge","human","hundred","husband","idea","identify","image","imagine","impact","important","improve","include","including","increase","indeed","indicate","individual","industry","information","inside","instead","institution","interest","interesting","international","interview","into","investment","involve","issue","item","itself","job","join","key","kid","kind","kitchen","knowledge","land","language","large","last","late","later","laugh","law","lawyer","lay","leader","least","left","legal","less","letter","level","lie","life","light","like","likely","line","list","listen","little","local","lot","love","machine","magazine","main","maintain","major","management","manager","many","market","marriage","material","matter","maybe","measure","medical","meeting","member","memory","mention","message","method","middle","might","military","million","mind","minute","miss","mission","model","modern","moment","money","month","morning","mother","mouth","movement","movie","much","music","must","myself","name","nation","national","natural","nature","near","nearly","necessary","network","never","news","next","nice","night","nine","none","normal","north","note","nothing","notice","nuclear","number","occur","off","office","officer","official","often","oil","once","online","onto","operation","opportunity","option","order","organization","others","ought","our","outside","page","pain","painting","paper","parent","part","participant","particular","partner","party","past","patient","peace","per","perform","perhaps","period","person","personal","phone","physical","picture","piece","place","plan","plant","player","police","policy","political","politics","poor","popular","population","position","positive","possible","power","practice","prepare","present","president","pressure","pretty","prevent","price","private","probably","problem","process","product","production","professional","professor","program","project","property","protect","prove","provide","public","pull","purpose","push","quality","question","quickly","quite","race","radio","range","rate","rather","ready","real","reality","realize","really","reason","receive","recent","recently","recognize","record","red","reduce","reflect","region","relationship","religious","remove","republican","research","resource","respond","response","responsibility","rest","result","return","rich","right","rise","risk","road","rock","role","room","rule","safe","save","scene","school","science","scientist","sea","season","seat","second","section","security","sell","senator","senior","sense","series","serious","service","seven","several","shake","she","shoot","shot","should","shoulder","side","significant","similar","simple","simply","since","single","sister","site","situation","six","size","skill","skin","smile","social","society","soldier","somebody","someone","something","sometimes","somewhat","son","song","soon","sort","sound","source","south","space","special","specific","speech","sport","staff","stage","standard","star","start","state","statement","station","stay","step","still","stock","store","story","street","strong","structure","student","study","stuff","style","subject","success","successful","suddenly","suffer","summer","support","sure","surface","system","table","talk","task","teacher","team","technology","television","ten","term","thank","their","them","themselves","theory","they","thing","third","though","thousand","threat","through","throughout","throw","thus","time","today","together","tonight","too","top","total","tough","toward","town","traditional","training","travel","treatment","tree","trial","trip","true","truth","try","type","under","unit","until","upon","usually","various","victim","violence","wife","window","wind","wish","within","without","woman","word","worker","world","would","writer","wrong","yard","yeah","yes","you","your","yourself","zone",
]);

async function generateFallbackVocab(text: string, existing: VocabEntry[]): Promise<VocabEntry[]> {
  const words = text
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 6 && !FALLBACK_STOP.has(w.toLowerCase()));

  const freq = new Map<string, number>();
  for (const w of words) {
    const lw = w.toLowerCase();
    freq.set(lw, (freq.get(lw) ?? 0) + 1);
  }

  const candidates = [...freq.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .filter(([w]) => !existing.some((e) => e.word?.toLowerCase() === w))
    .slice(0, 20)
    .map(([w]) => w);

  const lookedUp = await lookupWords(candidates);
  return lookedUp
    .filter((v) => v.meaning && !/an important (word|term) used in this story/i.test(v.meaning))
    .slice(0, 5);
}

async function normalizeArticle(article: Article): Promise<Article> {
  const currentStory = article.story ?? {};
  const dec = (s?: string | null) => (s ? decodeEntities(s) : s);
  const decClean = (s?: string | null) => cleanStoryText(s);
  const fullSourceText = decClean((currentStory as any).main_story) || decClean((currentStory as any).summary) || decClean(article.dek);
  const summary = truncateAtSentence(fullSourceText, 280);
  const proseParts = [
    decClean((currentStory as any).main_story),
    decClean(currentStory.what),
    decClean(currentStory.why),
    decClean(currentStory.how),
    decClean(currentStory.before),
    decClean(currentStory.next),
    decClean(currentStory.why_should_i_care),
    decClean(currentStory.how_affects_world),
    decClean(currentStory.what_can_we_learn),
    decClean(currentStory.why_interesting),
    decClean(currentStory.did_you_know),
    decClean(currentStory.future_impact),
  ].filter(Boolean) as string[];
  const summaryNorm = normalizeText(summary || "");
  const mainStory = proseParts.length
    ? proseParts
        .flatMap(splitParagraphs)
        .filter((paragraph, index, arr) => arr.findIndex((other) => normalizeText(other) === normalizeText(paragraph)) === index)
        .filter((paragraph) => {
          if (!summary || !paragraph) return true;
          if (normalizeText(paragraph).includes(summaryNorm.slice(0, 80)) && summaryNorm.length > 20) return false;
          if (similarity(paragraph, summary) >= 0.55) return false;
          return true;
        })
        .join("\n\n")
    : undefined;

  // Build a set of sentences already used in summary + main story so secondary
  // sections never repeat them. This is the cross-section dedup that makes old
  // articles feel less stitched-together.
  const primarySentences = new Set<string>();
  for (const s of splitSentences(summary)) primarySentences.add(normalizeText(s));
  for (const s of splitSentences(mainStory)) primarySentences.add(normalizeText(s));

  const dedupeProse = (text?: string | null): string | undefined => {
    const cleaned = decClean(text);
    if (!cleaned) return undefined;
    const kept = splitSentences(cleaned).filter((s) => {
      const key = normalizeText(s);
      if (key.length < 24) return true;
      return !primarySentences.has(key);
    });
    const out = kept.join(" ").replace(/\s+/g, " ").trim();
    return out || undefined;
  };

  const keyDevelopments = uniqueList((currentStory as any).key_developments || currentStory.key_facts || currentStory.key_takeaways, [], 5);
  const quickInsights = uniqueList((currentStory as any).quick_insights || currentStory.quick_facts || currentStory.insights, keyDevelopments || [], 6);
  const readerTakeaways = uniqueList((currentStory as any).reader_takeaways || currentStory.key_takeaways, quickInsights || [], 5);
  const allText = [summary, mainStory, decClean((currentStory as any).background), decClean((currentStory as any).expert_analysis), decClean((currentStory as any).why_it_matters)].filter(Boolean).join(" ");

  const rawVocab = (currentStory as any).vocabulary?.map((v: any) => ({
    word: dec(v.word) || undefined,
    partOfSpeech: v.part_of_speech || v.partOfSpeech || undefined,
    meaning: dec(v.meaning) || undefined,
    simpleExplanation: (dec(v.simple_explanation) || dec(v.simpleExplanation) || undefined)?.replace(/^In simple terms:\s*/i, ""),
    example: v.example ? dec(v.example) : undefined,
    synonyms: Array.isArray(v.synonyms) ? v.synonyms.filter(Boolean) : undefined,
    antonyms: Array.isArray(v.antonyms) ? v.antonyms.filter(Boolean) : undefined,
    pronunciation: v.pronunciation || v.phonetic || undefined,
  })).filter((v: any) => v.word && v.meaning) || [];

  // If AI vocabulary is missing or inadequate, generate from article text.
  // This ensures every article always has vocabulary — no exceptions.
  let finalVocab = rawVocab.slice(0, 5);
  let vocabWasRegenerated = false;
  if (finalVocab.length < 3) {
    const fallback = await generateFallbackVocab(
      [summary, mainStory, decClean((currentStory as any).background), decClean((currentStory as any).expert_analysis)]
        .filter(Boolean).join(" "),
      finalVocab,
    );
    if (fallback.length) {
      finalVocab = fallback;
      vocabWasRegenerated = true;
    }
  }

  const normalized = {
    ...article,
    title: cleanTitle(cleanStoryText(article.title) ?? dec(article.title) ?? article.title),
    dek: truncateAtSentence(fullSourceText || mainStory || cleanStoryText(article.dek) || dec(article.dek) || article.dek, 280),
    story: {
      ...currentStory,
      // New fields
      summary,
      main_story: mainStory,
      background: dedupeProse((currentStory as any).background),
      key_developments: decodeListMaybe(cleanList(keyDevelopments)),
      quick_insights: decodeListMaybe(cleanList(quickInsights)),
      why_it_matters: dedupeProse((currentStory as any).why_it_matters || currentStory.why_should_i_care || currentStory.how_affects_world),
      expert_analysis: dedupeProse((currentStory as any).expert_analysis),
      timeline: decodeListMaybe(cleanList((currentStory as any).timeline)),
      key_numbers: Array.isArray((currentStory as any).key_numbers) ? (currentStory as any).key_numbers : undefined,
      people: Array.isArray((currentStory as any).people) ? (currentStory as any).people : undefined,
      organizations: Array.isArray((currentStory as any).organizations)
        ? (currentStory as any).organizations.filter((o: any) => {
            const name = (o?.name ?? "").toLowerCase();
            return !/reuters|bbc|cnn|the guardian|new york times|nyt|associated press|ap news|the hindu|times of india|al jazeera|bloomberg|fox news|sky news|ndtv|hindustan times|indian express|ani|pti|afp|xinhua|nikkei|the verge|techcrunch|wired|ars technica|engadget|nature|scientific american|new scientist|space\.com|nasa|esa|isro|sansad|vuukle/i.test(name);
          })
        : undefined,
      countries: Array.isArray((currentStory as any).countries) ? (currentStory as any).countries : undefined,
      did_you_know: decClean((currentStory as any).did_you_know),
      historical_context: dedupeProse((currentStory as any).historical_context || currentStory.before),
      future_outlook: dedupeProse((currentStory as any).future_outlook || currentStory.future_impact || currentStory.next),
      reader_takeaways: decodeListMaybe(cleanList(readerTakeaways)),
      what_happens_next: dedupeProse((currentStory as any).what_happens_next),
      vocabulary: finalVocab,
      sources: decodeListMaybe(cleanList((currentStory as any).sources)),
      // Legacy fields
      qa: undefined,
      what: decClean(currentStory.what),
      why: decClean(currentStory.why),
      next: decClean(currentStory.next),
      why_should_i_care: decClean(currentStory.why_should_i_care),
      how_affects_world: decClean(currentStory.how_affects_world),
      what_can_we_learn: decClean(currentStory.what_can_we_learn),
      why_interesting: decClean(currentStory.why_interesting),
      how: decClean(currentStory.how),
      before: decClean(currentStory.before),
      future_impact: decClean(currentStory.future_impact),
      key_facts: decodeListMaybe(cleanList(currentStory.key_facts)),
      quick_facts: decodeListMaybe(cleanList(currentStory.quick_facts)),
      key_takeaways: decodeListMaybe(cleanList(currentStory.key_takeaways)),
      insights: decodeListMaybe(cleanList(currentStory.insights)),
    },
  };

  // Persist regenerated vocabulary back to the database so the next page load
  // doesn't re-run dictionary lookups every time.
  if (vocabWasRegenerated && article.id) {
    try {
      const supabase = publicClient();
      const vocabJson = finalVocab.map((v) => ({
        word: v.word,
        part_of_speech: v.partOfSpeech || null,
        meaning: v.meaning || null,
        simple_explanation: v.simpleExplanation || null,
        example: v.example || null,
        synonyms: v.synonyms || null,
        antonyms: v.antonyms || null,
        pronunciation: v.pronunciation || null,
      }));
      supabase
        .from("articles")
        .update({ story: { ...normalized.story, vocabulary: vocabJson } })
        .eq("id", article.id)
        .then(() => {});
    } catch {}
  }

  return normalized;
}

export const listArticles = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z
      .object({
        category: z.string().optional(),
        country: z.string().optional(),
        limit: z.number().int().min(1).max(200).default(24),
        offset: z.number().int().min(0).default(0),
        sort: z.enum(["recent", "trending", "most_read", "most_saved"]).default("recent"),
        todayOnly: z.boolean().optional(),
      })
      .parse(d ?? {}),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const categorySlugs = relatedCategorySlugs(data.category);
    let q = supabase.from("articles").select(summaryCols).eq("is_published", true);
    if (data.category && categorySlugs.length) q = q.in("category", categorySlugs);
    if (data.country) q = q.eq("country_code", data.country);
    if (data.todayOnly) {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
      q = q.gte("published_at", start).lt("published_at", end);
    }
    if (data.sort === "trending") q = q.order("trending_score", { ascending: false });
    else if (data.sort === "most_read") q = q.order("view_count", { ascending: false });
    else if (data.sort === "most_saved") q = q.order("bookmark_count", { ascending: false });
    else q = q.order("published_at", { ascending: false });
    const { data: rows, error } = await q.range(data.offset, data.offset + data.limit - 1);
    if (error) throw new Error(error.message);
    return dedupeSummaries((rows ?? []) as ArticleSummary[], data.limit);
  });

export const getFeatured = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("articles")
    .select(summaryCols)
    .eq("is_published", true)
    .not("featured_slot", "is", null)
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  // Keep latest per slot.
  const bySlot = new Map<string, ArticleSummary>();
  for (const a of (data ?? []) as ArticleSummary[]) {
    if (a.featured_slot && !bySlot.has(a.featured_slot)) bySlot.set(a.featured_slot, a);
  }
  return Object.fromEntries(bySlot) as Record<string, ArticleSummary>;
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!row) return null;
    // fire-and-forget view bump — never block the page load on this
    try {
      supabase.from("articles").update({ view_count: (row.view_count ?? 0) + 1 }).eq("id", row.id).then(() => {});
    } catch {}
    return await normalizeArticle(row as unknown as Article);
  });

export const getRelated = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ category: z.string(), excludeSlug: z.string(), limit: z.number().default(4) }).parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .eq("category", data.category)
      .neq("slug", data.excludeSlug)
      .order("published_at", { ascending: false })
      .limit(data.limit);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ArticleSummary[];
  });

export const searchArticles = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ q: z.string().min(1).max(120) }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const term = `%${data.q.replace(/[%_]/g, " ")}%`;
    const { data: rows, error } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .or(`title.ilike.${term},dek.ilike.${term},category.ilike.${term}`)
      .order("published_at", { ascending: false })
      .limit(40);
    if (error) throw new Error(error.message);
    return (rows ?? []) as ArticleSummary[];
  });

export const getCountryStats = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("articles")
    .select("country_code")
    .eq("is_published", true)
    .not("country_code", "is", null);
  if (error) throw new Error(error.message);
  const counts: Record<string, number> = {};
  for (const r of (data ?? []) as { country_code: string }[]) {
    counts[r.country_code] = (counts[r.country_code] ?? 0) + 1;
  }
  return counts;
});

export const getBriefingToday = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data, error } = await supabase
    .from("briefings")
    .select("*")
    .order("briefing_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw new Error(error.message);
  const briefing = (data ?? null) as Briefing | null;

  // Always return a populated briefing, even when none has been generated yet.
  // We assemble it on the fly from the latest published articles so the section is
  // never empty for the reader.
  const pickItems = (rows: ArticleSummary[]) =>
    rows.map((r) => ({ slug: r.slug, title: r.title }));

  const buildFromArticles = async (): Promise<Briefing> => {
    const today = new Date().toISOString().slice(0, 10);
    const fetchCat = async (cats: string[], limit: number) => {
      const { data: rows } = await supabase
        .from("articles")
        .select(summaryCols)
        .eq("is_published", true)
        .in("category", cats)
        .order("published_at", { ascending: false })
        .limit(limit);
      return dedupeSummaries((rows ?? []) as ArticleSummary[], limit);
    };
    const { data: latest } = await supabase
      .from("articles")
      .select(summaryCols)
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(80);
    const latestRows = dedupeSummaries((latest ?? []) as ArticleSummary[], 60);

    const top = latestRows.slice(0, 8);
    const [discoveries, science, success, tech] = await Promise.all([
      fetchCat(["discovery", "world-discovery", "exploration", "amazing-places"], 6),
      fetchCat(["science", "scientific-discoveries", "physics", "biology", "medicine", "breakthroughs"], 6),
      fetchCat(["success-stories", "entrepreneurs", "startups", "billionaires", "business-leaders"], 6),
      fetchCat(["technology", "artificial-intelligence", "innovation", "future-technology", "robotics"], 6),
    ]);

    return {
      id: "live",
      briefing_date: today,
      intro:
        briefing?.intro ??
        "Today's most important stories, drawn from the latest published articles.",
      sections: {
        top_stories: pickItems(top),
        discoveries: pickItems(discoveries.length ? discoveries : latestRows.slice(8, 14)),
        science: pickItems(science.length ? science : latestRows.slice(14, 20)),
        success: pickItems(success.length ? success : latestRows.slice(20, 26)),
        tech: pickItems(tech.length ? tech : latestRows.slice(26, 32)),
        facts: briefing?.sections?.facts,
      },
    } as Briefing;
  };

  if (!briefing) return buildFromArticles();

  const sections = briefing.sections ?? ({} as Briefing["sections"]);
  const isEmpty =
    !sections.top_stories?.length &&
    !sections.discoveries?.length &&
    !sections.science?.length &&
    !sections.success?.length &&
    !sections.tech?.length;
  if (isEmpty) return buildFromArticles();
  return briefing;
});

export const postReflection = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        articleId: z.string().uuid(),
        body: z.string().trim().min(1).max(4000),
        promptType: z.enum(["learned", "surprised", "question", "perspective", "reply"]).optional(),
        parentId: z.string().uuid().nullable().optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: row, error } = await supabase
      .from("comments")
      .insert({
        article_id: data.articleId,
        user_id: null,
        parent_id: data.parentId ?? null,
        prompt_type: data.promptType ?? "perspective",
        body: data.body,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const bumpLike = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ commentId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.rpc("bump_comment_likes", { comment_id: data.commentId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteCommentAnon = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ commentId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("comments").delete().eq("id", data.commentId);
    if (error) throw new Error(error.message);
    return { deleted: true };
  });

export const listComments = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ articleId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: rows, error } = await supabase
      .from("comments")
      .select("id,article_id,user_id,parent_id,prompt_type,body,like_count,created_at,profiles!comments_user_id_fkey(username,display_name,avatar_url)")
      .eq("article_id", data.articleId)
      .eq("is_hidden", false)
      .order("created_at", { ascending: true })
      .limit(200);
    if (error) {
      // join hint may differ; fall back without profile join
      const { data: alt } = await supabase
        .from("comments")
        .select("id,article_id,user_id,parent_id,prompt_type,body,like_count,created_at")
        .eq("article_id", data.articleId)
        .eq("is_hidden", false)
        .order("created_at", { ascending: true })
        .limit(200);
      return (alt ?? []) as CommentRow[];
    }
    return (rows ?? []).map((r: Record<string, unknown>) => ({
      ...(r as object),
      author: (r as { profiles?: CommentRow["author"] }).profiles ?? null,
    })) as CommentRow[];
  });
