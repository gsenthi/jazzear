import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// FREQUENCIES
// ─────────────────────────────────────────────────────────────────────────────
const FREQ = {
  "C2":65.41,"D2":73.42,"Eb2":77.78,"F2":87.31,"F#2":92.50,
  "G2":98.00,"Ab2":103.83,"A2":110.00,"Bb2":116.54,"B2":123.47,
  "C3":130.81,"Db3":138.59,"D3":146.83,"Eb3":155.56,"E3":164.81,
  "F3":174.61,"F#3":185.00,"G3":196.00,"Ab3":207.65,"A3":220.00,
  "Bb3":233.08,"B3":246.94,
  "C4":261.63,"Cb4":246.94,"Db4":277.18,"D4":293.66,"Eb4":311.13,"E4":329.63,
  "F4":349.23,"F#4":369.99,"Gb4":369.99,"G4":392.00,"Ab4":415.30,"A4":440.00,
  "Bb4":466.16,"B4":493.88,
  "C5":523.25,"D5":587.33,"Eb5":622.25,"F5":698.46,"G5":783.99,
};

// ─────────────────────────────────────────────────────────────────────────────
// CHORD QUALITY OPTIONS
// ─────────────────────────────────────────────────────────────────────────────
const QUALITY_OPTIONS = [
  { val:"major7",    mood:"Bright, open"        },
  { val:"minor7",    mood:"Dark, settled"       },
  { val:"dominant7", mood:"Tense, pulling"      },
  { val:"halfdim",   mood:"Ambiguous, unstable" },
];

