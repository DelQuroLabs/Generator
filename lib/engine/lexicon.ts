import type { Morpheme } from './contracts';

/**
 * Original, hand-curated morpheme corpus.
 * English transliterations tagged with semantic field, etymological origin,
 * position, syllable count, and phonetic hardness. No copyrighted dictionary
 * source was copied; meanings are brief glosses for explanation purposes.
 */
export const LEXICON: readonly Morpheme[] = [
  // ── TECHNOLOGY / SCIENCE ──────────────────────────────────────────────
  { text: 'tech', meaning: 'skill, craft', positions: ['prefix', 'root'], fields: ['technology'], origins: ['classical', 'coined'], syllables: 1, hardness: 'hard', styles: ['compound', 'coined'] },
  { text: 'byte', meaning: 'unit of data', positions: ['root', 'suffix'], fields: ['technology'], origins: ['coined'], syllables: 1, hardness: 'hard', styles: ['compound', 'coined'] },
  { text: 'cyber', meaning: 'govern, steer', positions: ['prefix'], fields: ['technology'], origins: ['classical', 'coined'], syllables: 2, hardness: 'soft' },
  { text: 'nano', meaning: 'dwarf, very small', positions: ['prefix'], fields: ['technology', 'science', 'nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'quant', meaning: 'how much, quantity', positions: ['prefix', 'root'], fields: ['science', 'technology', 'finance'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'synth', meaning: 'put together', positions: ['prefix', 'root'], fields: ['technology', 'science', 'arts'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'auto', meaning: 'self', positions: ['prefix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'mesh', meaning: 'interwoven net', positions: ['root'], fields: ['technology'], origins: ['germanic'], syllables: 1, hardness: 'soft' },
  { text: 'core', meaning: 'central part', positions: ['root', 'suffix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'flux', meaning: 'flow', positions: ['root', 'suffix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'pixel', meaning: 'picture element', positions: ['root'], fields: ['technology', 'arts'], origins: ['coined'], syllables: 2, hardness: 'hard' },
  { text: 'logic', meaning: 'reason', positions: ['root', 'suffix'], fields: ['technology', 'science', 'education'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'grid', meaning: 'network of lines', positions: ['root'], fields: ['technology'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'code', meaning: 'system of signals', positions: ['root'], fields: ['technology'], origins: ['classical'], syllables: 1, hardness: 'hard' },

  // ── BIOLOGY / MEDICINE ────────────────────────────────────────────────
  { text: 'bio', meaning: 'life', positions: ['prefix'], fields: ['biology', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'gen', meaning: 'origin, birth', positions: ['root', 'suffix'], fields: ['biology', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'thera', meaning: 'healing', positions: ['prefix', 'root'], fields: ['biology'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'vita', meaning: 'life', positions: ['root'], fields: ['biology', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'cell', meaning: 'small room', positions: ['root'], fields: ['biology', 'technology'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'zym', meaning: 'ferment', positions: ['root', 'suffix'], fields: ['biology', 'food'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'phyto', meaning: 'plant', positions: ['prefix'], fields: ['biology', 'nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'neuro', meaning: 'sinew, nerve', positions: ['prefix'], fields: ['biology', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'med', meaning: 'to heal', positions: ['prefix', 'root'], fields: ['biology'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'helix', meaning: 'spiral', positions: ['root'], fields: ['biology', 'science'], origins: ['classical'], syllables: 2, hardness: 'hard' },
  { text: 'spore', meaning: 'seed', positions: ['root'], fields: ['biology', 'nature'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'vexo', meaning: 'to change, alter', positions: ['prefix', 'root'], fields: ['biology'], origins: ['classical'], syllables: 2, hardness: 'soft' },

  // ── NATURE / EARTH ────────────────────────────────────────────────────
  { text: 'terra', meaning: 'earth', positions: ['prefix', 'root'], fields: ['nature', 'travel'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'aqua', meaning: 'water', positions: ['prefix', 'root'], fields: ['nature', 'food'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'lumen', meaning: 'light', positions: ['root'], fields: ['nature', 'science', 'arts'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'silva', meaning: 'forest', positions: ['root'], fields: ['nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'ignis', meaning: 'fire', positions: ['root'], fields: ['nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'aer', meaning: 'air', positions: ['prefix', 'root'], fields: ['nature', 'space'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'verd', meaning: 'green', positions: ['prefix', 'root'], fields: ['nature', 'fashion'], origins: ['romance'], syllables: 1, hardness: 'soft' },
  { text: 'stone', meaning: 'stone', positions: ['root', 'suffix'], fields: ['nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'brook', meaning: 'small stream', positions: ['root'], fields: ['nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'fern', meaning: 'fern plant', positions: ['root'], fields: ['nature'], origins: ['germanic'], syllables: 1, hardness: 'soft' },
  { text: 'mar', meaning: 'sea', positions: ['prefix', 'root'], fields: ['nature', 'travel'], origins: ['romance'], syllables: 1, hardness: 'soft' },
  { text: 'sol', meaning: 'sun', positions: ['prefix', 'root'], fields: ['nature', 'space'], origins: ['classical', 'romance'], syllables: 1, hardness: 'soft' },
  { text: 'luna', meaning: 'moon', positions: ['prefix', 'root'], fields: ['nature', 'space'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'oak', meaning: 'oak tree', positions: ['root'], fields: ['nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'willow', meaning: 'willow tree', positions: ['root'], fields: ['nature'], origins: ['germanic'], syllables: 2, hardness: 'soft' },

  // ── SPACE / ASTRONOMY ─────────────────────────────────────────────────
  { text: 'astro', meaning: 'star', positions: ['prefix'], fields: ['space', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'nova', meaning: 'new', positions: ['root', 'suffix'], fields: ['space', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'stell', meaning: 'star', positions: ['prefix', 'root'], fields: ['space'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'orbit', meaning: 'circle, path', positions: ['root'], fields: ['space', 'technology'], origins: ['classical'], syllables: 2, hardness: 'hard' },
  { text: 'cosmo', meaning: 'order, universe', positions: ['prefix', 'root'], fields: ['space', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'nebula', meaning: 'cloud', positions: ['root'], fields: ['space'], origins: ['classical'], syllables: 3, hardness: 'soft' },
  { text: 'void', meaning: 'empty space', positions: ['root'], fields: ['space', 'gaming'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'pulsar', meaning: 'pulsating star', positions: ['root'], fields: ['space', 'technology'], origins: ['coined'], syllables: 2, hardness: 'hard' },

  // ── FINANCE ───────────────────────────────────────────────────────────
  { text: 'fin', meaning: 'end, boundary', positions: ['prefix', 'root'], fields: ['finance'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'cap', meaning: 'head, chief', positions: ['prefix', 'root'], fields: ['finance', 'law'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'valor', meaning: 'worth, value', positions: ['root'], fields: ['finance', 'virtue'], origins: ['classical', 'romance'], syllables: 2, hardness: 'soft' },
  { text: 'merit', meaning: 'deserved reward', positions: ['root'], fields: ['finance', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'ledger', meaning: 'book of records', positions: ['root'], fields: ['finance', 'technology'], origins: ['germanic'], syllables: 2, hardness: 'soft' },
  { text: 'vault', meaning: 'arched store', positions: ['root'], fields: ['finance', 'technology'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'prime', meaning: 'first', positions: ['prefix', 'root'], fields: ['finance', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'equity', meaning: 'fairness, stake', positions: ['root'], fields: ['finance', 'law', 'virtue'], origins: ['classical'], syllables: 3, hardness: 'soft' },

  // ── MYTHOLOGY ─────────────────────────────────────────────────────────
  { text: 'thor', meaning: 'thunder', positions: ['root', 'prefix'], fields: ['mythology', 'gaming'], origins: ['nordic'], syllables: 1, hardness: 'hard' },
  { text: 'odin', meaning: 'frenzy, inspiration', positions: ['root', 'prefix'], fields: ['mythology', 'gaming'], origins: ['nordic'], syllables: 2, hardness: 'soft' },
  { text: 'freya', meaning: 'lady', positions: ['root'], fields: ['mythology', 'virtue'], origins: ['nordic'], syllables: 2, hardness: 'soft' },
  { text: 'atlas', meaning: 'enduring', positions: ['root'], fields: ['mythology', 'travel'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'hera', meaning: 'protectress', positions: ['root'], fields: ['mythology'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'zen', meaning: 'meditation', positions: ['prefix', 'root'], fields: ['mythology', 'virtue'], origins: ['japanese'], syllables: 1, hardness: 'soft' },
  { text: 'ra', meaning: 'sun god', positions: ['prefix', 'root'], fields: ['mythology', 'space'], origins: ['african'], syllables: 1, hardness: 'soft' },
  { text: 'kali', meaning: 'the black one', positions: ['root'], fields: ['mythology'], origins: ['sanskrit'], syllables: 2, hardness: 'soft' },
  { text: 'indra', meaning: 'possessing drops', positions: ['root'], fields: ['mythology'], origins: ['sanskrit'], syllables: 2, hardness: 'soft' },
  { text: 'loki', meaning: 'trickster', positions: ['root'], fields: ['mythology', 'gaming'], origins: ['nordic'], syllables: 2, hardness: 'soft' },

  // ── FOOD / BEVERAGE ───────────────────────────────────────────────────
  { text: 'sage', meaning: 'wise, herb', positions: ['root', 'suffix'], fields: ['food', 'virtue', 'nature'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'grain', meaning: 'seed, cereal', positions: ['root'], fields: ['food', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'miel', meaning: 'honey', positions: ['root'], fields: ['food'], origins: ['romance'], syllables: 1, hardness: 'soft' },
  { text: 'brew', meaning: 'to brew', positions: ['root'], fields: ['food'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'crust', meaning: 'hard outer layer', positions: ['root'], fields: ['food'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'olive', meaning: 'olive tree', positions: ['root'], fields: ['food', 'nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'spice', meaning: 'aromatic seed', positions: ['root'], fields: ['food'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'harvest', meaning: 'autumn crop', positions: ['root'], fields: ['food', 'nature'], origins: ['germanic'], syllables: 2, hardness: 'hard' },

  // ── FASHION / DESIGN ──────────────────────────────────────────────────
  { text: 'luxe', meaning: 'abundance, luxury', positions: ['root', 'suffix'], fields: ['fashion', 'finance'], origins: ['classical', 'romance'], syllables: 1, hardness: 'soft' },
  { text: 'velvet', meaning: 'velvet fabric', positions: ['root'], fields: ['fashion'], origins: ['romance'], syllables: 2, hardness: 'soft' },
  { text: 'aura', meaning: 'breeze, glow', positions: ['root'], fields: ['fashion', 'virtue', 'nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'noir', meaning: 'black', positions: ['root', 'suffix'], fields: ['fashion', 'arts'], origins: ['romance'], syllables: 1, hardness: 'soft' },
  { text: 'prism', meaning: 'that which saws light', positions: ['root'], fields: ['fashion', 'science', 'arts'], origins: ['classical'], syllables: 2, hardness: 'hard' },
  { text: 'silk', meaning: 'silk fabric', positions: ['root'], fields: ['fashion'], origins: ['germanic'], syllables: 1, hardness: 'soft' },
  { text: 'loom', meaning: 'weaving frame', positions: ['root'], fields: ['fashion'], origins: ['germanic'], syllables: 1, hardness: 'soft' },

  // ── GAMING ────────────────────────────────────────────────────────────
  { text: 'arc', meaning: 'bow, curve', positions: ['prefix', 'root'], fields: ['gaming', 'arts', 'technology'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'pixel', meaning: 'picture element', positions: ['root'], fields: ['gaming', 'technology'], origins: ['coined'], syllables: 2, hardness: 'hard' },
  { text: 'rune', meaning: 'secret, whisper', positions: ['root', 'suffix'], fields: ['gaming', 'mythology'], origins: ['nordic', 'germanic'], syllables: 1, hardness: 'soft' },
  { text: 'shadow', meaning: 'shade', positions: ['prefix', 'root'], fields: ['gaming', 'mythology'], origins: ['germanic'], syllables: 2, hardness: 'soft' },
  { text: 'storm', meaning: 'tempest', positions: ['root'], fields: ['gaming', 'nature', 'mythology'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'fang', meaning: 'tooth, capture', positions: ['root', 'suffix'], fields: ['gaming', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'vortex', meaning: 'whirlpool', positions: ['root'], fields: ['gaming', 'science'], origins: ['classical'], syllables: 2, hardness: 'hard' },

  // ── LAW / GOVERNMENT / EDUCATION ──────────────────────────────────────
  { text: 'jur', meaning: 'law, right', positions: ['prefix', 'root'], fields: ['law'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'civ', meaning: 'citizen', positions: ['prefix', 'root'], fields: ['law', 'education'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'scholar', meaning: 'learner', positions: ['root'], fields: ['education'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'mentor', meaning: 'advisor', positions: ['root'], fields: ['education', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'cog', meaning: 'to learn, know', positions: ['prefix', 'root'], fields: ['education', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'lex', meaning: 'law', positions: ['root'], fields: ['law'], origins: ['classical'], syllables: 1, hardness: 'soft' },

  // ── ARTS ──────────────────────────────────────────────────────────────
  { text: 'muse', meaning: 'to think, inspire', positions: ['root', 'suffix'], fields: ['arts', 'education'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'lyra', meaning: 'lyre, constellation', positions: ['root'], fields: ['arts', 'space', 'mythology'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'chroma', meaning: 'color', positions: ['root'], fields: ['arts', 'fashion'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'echo', meaning: 'reflected sound', positions: ['root'], fields: ['arts', 'nature'], origins: ['classical'], syllables: 2, hardness: 'soft' },
  { text: 'verse', meaning: 'line, turn', positions: ['root', 'suffix'], fields: ['arts', 'education'], origins: ['classical'], syllables: 1, hardness: 'soft' },

  // ── TRAVEL / PLACE ────────────────────────────────────────────────────
  { text: 'port', meaning: 'harbor, carry', positions: ['root', 'suffix'], fields: ['travel', 'finance'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'vista', meaning: 'view', positions: ['root'], fields: ['travel', 'arts', 'nature'], origins: ['classical', 'romance'], syllables: 2, hardness: 'soft' },
  { text: 'peak', meaning: 'pointed top', positions: ['root'], fields: ['travel', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'ridge', meaning: 'long crest', positions: ['root'], fields: ['travel', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'soft' },
  { text: 'haven', meaning: 'safe place', positions: ['root', 'suffix'], fields: ['travel', 'virtue'], origins: ['germanic'], syllables: 2, hardness: 'soft' },
  { text: 'way', meaning: 'path', positions: ['suffix', 'root'], fields: ['travel'], origins: ['germanic'], syllables: 1, hardness: 'soft' },

  // ── VIRTUE / ABSTRACT ─────────────────────────────────────────────────
  { text: 'vera', meaning: 'true', positions: ['prefix', 'root'], fields: ['virtue'], origins: ['classical', 'slavic'], syllables: 2, hardness: 'soft' },
  { text: 'clar', meaning: 'clear', positions: ['prefix', 'root'], fields: ['virtue', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'alt', meaning: 'high, deep', positions: ['prefix', 'root'], fields: ['virtue', 'science', 'arts'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'pax', meaning: 'peace', positions: ['root'], fields: ['virtue'], origins: ['classical'], syllables: 1, hardness: 'hard' },
  { text: 'verge', meaning: 'edge, incline', positions: ['root', 'suffix'], fields: ['virtue', 'technology'], origins: ['classical'], syllables: 1, hardness: 'soft' },
  { text: 'bright', meaning: 'radiant', positions: ['root', 'suffix'], fields: ['virtue', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'hard' },
  { text: 'noble', meaning: 'well-known, aristocratic', positions: ['root'], fields: ['virtue', 'fashion'], origins: ['classical', 'romance'], syllables: 2, hardness: 'soft' },
  { text: 'kind', meaning: 'nature, sort', positions: ['root'], fields: ['virtue'], origins: ['germanic'], syllables: 1, hardness: 'hard' },

  // ── EVOCATIVE SUFFIXES / COINING PARTS ────────────────────────────────
  { text: 'ly', meaning: 'like, of the kind', positions: ['suffix'], fields: ['virtue', 'arts'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['coined', 'evocative'] },
  { text: 'io', meaning: 'relating to', positions: ['suffix'], fields: ['technology', 'science'], origins: ['classical', 'coined'], syllables: 2, hardness: 'soft', styles: ['coined'] },
  { text: 'on', meaning: 'being, thing', positions: ['suffix'], fields: ['technology', 'science'], origins: ['classical', 'coined'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'us', meaning: 'masculine/agent form', positions: ['suffix'], fields: ['virtue'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical'] },
  { text: 'ia', meaning: 'feminine/abstract form', positions: ['suffix'], fields: ['nature', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical'] },
  { text: 'um', meaning: 'neutral form', positions: ['suffix'], fields: ['science'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical'] },
  { text: 'ix', meaning: 'agent/feminine', positions: ['suffix'], fields: ['technology', 'science'], origins: ['classical', 'coined'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'ora', meaning: 'hour, prayer', positions: ['suffix'], fields: ['virtue'], origins: ['classical', 'romance'], syllables: 2, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'ara', meaning: 'altar, star', positions: ['suffix'], fields: ['space', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'ster', meaning: 'agent, one who', positions: ['suffix'], fields: ['technology', 'gaming'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['coined', 'compound'] },
  { text: 'wise', meaning: 'manner, way', positions: ['suffix'], fields: ['technology', 'education'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['compound', 'coined'] },
  { text: 'lab', meaning: 'work', positions: ['suffix'], fields: ['science', 'technology'], origins: ['classical'], syllables: 1, hardness: 'hard', styles: ['compound', 'coined'] },
  { text: 'works', meaning: 'deeds, factory', positions: ['suffix'], fields: ['technology'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['compound'] },
  { text: 'hub', meaning: 'central point', positions: ['suffix'], fields: ['technology', 'travel'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['compound'] },
  { text: 'lyt', meaning: 'loosening, dissolving', positions: ['suffix'], fields: ['technology', 'science', 'biology'], origins: ['classical', 'coined'], syllables: 1, hardness: 'hard', styles: ['coined'] },
  { text: 'fi', meaning: 'becoming, making', positions: ['suffix'], fields: ['technology', 'science'], origins: ['classical', 'coined'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'scope', meaning: 'watching', positions: ['suffix'], fields: ['science', 'technology', 'space'], origins: ['classical'], syllables: 1, hardness: 'hard', styles: ['classical', 'compound'] },
  { text: 'form', meaning: 'shape', positions: ['suffix'], fields: ['technology', 'science', 'fashion'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical', 'compound'] },
  { text: 'morph', meaning: 'shape, form', positions: ['suffix', 'root'], fields: ['biology', 'technology'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'pod', meaning: 'foot', positions: ['suffix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard', styles: ['coined', 'compound'] },
  { text: 'ware', meaning: 'goods, software', positions: ['suffix'], fields: ['technology'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['compound'] },
  { text: 'lyne', meaning: 'line (softened)', positions: ['suffix', 'root'], fields: ['technology', 'science'], origins: ['classical', 'coined'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'que', meaning: 'that which', positions: ['suffix'], fields: ['technology', 'fashion'], origins: ['romance', 'coined'], syllables: 1, hardness: 'hard', styles: ['coined', 'classical'] },
  { text: 'elle', meaning: 'small, diminutive', positions: ['suffix'], fields: ['fashion', 'virtue'], origins: ['romance'], syllables: 1, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'ock', meaning: 'diminutive', positions: ['suffix'], fields: ['nature', 'gaming'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['coined'] },
  { text: 'wyn', meaning: 'friend, joy', positions: ['suffix', 'root'], fields: ['mythology', 'virtue'], origins: ['celtic', 'germanic'], syllables: 1, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'mere', meaning: 'lake, famous', positions: ['suffix'], fields: ['nature', 'virtue'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'den', meaning: 'valley, lair', positions: ['suffix'], fields: ['nature', 'travel'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['compound', 'evocative'] },

  // ── PREFIXES ──────────────────────────────────────────────────────────
  { text: 'a', meaning: 'without, not', positions: ['prefix'], fields: ['science', 'virtue'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical'] },
  { text: 'hyper', meaning: 'over, beyond', positions: ['prefix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 2, hardness: 'hard', styles: ['classical', 'coined'] },
  { text: 'meta', meaning: 'beyond, after', positions: ['prefix'], fields: ['technology', 'science'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'neo', meaning: 'new', positions: ['prefix'], fields: ['technology', 'space', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'omni', meaning: 'all', positions: ['prefix'], fields: ['technology', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical'] },
  { text: 'poly', meaning: 'many', positions: ['prefix'], fields: ['science', 'technology'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical'] },
  { text: 'trans', meaning: 'across', positions: ['prefix'], fields: ['technology', 'travel', 'science'], origins: ['classical'], syllables: 1, hardness: 'hard', styles: ['classical'] },
  { text: 'inter', meaning: 'between', positions: ['prefix'], fields: ['technology', 'travel'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['classical'] },
  { text: 'ex', meaning: 'out of', positions: ['prefix'], fields: ['finance', 'travel'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical'] },
  { text: 'veri', meaning: 'true', positions: ['prefix'], fields: ['finance', 'technology', 'virtue'], origins: ['classical'], syllables: 2, hardness: 'soft', styles: ['coined', 'classical'] },
  { text: 'well', meaning: 'good, spring', positions: ['prefix'], fields: ['virtue', 'nature'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['compound'] },
  { text: 'fair', meaning: 'beautiful, just', positions: ['prefix'], fields: ['virtue', 'fashion'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['compound'] },

  // ── CELTIC / SLAVIC / AFRICAN / JAPANESE flavor roots ─────────────────
  { text: 'kel', meaning: 'slender, bright', positions: ['prefix', 'root'], fields: ['mythology', 'nature'], origins: ['celtic'], syllables: 1, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'bran', meaning: 'raven', positions: ['root'], fields: ['mythology', 'nature'], origins: ['celtic'], syllables: 1, hardness: 'hard', styles: ['evocative'] },
  { text: 'mir', meaning: 'peace, world', positions: ['root', 'suffix'], fields: ['virtue', 'space'], origins: ['slavic'], syllables: 1, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'slav', meaning: 'glory', positions: ['root', 'prefix'], fields: ['virtue', 'mythology'], origins: ['slavic'], syllables: 1, hardness: 'soft', styles: ['classical'] },
  { text: 'zuri', meaning: 'beautiful', positions: ['root', 'prefix'], fields: ['fashion', 'virtue'], origins: ['african'], syllables: 2, hardness: 'soft', styles: ['evocative', 'coined'] },
  { text: 'amari', meaning: 'strength', positions: ['root'], fields: ['virtue', 'biology'], origins: ['african'], syllables: 3, hardness: 'soft', styles: ['evocative'] },
  { text: 'kaze', meaning: 'wind', positions: ['root'], fields: ['nature'], origins: ['japanese'], syllables: 2, hardness: 'soft', styles: ['evocative'] },
  { text: 'hana', meaning: 'flower, blossom', positions: ['root'], fields: ['nature', 'fashion'], origins: ['japanese'], syllables: 2, hardness: 'soft', styles: ['evocative'] },
  { text: 'yuki', meaning: 'snow, happiness', positions: ['root'], fields: ['nature', 'virtue'], origins: ['japanese'], syllables: 2, hardness: 'soft', styles: ['evocative'] },
  { text: 'aka', meaning: 'red', positions: ['prefix', 'root'], fields: ['fashion', 'arts'], origins: ['japanese'], syllables: 2, hardness: 'soft', styles: ['evocative'] },
  { text: 'arya', meaning: 'noble', positions: ['root', 'prefix'], fields: ['mythology', 'virtue'], origins: ['sanskrit'], syllables: 2, hardness: 'soft', styles: ['classical', 'evocative'] },
  { text: 'maya', meaning: 'illusion, magic', positions: ['root'], fields: ['mythology', 'arts'], origins: ['sanskrit'], syllables: 2, hardness: 'soft', styles: ['evocative'] },
  { text: 'soma', meaning: 'moon, nectar', positions: ['root'], fields: ['mythology', 'biology', 'space'], origins: ['sanskrit'], syllables: 2, hardness: 'soft', styles: ['classical', 'evocative'] },

  // ── ADDITIONAL COINING FRAGMENTS (vowel/consonant bridges) ────────────
  { text: 'ar', meaning: 'of, relating to', positions: ['root'], fields: ['virtue'], origins: ['coined', 'classical'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'el', meaning: 'god, bright one', positions: ['root'], fields: ['mythology', 'virtue'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'is', meaning: 'to be', positions: ['root'], fields: ['virtue'], origins: ['coined', 'germanic'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'or', meaning: 'one who', positions: ['root'], fields: ['technology'], origins: ['classical'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'an', meaning: 'one belonging to', positions: ['root'], fields: ['virtue'], origins: ['classical', 'coined'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'yn', meaning: 'diminutive', positions: ['root'], fields: ['fashion', 'nature'], origins: ['coined', 'celtic'], syllables: 1, hardness: 'soft', styles: ['coined'] },
  { text: 'eth', meaning: 'people, realm', positions: ['suffix'], fields: ['mythology', 'virtue'], origins: ['germanic'], syllables: 1, hardness: 'soft', styles: ['classical', 'coined'] },
  { text: 'ton', meaning: 'town, enclosure', positions: ['suffix'], fields: ['technology', 'travel'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['compound'] },
  { text: 'ville', meaning: 'town', positions: ['suffix'], fields: ['travel', 'food'], origins: ['romance'], syllables: 1, hardness: 'soft', styles: ['compound'] },
  { text: 'ster', meaning: 'one who does', positions: ['suffix'], fields: ['technology', 'gaming'], origins: ['germanic'], syllables: 1, hardness: 'hard', styles: ['compound'] },
];

/** De-duplicate by text+position while preserving first gloss. */
export function uniqueMorphemes(): readonly Morpheme[] {
  const seen = new Set<string>();
  const out: Morpheme[] = [];
  for (const m of LEXICON) {
    const key = m.text + '|' + m.positions.join(',');
    if (!seen.has(key)) {
      seen.add(key);
      out.push(m);
    }
  }
  return out;
}

export const MORPHEMES = uniqueMorphemes();