// ─────────────────────────────────────────────────────────────────────────────
// SONG LIBRARY
// ─────────────────────────────────────────────────────────────────────────────
const SONGS = [
  {
    title:"Autumn Leaves", composer:"Joseph Kosma",
    key:"G minor", difficulty:"Beginner",
    rootName:"G", rootNote:"G2",
    listenTo:"Chet Baker · Bill Evans · Cannonball Adderley",
    cadence:[
      { notes:["A2","C3","Eb3","G3"], dur:1.5, label:"Am7♭5" },
      { notes:["D2","F#3","A3","C4"], dur:1.5, label:"D7"    },
      { notes:["G2","Bb2","D3","F3"], dur:3.0, label:"Gm7"   },
    ],
    phrases:[
      {
        id:1, barLabel:"Bars 1–2",
        melody:[
          {note:"G3", dur:0.5, name:"G",  degree:"5th" },
          {note:"Bb3",dur:0.5, name:"B♭", degree:"♭7th"},
          {note:"C4", dur:0.5, name:"C",  degree:"root"},
          {note:"D4", dur:0.8, name:"D",  degree:"9th" },
          {note:"C4", dur:0.5, name:"C",  degree:"root"},
          {note:"Bb3",dur:0.5, name:"B♭", degree:"♭7th"},
          {note:"A3", dur:1.0, name:"A",  degree:"6th" },
        ],
        chord:{rootNote:"C3",rootName:"C",voicing:["C3","Eb3","G3","Bb3"],answer:"minor7",label:"Cm7",roman:"iv",mood:"Dark, settled"},
        clues:{
          intervallic:"The phrase climbs up three steps then turns back down — an ascending arc from 5th to 9th, then descent.",
          solfege:"In G minor: 5 → ♭7 → 1 → 2 → 1 → ♭7 → 6. Rises through Cm7 chord tones then steps back down.",
        },
        theory:`The melody opens by climbing — G up to Bb up to C up to D — then turns and descends back down.

This ascending then descending arc is the signature gesture of Autumn Leaves. Every note belongs to Cm7 (the iv chord in G minor). The D at the top is the 9th — a colour tone that gives the peak an open, unresolved quality.

The phrase sits over Cm7 moving to F7. You're also in the relative major territory — this is the ii chord in B♭ major. That duality is what gives Autumn Leaves its bittersweet quality from the very first bar.`,
      },
      {
        id:2, barLabel:"Bars 3–4",
        melody:[
          {note:"Bb3",dur:1.2, name:"B♭",degree:"root"},
          {note:"A3", dur:0.5, name:"A", degree:"maj7"},
          {note:"G3", dur:0.5, name:"G", degree:"6th" },
          {note:"F3", dur:0.5, name:"F", degree:"5th" },
          {note:"G3", dur:1.0, name:"G", degree:"6th" },
        ],
        chord:{rootNote:"Bb2",rootName:"Bb",voicing:["Bb2","D3","F3","A3"],answer:"major7",label:"B♭maj7",roman:"♭III maj7",mood:"Bright, open, arrived"},
        clues:{
          intervallic:"Long held note then stepwise descent then a step back up. A settling gesture after phrase 1.",
          solfege:"Over B♭maj7: root → maj7 → 6 → 5 → 6. Landing on the root — arrived at the relative major.",
        },
        theory:`The long Bb at the start is the arrival — the melody lands on the root of B♭maj7, the relative major. After the movement of phrase 1, this feels like a moment of rest.

The stepwise descent A → G → F then back up to G is a classic melodic resolution gesture. The phrase settles.

Notice how much calmer this feels than phrase 1. The harmonic tension has resolved. But home (G minor) is still ahead.`,
      },
      {
        id:3, barLabel:"Bars 5–6",
        melody:[
          {note:"Eb4",dur:0.5, name:"E♭",degree:"5th" },
          {note:"D4", dur:0.5, name:"D", degree:"4th" },
          {note:"C4", dur:0.5, name:"C", degree:"3rd" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"root"},
          {note:"C4", dur:0.5, name:"C", degree:"3rd" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"root"},
          {note:"A3", dur:1.0, name:"A", degree:"maj7"},
        ],
        chord:{rootNote:"Eb3",rootName:"Eb",voicing:["Eb3","G3","Bb3","D4"],answer:"major7",label:"E♭maj7",roman:"♭VI maj7",mood:"Warm, lush, slightly exotic"},
        clues:{
          intervallic:"Descends stepwise from the 5th then oscillates — down, up, down. Same shape as phrase 2 but starting higher.",
          solfege:"Over E♭maj7: 5 → 4 → 3 → root → 3 → root → maj7. The A at the end is the warm major 7th.",
        },
        theory:`E♭maj7 is the ♭VI chord — one of the most characteristic sounds in minor key harmony.

The melody mirrors phrase 2 in shape — descending from the 5th — but starting a 4th higher. Same shape, different pitch level. A key compositional technique in Autumn Leaves.

The A natural at the end is the major 7th of E♭maj7 — warm and resolved. After this, the harmony turns darker: Am7♭5 and D7 are coming, pulling back toward G minor.`,
      },
      {
        id:4, barLabel:"Bars 6–8",
        melody:[
          {note:"G3", dur:1.5, name:"G", degree:"♭7th"},
          {note:"A3", dur:0.5, name:"A", degree:"root"},
          {note:"B3", dur:0.5, name:"B", degree:"9th" },
          {note:"C4", dur:0.5, name:"C", degree:"♭3rd"},
          {note:"D4", dur:1.5, name:"D", degree:"4th" },
        ],
        chord:{rootNote:"A2",rootName:"A",voicing:["A2","Eb3","G3","C4"],answer:"halfdim",label:"Am7♭5",roman:"ii°7",mood:"Dark, unstable, searching"},
        clues:{
          intervallic:"Long held note then stepwise ascent. The phrase climbs — opposite direction from phrase 2. Something is changing.",
          solfege:"Over Am7♭5: ♭7 held · then root → 9 → ♭3 → 4. The B natural is the bright 9th. Tension building toward D7.",
        },
        theory:`This phrase opens with a long held G — the ♭7th of Am7♭5 — then climbs: A B C D.

Am7♭5 is the ii°7 chord of G minor. The B natural in the melody is particularly striking — it's the 9th, slightly brighter and more tense than the Bb you've heard throughout.

The ascending line A → B → C → D builds momentum into the D7 that follows. The whole phrase gathers tension — you're being pulled strongly toward home.`,
      },
      {
        id:5, barLabel:"Bars 8–10",
        melody:[
          {note:"D4", dur:0.5, name:"D", degree:"root"},
          {note:"C4", dur:0.5, name:"C", degree:"♭7th"},
          {note:"B3", dur:0.5, name:"B", degree:"6th" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭6th"},
          {note:"A3", dur:0.5, name:"A", degree:"5th" },
          {note:"G3", dur:1.5, name:"G", degree:"4th" },
        ],
        chord:{rootNote:"D3",rootName:"D",voicing:["D3","F#3","A3","C4"],answer:"dominant7",label:"D7",roman:"V7",mood:"Tense, pulling strongly home"},
        clues:{
          intervallic:"Stepwise descent with a chromatic passing note. Listen for the note that doesn't quite belong to the scale.",
          solfege:"Over D7: root → ♭7 → 6 → ♭6 → 5 → 4. The Bb is a chromatic passing note between B natural and A — a bebop inflection.",
        },
        theory:`This phrase descends over D7 — the dominant of G minor — with a crucial chromatic detail: B natural dropping to Bb dropping to A.

That B → Bb → A movement is a bebop chromatic enclosure. The Bb doesn't belong to D7 — it's a passing note borrowed from G minor, creating harmonic colour before landing on A.

The phrase ends on G — the tonic — held over D7. This suspension creates maximum tension before resolving to Gm7.`,
      },
      {
        id:6, barLabel:"Bridge — Bars 17–19",
        melody:[
          {note:"G3", dur:0.5, name:"G", degree:"♭7th"},
          {note:"A3", dur:0.5, name:"A", degree:"root"},
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭2nd"},
          {note:"C4", dur:0.5, name:"C", degree:"♭3rd"},
          {note:"D4", dur:0.8, name:"D", degree:"4th" },
          {note:"C4", dur:0.5, name:"C", degree:"♭3rd"},
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭2nd"},
          {note:"A3", dur:1.0, name:"A", degree:"root"},
        ],
        chord:{rootNote:"A2",rootName:"A",voicing:["A2","Eb3","G3","C4"],answer:"halfdim",label:"Am7♭5",roman:"ii°7",mood:"Dark, unstable — bridge begins"},
        clues:{
          intervallic:"Same ascending then descending arc as phrase 1 — but over a darker chord. Same shape, completely different feel.",
          solfege:"Over Am7♭5: ♭7 → root → ♭2 → ♭3 → 4 → ♭3 → ♭2 → root. The identical arc as the opening of the tune.",
        },
        theory:`The bridge opens with the same ascending-then-descending arc as phrase 1 — but now over Am7♭5 instead of Cm7.

The same melodic gesture that felt settled and bittersweet in the A section now sounds dark and searching. The shape hasn't changed — the harmony has changed everything about how it feels.

The bridge begins a long cycle of 4ths: Am7♭5 → D7 → Gm7 → C7 → Cm7 → F7 → B♭maj7 → E♭maj7. A long journey home.`,
      },
      {
        id:7, barLabel:"Bridge — Bars 20–22",
        melody:[
          {note:"G3", dur:1.5, name:"G", degree:"root"},
          {note:"A3", dur:0.5, name:"A", degree:"9th" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭3rd"},
          {note:"C4", dur:0.5, name:"C", degree:"4th" },
          {note:"D4", dur:1.0, name:"D", degree:"5th" },
        ],
        chord:{rootNote:"G2",rootName:"G",voicing:["G2","Bb2","D3","F3"],answer:"minor7",label:"Gm7",roman:"i",mood:"Settled, home — but briefly"},
        clues:{
          intervallic:"Long held tonic note then ascending line. Home appears briefly before the cycle continues.",
          solfege:"Over Gm7: root held · then 2 → ♭3 → 4 → 5. You're on home ground — G minor — but the harmony keeps moving through C7.",
        },
        theory:`The melody touches home — G minor — with a long held G. But it doesn't stay.

The ascending G → A → Bb → C → D over Gm7 → C7 is the continuation of the cycle of 4ths. Home appears briefly in the middle of the bridge, then the harmony pushes on.

This fleeting arrival on Gm7 is one of the emotional peaks of the tune. You touch home — and then it moves away again.`,
      },
      {
        id:8, barLabel:"Bridge — Bars 22–25",
        melody:[
          {note:"C4", dur:1.5, name:"C", degree:"root"},
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭7th"},
          {note:"A3", dur:0.5, name:"A", degree:"6th" },
          {note:"G3", dur:0.5, name:"G", degree:"5th" },
          {note:"F3", dur:1.5, name:"F", degree:"4th" },
        ],
        chord:{rootNote:"C3",rootName:"C",voicing:["C3","Eb3","G3","Bb3"],answer:"minor7",label:"Cm7",roman:"iv",mood:"Dark, settled — returning"},
        clues:{
          intervallic:"Long held note then stepwise descent. Same settling gesture as phrase 2. The cycle is completing.",
          solfege:"Over Cm7 → F7: root held · then ♭7 → 6 → 5 → 4. Descending through chord tones. Home is near.",
        },
        theory:`The melody lands on C — the root of Cm7 — and descends: C → Bb → A → G → F.

This is the same descending gesture as phrases 1 and 2, but now at the end of the bridge cycle. The Cm7 here is the iv chord again — the same chord the tune opened on. Your ear recognises it. You're circling back.`,
      },
      {
        id:9, barLabel:"Bridge — Bars 25–26",
        melody:[
          {note:"Eb4",dur:0.5, name:"E♭",degree:"5th" },
          {note:"D4", dur:0.5, name:"D", degree:"4th" },
          {note:"C4", dur:0.5, name:"C", degree:"3rd" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"root"},
          {note:"Ab3",dur:0.5, name:"A♭",degree:"maj7"},
          {note:"G3", dur:1.0, name:"G", degree:"6th" },
        ],
        chord:{rootNote:"Eb3",rootName:"Eb",voicing:["Eb3","G3","Bb3","D4"],answer:"major7",label:"E♭maj7",roman:"♭VI maj7",mood:"Warm, lush — final moment before the last A"},
        clues:{
          intervallic:"Stepwise descent with a chromatic note near the bottom. The Ab adds warmth before G — the pickup into the final A section.",
          solfege:"Over E♭maj7: 5 → 4 → 3 → root → maj7 → 6. The G at the end is the same note the tune opened on.",
        },
        theory:`The bridge ends on E♭maj7 — the same chord that closed the first half of the A section. The cycle is complete.

The G at the end of this phrase is the pickup into the final A section — the same G that opened the whole tune.

After this, the A section repeats exactly. But now your ear has made the complete journey: B♭ major → G minor home → the bridge cycle → back again. The repetition lands with much greater weight. You know where you've been.`,
      },
    ],
  },

  {
    title:"Blue Bossa", composer:"Kenny Dorham",
    key:"C minor", difficulty:"Intermediate",
    rootName:"C", rootNote:"C2",
    listenTo:"Joe Henderson · Kenny Dorham · Bill Evans",
    cadence:[
      { notes:["D3","F3","Ab3","C4"],  dur:1.5, label:"Dm7♭5" },
      { notes:["G2","B3","D4","F4"],   dur:1.5, label:"G7"    },
      { notes:["C3","Eb3","G3","Bb3"], dur:3.0, label:"Cm7"   },
    ],
    phrases:[
      {
        id:1, barLabel:"Bars 1–2",
        melody:[
          {note:"C4", dur:0.5, name:"C", degree:"root"},
          {note:"D4", dur:0.5, name:"D", degree:"9th" },
          {note:"Eb4",dur:0.5, name:"E♭",degree:"♭3rd"},
          {note:"F4", dur:0.8, name:"F", degree:"4th" },
          {note:"F4", dur:1.5, name:"F", degree:"4th" },
        ],
        chord:{rootNote:"C3",rootName:"C",voicing:["C3","Eb3","G3","Bb3"],answer:"minor7",label:"Cm",roman:"i",mood:"Dark, settled — home"},
        clues:{
          intervallic:"Simple ascending line from the root — C D Eb F — then held. A rising line over home.",
          solfege:"In C minor: 1 → 2 → ♭3 → 4 → held. Every note is diatonic. The F at the top is the 4th — gently suspended.",
        },
        theory:`The tune opens simply — C ascending stepwise to F, then held. Root, 9th, minor 3rd, 4th. Every note from C minor.

The 4th (F) held at the top creates gentle suspension over the Cm chord. It's not a chord tone — it wants to resolve down to Eb or up to G. This small tension on the very first phrase sets up the restless, searching quality of the whole tune.

Blue Bossa is a bossa nova — feel the relaxed pulse underneath even in this simple ascending phrase.`,
      },
      {
        id:2, barLabel:"Bars 3–4",
        melody:[
          {note:"F4", dur:0.5, name:"F", degree:"root"},
          {note:"Eb4",dur:0.5, name:"E♭",degree:"♭7th"},
          {note:"D4", dur:0.5, name:"D", degree:"6th" },
          {note:"Eb4",dur:0.5, name:"E♭",degree:"♭7th"},
          {note:"Eb4",dur:1.5, name:"E♭",degree:"♭7th"},
        ],
        chord:{rootNote:"F3",rootName:"F",voicing:["F3","Ab3","C4","Eb4"],answer:"minor7",label:"Fm7",roman:"iv",mood:"Dark, settled — iv chord"},
        clues:{
          intervallic:"Descends from the root then oscillates on the ♭7th. Call and response with phrase 1 — phrase 1 ascended, this descends.",
          solfege:"Over Fm7: root → ♭7 → 6 → ♭7 → held. The Eb is the ♭7th of Fm7 — characteristic of a minor 7th chord.",
        },
        theory:`The melody moves to Fm7 — the iv chord of C minor. Notice the phrase descends where phrase 1 ascended. This call-and-response between ascending and descending phrases is a key structural feature of Blue Bossa.

The Eb held at the end is the ♭7th of Fm7 — the defining note of any minor 7th chord. Holding it lets the chord colour sink in.

Fm7 → Bb7 is a ii-V in Db major. The key change is coming.`,
      },
      {
        id:3, barLabel:"Bars 5–8",
        melody:[
          {note:"Eb4",dur:0.5, name:"E♭",degree:"♭3rd"},
          {note:"D4", dur:0.5, name:"D", degree:"9th" },
          {note:"C4", dur:0.5, name:"C", degree:"root"},
          {note:"Bb3",dur:0.5, name:"B♭",degree:"♭7th"},
          {note:"C4", dur:0.8, name:"C", degree:"root"},
          {note:"C4", dur:1.5, name:"C", degree:"root"},
        ],
        chord:{rootNote:"D3",rootName:"D",voicing:["D3","Ab3","C4","F4"],answer:"halfdim",label:"Dm7♭5",roman:"ii°7",mood:"Dark, unstable — pulling to G7"},
        clues:{
          intervallic:"Descends from the ♭3rd through chord tones then oscillates on the root. The harmony underneath is searching.",
          solfege:"Over Dm7♭5: ♭3 → 9 → root → ♭7 → root → held. The C held over G7 is a suspended 4th — maximum tension before Cm.",
        },
        theory:`The melody descends over Dm7♭5 — the ii°7 chord — then holds on C while G7 arrives underneath.

This is the ii°7-V7-i cadence in C minor. The Dm7♭5 has its characteristic dark, searching quality — the Ab in the chord (the diminished 5th) creates the tension.

The C held over G7 is a suspended 4th — maximum harmonic tension just before the return to Cm. Your ear knows resolution is coming.`,
      },
      {
        id:4, barLabel:"Bars 9–10 — Key change to D♭",
        melody:[
          {note:"Eb4",dur:0.5, name:"E♭",degree:"root"},
          {note:"Db4",dur:0.5, name:"D♭",degree:"♭7th"},
          {note:"Cb4",dur:0.5, name:"C♭",degree:"6th" },
          {note:"Db4",dur:0.5, name:"D♭",degree:"♭7th"},
          {note:"Db4",dur:1.5, name:"D♭",degree:"♭7th"},
        ],
        chord:{rootNote:"Eb3",rootName:"Eb",voicing:["Eb3","Gb3","Bb3","Db4"],answer:"minor7",label:"E♭m7",roman:"ii",mood:"Warm, slightly exotic — new key"},
        clues:{
          intervallic:"Same descending-then-held shape as phrase 2 — but a minor 3rd higher. You're in a completely different key. Notice the new colour.",
          solfege:"Over E♭m7 in D♭ major: root → ♭7 → 6 → ♭7 → held. The Cb (B natural) is the major 6th — characteristic of this chord.",
        },
        theory:`This is the key change — the most distinctive moment in Blue Bossa. You've moved from C minor to D♭ major.

The phrase shape is identical to phrase 2 — descend from the root, hold the ♭7th. But the notes are completely different: Eb Db Cb Db. The Cb (enharmonic B natural) is particularly striking — it's not in C minor at all.

Eb m7 → Ab7 is the ii-V in D♭ major. Same gesture, different key, completely different emotional colour. This is how jazz composers create contrast.`,
      },
      {
        id:5, barLabel:"Bars 11–13 — Return to C minor",
        melody:[
          {note:"D4", dur:0.5, name:"D", degree:"♭3rd"},
          {note:"C4", dur:0.5, name:"C", degree:"9th" },
          {note:"Bb3",dur:0.5, name:"B♭",degree:"root"},
          {note:"Ab3",dur:0.5, name:"A♭",degree:"♭7th"},
          {note:"G3", dur:0.8, name:"G", degree:"5th" },
          {note:"C4", dur:1.5, name:"C", degree:"root"},
        ],
        chord:{rootNote:"D3",rootName:"D",voicing:["D3","Ab3","C4","F4"],answer:"halfdim",label:"Dm7♭5",roman:"ii°7",mood:"Dark, pulling — back to C minor"},
        clues:{
          intervallic:"Descends through chord tones then leaps up to the root. The leap is the return home — C minor is arriving.",
          solfege:"Over Dm7♭5 → G7: ♭3 → 9 → root → ♭7 → 5 → root. The final C is the tonic — home.",
        },
        theory:`The key change resolves back to C minor. The melody descends through Dm7♭5 — D C Bb Ab G — then leaps up to C.

That upward leap to C is the moment of return. After the warmth of D♭ major, landing back on C minor feels like coming home from somewhere beautiful but foreign.

The Ab marks the return to C minor harmonic language — the diminished 5th of Dm7♭5. After this the head repeats. The whole form is only 16 bars, but it contains a complete emotional journey: home → away → home.`,
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// PIANO SYNTHESIS
// ─────────────────────────────────────────────────────────────────────────────
function playNote(ctx, freq, durSec, vol = 0.5) {
  if (!ctx || !freq) return;
  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(vol, now + 0.008);
  master.gain.exponentialRampToValueAtTime(vol * 0.55, now + 0.08);
  master.gain.exponentialRampToValueAtTime(vol * 0.3, now + 0.4);
  master.gain.exponentialRampToValueAtTime(0.0001, now + durSec + 0.9);
  master.connect(ctx.destination);
  [[1,1.0],[2,0.30],[3,0.12],[4,0.05]].forEach(([m,a]) => {
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq * m;
    const g = ctx.createGain(); g.gain.value = a;
    o.connect(g); g.connect(master); o.start(now); o.stop(now + durSec + 1.1);
  });
  const ot = ctx.createOscillator(); ot.type = "triangle"; ot.frequency.value = freq * 2.5;
  const gt = ctx.createGain();
  gt.gain.setValueAtTime(0.2, now); gt.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  ot.connect(gt); gt.connect(master); ot.start(now); ot.stop(now + 0.05);
}

function startDroneOsc(ctx, freq) {
  const master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.8);
  master.connect(ctx.destination);
  const oscs = [1,2].map((mult,i) => {
    const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq * mult;
    const g = ctx.createGain(); g.gain.value = i === 0 ? 1.0 : 0.18;
    o.connect(g); g.connect(master); o.start(); return o;
  });
  return {
    stop: () => {
      const t = ctx.currentTime;
      master.gain.cancelScheduledValues(t);
      master.gain.setValueAtTime(master.gain.value, t);
      master.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
      setTimeout(() => oscs.forEach(o => { try { o.stop(); } catch(e){} }), 1600);
    }
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// STAFF COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const DIATONIC = { C:0, D:1, E:2, F:3, G:4, A:5, B:6 };
function noteToStep(noteStr) {
  const match = noteStr.match(/^([A-G])(b|♭|#|♯)?(\d)$/);
  if (!match) return 0;
  const [, letter,, octStr] = match;
  return DIATONIC[letter] + (parseInt(octStr) - 4) * 7;
}

function Staff({ melody }) {
  const W = 280, lineGap = 11;
  const H = lineGap * 10;
  const stepZeroY = H - lineGap * 1.5;
  const stepToY = (step) => stepZeroY - step * (lineGap / 2);
  const staffSteps = [2,4,6,8,10];
  const noteXs = melody.map((_,i) => 44 + i * ((W - 60) / Math.max(melody.length - 1, 1)));
  const noteR = 5.5;
  return (
    <div style={{ background:"#14213d", border:"1px solid #1e3050", padding:"12px 16px", maxWidth:"320px", width:"100%" }}>
      <div style={{ fontSize:"10px", letterSpacing:"0.2em", color:"#fca311", textTransform:"uppercase", marginBottom:"10px" }}>Visual — Staff</div>
      <svg width={W} height={H} style={{ display:"block", overflow:"visible" }}>
        {staffSteps.map((step,i) => <line key={i} x1={18} y1={stepToY(step)} x2={W-6} y2={stepToY(step)} stroke="#1e3050" strokeWidth={1} />)}
        <text x={2} y={stepToY(4)+6} fontSize={42} fill="#4a6a8a" fontFamily="serif" style={{ userSelect:"none" }}>𝄞</text>
        {melody.map((m,i) => {
          const step = noteToStep(m.note);
          const x = noteXs[i];
          const y = stepToY(step);
          const isLong = m.dur > 0.8;
          const ledgers = [];
          if (step <= 0) for (let s = 0; s >= step; s -= 2) ledgers.push(s);
          if (step >= 12) for (let s = 12; s <= step; s += 2) ledgers.push(s);
          if (step === 0 && !ledgers.includes(0)) ledgers.push(0);
          return (
            <g key={i}>
              {[...new Set(ledgers)].map(s => (
                <line key={s} x1={x-noteR-4} y1={stepToY(s)} x2={x+noteR+4} y2={stepToY(s)} stroke="#4a6a8a" strokeWidth={1.2} />
              ))}
              <ellipse cx={x} cy={y} rx={noteR} ry={noteR*0.72} fill={isLong?"none":"#fca311"} stroke="#fca311" strokeWidth={1.5} transform={`rotate(-12,${x},${y})`} />
              {step < 6
                ? <line x1={x+noteR-1} y1={y} x2={x+noteR-1} y2={y-lineGap*3} stroke="#fca311" strokeWidth={1.5} />
                : <line x1={x-noteR+1} y1={y} x2={x-noteR+1} y2={y+lineGap*3} stroke="#fca311" strokeWidth={1.5} />
              }
              {isLong && <circle cx={x+noteR+4} cy={y-1} r={2} fill="#fca311" />}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// KEYBOARD
// ─────────────────────────────────────────────────────────────────────────────
const WW = 32;
const buildOctave = (oct) => ({
  whites: ["C","D","E","F","G","A","B"].map(n => ({ note:`${n}${oct}`, label:n })),
  blacks: [
    {note:`Db${oct}`,off:WW*1-10},{note:`Eb${oct}`,off:WW*2-10},
    {note:`Gb${oct}`,off:WW*4-10},{note:`Ab${oct}`,off:WW*5-10},
    {note:`Bb${oct}`,off:WW*6-10},
  ],
  num: oct,
});
const OCTAVES = [2,3,4,5].map(buildOctave);
const OCT_WIDTH = WW * 7;

// ─────────────────────────────────────────────────────────────────────────────
// STAGES
// ─────────────────────────────────────────────────────────────────────────────
const S = {
  SELECT:"select", INTRO:"intro", DRONE:"drone", ROOT:"root", CADENCE:"cadence",
  PHRASE:"phrase", REVEAL:"reveal",
  CHORD_ROOT:"chord_root", CHORD_QUALITY:"chord_quality",
  THEORY:"theory", DONE:"done",
};

// ─────────────────────────────────────────────────────────────────────────────
export default function JazzEar() {
  const [stage, setStage]           = useState(S.SELECT);
  const [songIdx, setSongIdx]       = useState(0);
  const [phraseIdx, setPhraseIdx]   = useState(0);
  const [msg, setMsg]               = useState("");
  const [sub, setSub]               = useState("");
  const [pressedKey, setPressedKey] = useState(null);
  const [playing, setPlaying]       = useState(false);
  const [cadLabel, setCadLabel]     = useState(null);
  const [clues, setClues]           = useState({ visual:false, intervallic:false, solfege:false });
  const [rootWrong, setRootWrong]         = useState(false);
  const [chordRootWrong, setChordRootWrong] = useState(false);
  const [chordGuess, setChordGuess]       = useState(null);

  const ctxRef   = useRef(null);
  const droneRef = useRef(null);
  const itvRef   = useRef(null);

  const SONG   = SONGS[songIdx];
  const phrase = SONG.phrases[phraseIdx];

  useEffect(() => () => {
    stopDroneClean();
    if (ctxRef.current) ctxRef.current.close();
  }, []);

  const getCtx = useCallback(async () => {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const stopDroneClean = () => {
    if (itvRef.current)  { clearInterval(itvRef.current); itvRef.current = null; }
    if (droneRef.current){ droneRef.current.stop(); droneRef.current = null; }
  };

  const startDrone = useCallback(async () => {
    const ctx = await getCtx();
    stopDroneClean();
    const rootFreq = FREQ[SONG.rootNote];
    droneRef.current = startDroneOsc(ctx, rootFreq);
    const strike = () => playNote(ctx, rootFreq, 2.5, 0.42);
    strike();
    itvRef.current = setInterval(strike, 2800);
    setPlaying(true);
  }, [getCtx, SONG]);

  const stopDrone = useCallback(() => { stopDroneClean(); setPlaying(false); }, []);

  const begin = async () => {
    await startDrone();
    setStage(S.DRONE);
    setMsg("Listen to the drone.");
    setSub("Let it settle — then find the note on the keyboard.");
    setTimeout(() => {
      setStage(S.ROOT);
      setMsg("Find the root note.");
      setSub("Play it on the keyboard. Trust your ear.");
    }, 3500);
  };

  const pressKey = useCallback(async (noteStr) => {
    const ctx = await getCtx();
    setPressedKey(noteStr);
    setTimeout(() => setPressedKey(null), 320);
    playNote(ctx, FREQ[noteStr], 1.4, 0.52);

    if (stage === S.ROOT) {
      const name = noteStr.replace(/\d/,"");
      if (name === SONG.rootName) {
        stopDrone();
        setStage(S.CADENCE);
        setMsg("✓ Root confirmed");
        setSub("Now listen to the ii–V–I cadence.");
        setTimeout(playCadence, 1000);
      } else {
        setRootWrong(true);
        setMsg("Not quite — keep listening.");
        setSub("Feel for the lowest sustained pitch.");
        setTimeout(() => { setRootWrong(false); setMsg("Find the root note."); setSub("Play it on the keyboard. Trust your ear."); }, 1800);
      }
    }

    if (stage === S.CHORD_ROOT) {
      const name = noteStr.replace(/\d/,"");
      if (name === phrase.chord.rootName || (phrase.chord.rootName === "Bb" && name === "Bb") || (phrase.chord.rootName === "Eb" && name === "Eb") || (phrase.chord.rootName === "Ab" && name === "Ab")) {
        setStage(S.CHORD_QUALITY);
        setMsg("✓ Root found — now hear the full chord.");
        setSub("Listen — then identify what you hear.");
        setTimeout(playChord, 600);
      } else {
        setChordRootWrong(true);
        setMsg("Not quite — try again.");
        setSub("Listen to the pedal note carefully.");
        setTimeout(() => { setChordRootWrong(false); setMsg("Find the root of the chord."); setSub("Play the pedal again if you need to."); }, 1800);
      }
    }
  }, [stage, phrase, SONG, getCtx, stopDrone]);

  const playCadence = useCallback(async () => {
    const ctx = await getCtx();
    setPlaying(true);
    let off = 0;
    for (const c of SONG.cadence) {
      const t = off; const chord = c;
      setTimeout(() => { setCadLabel(chord.label); chord.notes.forEach(n => playNote(ctx, FREQ[n], chord.dur * 0.86, 0.36)); }, t * 1000);
      off += c.dur + 0.15;
    }
    const total = SONG.cadence.reduce((a,c) => a + c.dur + 0.15, 0);
    setTimeout(() => {
      setCadLabel(null); setPlaying(false);
      setStage(S.PHRASE);
      setMsg(`Listen to Phrase ${phrase.id} — ${phrase.barLabel}.`);
      setSub("Figure it out by ear. Request a clue if you need one.");
    }, total * 1000 + 200);
  }, [getCtx, SONG, phrase]);

  const playPhrase = useCallback(async (p) => {
    const ctx = await getCtx();
    const src = p || phrase;
    setPlaying(true);
    let off = 0.05;
    for (const m of src.melody) {
      const t = off; const n = m.note; const d = m.dur;
      setTimeout(() => playNote(ctx, FREQ[n], d * 0.86, 0.56), t * 1000);
      off += m.dur + 0.05;
    }
    const total = src.melody.reduce((a,m) => a + m.dur + 0.05, 0);
    setTimeout(() => setPlaying(false), total * 1000 + 200);
  }, [getCtx, phrase]);

  const playRootPedal = useCallback(async () => {
    const ctx = await getCtx();
    playNote(ctx, FREQ[phrase.chord.rootNote], 2.2, 0.52);
    setTimeout(() => playNote(ctx, FREQ[phrase.chord.rootNote], 2.2, 0.52), 2400);
  }, [getCtx, phrase]);

  const playChord = useCallback(async () => {
    const ctx = await getCtx();
    phrase.chord.voicing.forEach(n => playNote(ctx, FREQ[n], 2.2, 0.38));
  }, [getCtx, phrase]);

  const guessChord = (quality) => {
    setChordGuess(quality);
    if (quality === phrase.chord.answer) {
      setTimeout(() => { setStage(S.THEORY); setMsg(`✓ ${phrase.chord.label} — ${phrase.chord.roman}`); setSub("Theory unlocked."); }, 400);
    } else {
      setMsg("Not quite — trust your ear.");
      setSub("Commit to what you hear before guessing.");
    }
  };

  const nextPhrase = () => {
    const next = phraseIdx + 1;
    if (next >= SONG.phrases.length) { setStage(S.DONE); return; }
    setPhraseIdx(next);
    setChordGuess(null);
    setClues({ visual:false, intervallic:false, solfege:false });
    setChordRootWrong(false);
    const np = SONG.phrases[next];
    setStage(S.PHRASE);
    setMsg(`Listen to Phrase ${np.id} — ${np.barLabel}.`);
    setSub("Figure it out by ear.");
    setTimeout(() => playPhrase(np), 600);
  };

  const selectSong = (i) => {
    stopDroneClean();
    setSongIdx(i);
    setPhraseIdx(0);
    setChordGuess(null);
    setClues({ visual:false, intervallic:false, solfege:false });
    setRootWrong(false);
    setChordRootWrong(false);
    setStage(S.INTRO);
  };

  const stageLabel = {
    [S.DRONE]:         "Step 1 — Establish the Root",
    [S.ROOT]:          "Step 1 — Find the Root",
    [S.CADENCE]:       "Step 2 — Cadence",
    [S.PHRASE]:        `Step 3 — Phrase ${phrase?.id}`,
    [S.REVEAL]:        `Step 3 — Phrase ${phrase?.id} Revealed`,
    [S.CHORD_ROOT]:    "Step 4 — Find the Chord Root",
    [S.CHORD_QUALITY]: "Step 4 — Identify the Chord",
    [S.THEORY]:        "Theory Unlocked",
    [S.DONE]:          "Session Complete",
  }[stage] || "";

  const gold="#fca311", bg="#000000", sf="#14213d", bdr="#1e3050", dim="#4a6a8a", txt="#e5e5e5";

  return (
    <div style={{ minHeight:"100vh", background:bg, color:txt, fontFamily:"Georgia,'Times New Roman',serif", display:"flex", flexDirection:"column", alignItems:"center" }}>
      <style>{`
        @keyframes ring{0%,100%{box-shadow:0 0 0 0 #fca31144;transform:scale(1)}50%{box-shadow:0 0 0 24px #fca31100;transform:scale(1.07)}}
        @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes noteIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:up .4s ease forwards}
        button{font-family:Georgia,'Times New Roman',serif;transition:opacity .15s,transform .1s;cursor:pointer}
        button:hover:not(:disabled){opacity:.76}
        button:active:not(:disabled){transform:scale(.97)}
      `}</style>

      {/* HEADER */}
      <div style={{ width:"100%", borderBottom:`1px solid ${bdr}`, padding:"20px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <span style={{ fontSize:"12px", letterSpacing:"0.28em", textTransform:"uppercase", color:gold }}>Jazz Ear</span>
        <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
          {stage !== S.SELECT && stage !== S.INTRO && (
            <button onClick={() => { stopDroneClean(); setStage(S.SELECT); }}
              style={{ background:"transparent", border:"none", color:dim, fontSize:"11px", letterSpacing:"0.12em", textTransform:"uppercase" }}>
              ← Songs
            </button>
          )}
          {stage !== S.SELECT && (
            <span style={{ fontSize:"11px", letterSpacing:"0.12em", color:dim, textTransform:"uppercase" }}>{SONG.title}</span>
          )}
        </div>
      </div>

      <div style={{ width:"100%", maxWidth:"640px", padding:"48px 20px 80px", display:"flex", flexDirection:"column", alignItems:"center", gap:"36px" }}>

        {/* SONG SELECTION */}
        {stage === S.SELECT && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", width:"100%" }}>
            <div style={{ fontSize:"11px", letterSpacing:"0.3em", color:gold, textTransform:"uppercase" }}>Functional Ear Training</div>
            <div style={{ fontSize:"24px", fontStyle:"italic" }}>Choose a standard</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"12px", width:"100%", maxWidth:"420px" }}>
              {SONGS.map((s,i) => (
                <button key={i} onClick={() => selectSong(i)}
                  style={{ background:sf, border:`1px solid ${bdr}`, color:txt, padding:"16px 20px", textAlign:"left", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:"18px", fontStyle:"italic" }}>{s.title}</div>
                    <div style={{ fontSize:"11px", color:dim, marginTop:"3px" }}>{s.composer} · {s.key}</div>
                  </div>
                  <span style={{ fontSize:"10px", letterSpacing:"0.12em", textTransform:"uppercase", color: s.difficulty === "Beginner" ? "#4ecb71" : s.difficulty === "Intermediate" ? gold : "#da6a6a" }}>
                    {s.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* INTRO */}
        {stage === S.INTRO && (
          <div className="fu" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"16px" }}>
            <div style={{ fontSize:"11px", letterSpacing:"0.3em", color:gold, textTransform:"uppercase" }}>Functional Ear Training</div>
            <div style={{ fontSize:"38px", fontStyle:"italic" }}>{SONG.title}</div>
            <div style={{ fontSize:"12px", color:dim, letterSpacing:"0.12em" }}>{SONG.composer}</div>
            <div style={{ background:"#14213d", border:`1px solid ${gold}33`, borderLeft:`3px solid ${gold}`, padding:"20px 24px", maxWidth:"380px", margin:"8px 0", textAlign:"left" }}>
              <div style={{ fontSize:"10px", letterSpacing:"0.24em", color:gold, textTransform:"uppercase", marginBottom:"12px" }}>Before you begin</div>
              <div style={{ fontSize:"14px", color:"#c8c8c8", lineHeight:1.9 }}>
                Sit back and immerse yourself in a few different recordings first. Notice how different artists phrase the melody, where they breathe, how the harmony feels.
              </div>
              <div style={{ fontSize:"12px", color:dim, marginTop:"14px", lineHeight:1.8 }}>
                Try listening to:<br/>
                <span style={{ color:"#6a8aaa" }}>{SONG.listenTo}</span>
              </div>
              <div style={{ fontSize:"11px", color:"#1e3050", marginTop:"10px", fontStyle:"italic" }}>
                The more the melody lives in your ear before you start, the faster your ear will find it here.
              </div>
            </div>
            <div style={{ fontSize:"14px", color:"#4a6a8a", maxWidth:"360px", lineHeight:1.9, margin:"6px 0 20px" }}>
              Establish the root by ear. Lock in the key with a cadence. Figure out the melody phrase by phrase — theory unlocks as you go.
            </div>
            <button onClick={begin} style={{ background:gold, border:"none", color:bg, padding:"14px 44px", fontSize:"12px", letterSpacing:"0.22em", textTransform:"uppercase", fontWeight:"bold" }}>
              Begin Session
            </button>
          </div>
        )}

        {/* STAGE BADGE + MESSAGE */}
        {stage !== S.SELECT && stage !== S.INTRO && stage !== S.DONE && (
          <div className="fu" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
            <div style={{ fontSize:"10px", letterSpacing:"0.28em", textTransform:"uppercase", color:gold, borderBottom:`1px solid ${gold}44`, paddingBottom:"7px" }}>{stageLabel}</div>
            {(stage === S.DRONE || stage === S.ROOT) && (
              <div style={{ width:"66px", height:"66px", borderRadius:"50%", border:`2px solid ${gold}44`, display:"flex", alignItems:"center", justifyContent:"center", animation:playing?"ring 2.2s ease-in-out infinite":"none" }}>
                <div style={{ width:"40px", height:"40px", borderRadius:"50%", background:`${gold}18`, border:`1px solid ${gold}` }} />
              </div>
            )}
            <div style={{ fontSize:"23px", fontStyle:"italic", color:rootWrong?"#da6a6a":txt, maxWidth:"400px", lineHeight:1.35, transition:"color .3s" }}>{msg}</div>
            <div style={{ fontSize:"13px", color:dim }}>{sub}</div>
            {stage === S.CADENCE && <div style={{ fontSize:"30px", color:gold, fontStyle:"italic", minHeight:"40px" }}>{cadLabel || ""}</div>}
          </div>
        )}

        {/* REPLAY DRONE */}
        {stage === S.ROOT && (
          <button onClick={startDrone} style={{ background:"transparent", border:`1px solid ${bdr}`, color:dim, padding:"9px 24px", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase" }}>
            ↺ Replay Drone
          </button>
        )}

        {/* PHRASE */}
        {stage === S.PHRASE && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"24px", width:"100%" }}>
            <button onClick={() => playPhrase()} disabled={playing}
              style={{ background:gold, border:"none", color:bg, padding:"13px 36px", fontSize:"12px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:"bold", opacity:playing?.5:1 }}>
              {playing ? "Playing…" : "▶ Play Phrase"}
            </button>

            <div style={{ fontSize:"10px", letterSpacing:"0.22em", color:dim, textTransform:"uppercase" }}>Request a clue</div>
            <div style={{ display:"flex", gap:"10px" }}>
              {[["visual","Visual"],["intervallic","Intervallic"],["solfege","Solfège"]].map(([key,label]) => (
                <button key={key} onClick={() => !clues[key] && setClues(p => ({...p,[key]:true}))}
                  style={{ background:clues[key]?sf:"transparent", border:`1px solid ${clues[key]?bdr:gold+"55"}`, color:clues[key]?dim:gold, padding:"9px 18px", fontSize:"11px", letterSpacing:"0.12em", cursor:clues[key]?"default":"pointer" }}>
                  {label}
                </button>
              ))}
            </div>

            {clues.visual && <Staff melody={phrase.melody} />}

            {clues.intervallic && (
              <div className="fu" style={{ background:sf, border:`1px solid ${bdr}`, padding:"18px 22px", width:"100%", maxWidth:"400px" }}>
                <div style={{ fontSize:"10px", letterSpacing:"0.22em", color:gold, textTransform:"uppercase", marginBottom:"9px" }}>Intervallic</div>
                <div style={{ fontSize:"14px", color:"#d0d0d0", lineHeight:1.75, fontStyle:"italic" }}>{phrase.clues.intervallic}</div>
              </div>
            )}

            {clues.solfege && (
              <div className="fu" style={{ background:sf, border:`1px solid ${bdr}`, padding:"18px 22px", width:"100%", maxWidth:"400px" }}>
                <div style={{ fontSize:"10px", letterSpacing:"0.22em", color:gold, textTransform:"uppercase", marginBottom:"9px" }}>Solfège</div>
                <div style={{ fontSize:"14px", color:"#d0d0d0", lineHeight:1.75, fontStyle:"italic" }}>{phrase.clues.solfege}</div>
              </div>
            )}

            <button onClick={() => { setStage(S.REVEAL); setMsg(`Phrase ${phrase.id} — revealed.`); setSub("Hear it again with the notes in view."); playPhrase(); }}
              style={{ background:"transparent", border:`1px solid ${bdr}`, color:dim, padding:"10px 28px", fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase" }}>
              ✓ I've got it — show me
            </button>
          </div>
        )}

        {/* REVEAL */}
        {stage === S.REVEAL && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"22px", width:"100%" }}>
            <button onClick={() => playPhrase()} disabled={playing}
              style={{ background:"transparent", border:`1px solid ${gold}`, color:gold, padding:"11px 30px", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", opacity:playing?.5:1 }}>
              {playing ? "Playing…" : "▶ Play Again"}
            </button>

            <Staff melody={phrase.melody} />

            <div style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap" }}>
              {phrase.melody.map((m,i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"5px", animation:`noteIn .35s ease ${i*0.1}s both` }}>
                  <div style={{ fontSize:"10px", color:dim }}>{m.dur > 0.8 ? "♩♩" : "♩"}</div>
                  <div style={{ background:"#0d1f35", border:`1px solid ${gold}55`, padding:"10px 14px", textAlign:"center", minWidth:"46px" }}>
                    <div style={{ fontSize:"17px", color:gold, fontStyle:"italic" }}>{m.name}</div>
                  </div>
                  <div style={{ fontSize:"9px", color:dim, textAlign:"center" }}>{m.degree}</div>
                </div>
              ))}
            </div>

            <button onClick={() => { setStage(S.CHORD_ROOT); setMsg("Find the root of the chord underneath."); setSub("Listen to the pedal — then find it on the keyboard."); setTimeout(playRootPedal, 600); }}
              style={{ background:gold, border:"none", color:bg, padding:"13px 36px", fontSize:"12px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:"bold" }}>
              Next →
            </button>
          </div>
        )}

        {/* CHORD ROOT */}
        {stage === S.CHORD_ROOT && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", width:"100%" }}>
            <button onClick={playRootPedal}
              style={{ background:"transparent", border:`1px solid ${gold}`, color:gold, padding:"11px 30px", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase" }}>
              ↺ Replay Root Pedal
            </button>
            <div style={{ fontSize:"13px", color:chordRootWrong?"#da6a6a":dim, transition:"color .3s", textAlign:"center" }}>
              {chordRootWrong ? "Not quite — try again." : "Find this note on the keyboard."}
            </div>
          </div>
        )}

        {/* CHORD QUALITY */}
        {stage === S.CHORD_QUALITY && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", width:"100%" }}>
            <button onClick={playChord}
              style={{ background:"transparent", border:`1px solid ${gold}`, color:gold, padding:"11px 30px", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase" }}>
              ↺ Replay Chord
            </button>
            <div style={{ fontSize:"12px", color:dim, textAlign:"center", maxWidth:"320px", lineHeight:1.7 }}>
              What do you hear? Commit to one.
            </div>
            <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", justifyContent:"center" }}>
              {QUALITY_OPTIONS.map(opt => {
                const sel = chordGuess === opt.val;
                const ok  = opt.val === phrase.chord.answer;
                return (
                  <button key={opt.val} onClick={() => guessChord(opt.val)}
                    style={{ background:sel?(ok?"#0a2a1a":"#2a0a0a"):"transparent", border:`1px solid ${sel?(ok?"#2a8a2a":"#6a1a1a"):bdr}`, color:sel?(ok?"#4ecb71":"#e05050"):"#6a8aaa", padding:"12px 18px", minWidth:"120px", display:"flex", flexDirection:"column", alignItems:"center", gap:"4px" }}>
                    {sel && ok && <span style={{ fontSize:"15px", fontStyle:"italic", color:"#4ecb71" }}>{phrase.chord.roman}</span>}
                    <span style={{ fontSize:"11px", letterSpacing:"0.06em", opacity: sel&&ok ? 1 : 0.8 }}>{opt.mood}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* THEORY */}
        {stage === S.THEORY && (
          <div className="fu" style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"20px", width:"100%" }}>
            <button onClick={() => playPhrase()}
              style={{ background:"transparent", border:`1px solid ${bdr}`, color:dim, padding:"10px 28px", fontSize:"11px", letterSpacing:"0.16em", textTransform:"uppercase" }}>
              ▶ Replay with fresh ears
            </button>
            <div style={{ background:"#14213d", border:`1px solid ${gold}33`, borderLeft:`3px solid ${gold}`, padding:"22px 26px", width:"100%", maxWidth:"520px" }}>
              <div style={{ fontSize:"10px", letterSpacing:"0.24em", color:gold, textTransform:"uppercase", marginBottom:"14px" }}>
                Harmonic Analysis — Phrase {phrase.id}
              </div>
              <div style={{ fontSize:"14px", color:"#c8c8c8", lineHeight:1.9, whiteSpace:"pre-line" }}>{phrase.theory}</div>
            </div>
            <button onClick={nextPhrase}
              style={{ background:gold, border:"none", color:bg, padding:"13px 36px", fontSize:"12px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:"bold" }}>
              {phraseIdx < SONG.phrases.length - 1 ? `Phrase ${phraseIdx + 2} →` : "Complete →"}
            </button>
          </div>
        )}

        {/* DONE */}
        {stage === S.DONE && (
          <div className="fu" style={{ textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", gap:"20px" }}>
            <div style={{ fontSize:"11px", letterSpacing:"0.3em", color:gold, textTransform:"uppercase" }}>Session Complete</div>
            <div style={{ fontSize:"28px", fontStyle:"italic" }}>{SONG.title}</div>
            <div style={{ fontSize:"14px", color:"#4a6a8a", maxWidth:"380px", lineHeight:1.9 }}>
              Come back and do it again. Each time your ear gets faster and the melody lives more deeply in you.
            </div>
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap", justifyContent:"center" }}>
              <button onClick={() => { setPhraseIdx(0); setChordGuess(null); setClues({visual:false,intervallic:false,solfege:false}); begin(); }}
                style={{ background:"transparent", border:`1px solid ${gold}`, color:gold, padding:"13px 28px", fontSize:"12px", letterSpacing:"0.18em", textTransform:"uppercase" }}>
                ↺ Play Again
              </button>
              <button onClick={() => { stopDroneClean(); setStage(S.SELECT); }}
                style={{ background:"transparent", border:`1px solid ${bdr}`, color:dim, padding:"13px 28px", fontSize:"12px", letterSpacing:"0.18em", textTransform:"uppercase" }}>
                Other Standards
              </button>
            </div>
          </div>
        )}

        {/* KEYBOARD */}
        {(stage === S.ROOT || stage === S.PHRASE || stage === S.CHORD_ROOT) && (
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"12px" }}>
            <div style={{ fontSize:"10px", letterSpacing:"0.2em", color:"#1e3050", textTransform:"uppercase" }}>
              {stage === S.ROOT ? "Find the root" : stage === S.CHORD_ROOT ? "Find the chord root" : "Play it back"}
            </div>
            <div style={{ overflowX:"auto", overflowY:"hidden", WebkitOverflowScrolling:"touch", touchAction:"pan-x", overscrollBehavior:"contain", maxWidth:"100%", paddingBottom:"6px" }}>
              <div style={{ position:"relative", width:`${OCT_WIDTH*4}px`, height:"110px", userSelect:"none" }}>
                {OCTAVES.map((oct,oi) => (
                  <div key={oct.num}>
                    {oct.whites.map((k,i) => (
                      <div key={k.note} onClick={() => pressKey(k.note)}
                        style={{ position:"absolute", left:`${oi*OCT_WIDTH+i*WW}px`, top:0, width:`${WW-2}px`, height:"110px", background:pressedKey===k.note?gold:"#e5e5e5", border:"1px solid #1e3050", borderRadius:"0 0 4px 4px", display:"flex", alignItems:"flex-end", justifyContent:"center", paddingBottom:"5px", fontSize:"9px", color:pressedKey===k.note?"#000000":"#6a8aaa", transition:"background .08s", zIndex:1, cursor:"pointer" }}>
                        {k.label}
                      </div>
                    ))}
                    {oct.blacks.map(k => (
                      <div key={k.note} onClick={() => pressKey(k.note)}
                        style={{ position:"absolute", left:`${oi*OCT_WIDTH+k.off}px`, top:0, width:"20px", height:"64px", background:pressedKey===k.note?gold:"#14213d", border:"1px solid #000", borderRadius:"0 0 3px 3px", zIndex:2, cursor:"pointer", transition:"background .08s" }} />
                    ))}
                    <div style={{ position:"absolute", left:`${oi*OCT_WIDTH+1}px`, bottom:"-18px", fontSize:"9px", color:"#1e3050" }}>C{oct.num}</div>
                    {oi > 0 && <div style={{ position:"absolute", left:`${oi*OCT_WIDTH}px`, top:0, width:"1px", height:"110px", background:"#1e3050", zIndex:3 }} />}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ fontSize:"9px", color:"#1e3050", letterSpacing:"0.15em", marginTop:"10px" }}>scroll · C2 to B5</div>
          </div>
        )}

      </div>
    </div>
  );
}