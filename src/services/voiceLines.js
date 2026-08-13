/**
 * Voice-over line banks — Gen Z style, kocak, sopan.
 * Each condition has 15-30 variants to avoid monotony.
 * Sorted by condition: normal, streak, comeback, bigLead, closeFight, taunt, deuce.
 */

// ── NORMAL POINT (team just scored, no special condition) ──
export const normalPoint = {
  id: [
    (s, o) => `Poin untuk ${s}! Mantap jiwa!`,
    (s, o) => `${s} dapat poin! Oke gas terus!`,
    (s, o) => `Masuk! Poin buat ${s}! Sip lah!`,
    (s, o) => `Nice one ${s}! Lanjutkan!`,
    (s, o) => `${s} nambah poin! Keep going!`,
    (s, o) => `Yess ${s}! Masuk tuh!`,
    (s, o) => `Poin ${s}! Enak banget mainnya!`,
    (s, o) => `Oke ${s} berhasil nambah poin!`,
    (s, o) => `${s} gak mau kalah nih! Masuk lagi!`,
    (s, o) => `Satu poin buat ${s}! Semangat!`,
    (s, o) => `Poin! ${s} makin pede nih!`,
    (s, o) => `${s} cuan satu poin! Gaskeun!`,
    (s, o) => `Wih ${s} masuk! Keren!`,
    (s, o) => `${s} nambah koleksi poin! Ayo!`,
    (s, o) => `Poin buat ${s}! ${o} harus hati hati nih!`,
    (s, o) => `${s} eksekusi dengan sempurna! Masuk!`,
    (s, o) => `${s} oke punya! Satu poin lagi!`,
    (s, o) => `Masuk bro! ${s} tambahin skornya!`,
    (s, o) => `Kena! Poin ${s}! ${o} sabar ya!`,
    (s, o) => `${s} gak main main nih! Poin masuk!`,
  ],
  en: [
    (s, o) => `Point for ${s}! Nice one!`,
    (s, o) => `${s} scores! Let's go!`,
    (s, o) => `Great shot by ${s}! Point!`,
    (s, o) => `${s} adds another one! Keep it up!`,
    (s, o) => `That's a point for ${s}! Well played!`,
    (s, o) => `${s} with a clean point! Amazing!`,
    (s, o) => `Point ${s}! Looking strong!`,
    (s, o) => `Yes! ${s} takes the point!`,
    (s, o) => `Beautiful play by ${s}! One more point!`,
    (s, o) => `${s} is looking sharp! Point!`,
    (s, o) => `Another point for ${s}! ${o} needs to respond!`,
    (s, o) => `${s} with a solid execution! Point!`,
    (s, o) => `That's how it's done! Point for ${s}!`,
    (s, o) => `Boom! ${s} gets the point!`,
    (s, o) => `${s} is heating up! Point scored!`,
  ],
};

// ── STREAK WHILE LEADING (3+ consecutive, scorer IS winning) ──
export const streakLeading = {
  id: [
    (s, o) => `${s} mendominasi! Masuk terus dan skornya makin jauh!`,
    (s, o) => `${s} lagi mode beast! ${o} ketar ketir!`,
    (s, o) => `Gilaa ${s} gak mau berhenti! Berturut turut dan makin unggul!`,
    (s, o) => `${s} ngegas terus! ${o} udah gak bisa ngapa ngapain!`,
    (s, o) => `Suporter ${s} sorakin dong! Tim kalian mendominasi!`,
    (s, o) => `${s} cruise control! Masuk mulu dan skornya jauh!`,
    (s, o) => `Brutal! ${s} berturut turut dan makin tak terkejar!`,
    (s, o) => `${o} harus timeout nih! ${s} gak ada obat, skor makin jauh!`,
    (s, o) => `Main apa sih ${s}? Dominan banget! ${o} butuh keajaiban!`,
    (s, o) => `${s} bikin ${o} pusing! Masuk mulu dan unggul jauh!`,
    (s, o) => `Sumpah ${s} ngeri mainnya! Skor makin gak terkejar!`,
    (s, o) => `${s} lagi di zona! ${o} cuma bisa nonton!`,
    (s, o) => `Rally ${s}! Skor makin lebar, ${o} harus kerja keras nih!`,
    (s, o) => `${s} kayak lagi cheat! Masuk mulu dan unggulnya banyak!`,
    (s, o) => `Hatrick poin! ${s} memimpin dengan dominan!`,
  ],
  en: [
    (s, o) => `${s} is dominating! Scoring streak and pulling away!`,
    (s, o) => `Unstoppable! ${s} keeps widening the gap!`,
    (s, o) => `${s} is in beast mode! ${o} can't stop the bleeding!`,
    (s, o) => `Three in a row! ${s} extends the lead! ${o} in trouble!`,
    (s, o) => `${s} won't stop scoring! The lead is massive now!`,
    (s, o) => `${o} better call a timeout! ${s} is running away with this!`,
    (s, o) => `${s} is in total control! What a dominant streak!`,
    (s, o) => `Incredible! ${s} keeps piling on! ${o} has no answer!`,
    (s, o) => `${s} is playing out of their mind! Huge lead now!`,
    (s, o) => `${s} fans, make noise! Your team is absolutely crushing it!`,
  ],
};

// ── STREAK WHILE TRAILING (3+ consecutive, scorer is STILL behind) ──
export const streakTrailing = {
  id: [
    (s, o) => `${s} mulai bangkit! Berturut turut tapi masih harus ngejar nih!`,
    (s, o) => `${s} gak mau nyerah! Tiga berturut turut, tapi skornya masih kurang!`,
    (s, o) => `Semangat ${s}! Masuk terus tapi jangan senang dulu, masih tertinggal!`,
    (s, o) => `${s} mulai panas! Tapi ${o} masih unggul, harus ngejar lagi!`,
    (s, o) => `Rally ${s}! Bagus sih berturut turut tapi gap nya masih ada!`,
    (s, o) => `${s} lagi ngegas! Tapi tenang ${o} masih di depan!`,
    (s, o) => `Ayo ${s} terus ngejar! Berturut turut tapi masih kurang nih!`,
    (s, o) => `${s} pantang menyerah! Streak tiga tapi masih harus kerja keras!`,
    (s, o) => `Suporter ${s} semangatin terus! Timnya lagi ngejar ketertinggalan!`,
    (s, o) => `Lumayan ${s} berturut turut! Tapi ${o} masih santai di depan!`,
    (s, o) => `${s} lagi momentum! Tapi jangan lupa masih tertinggal ya!`,
    (s, o) => `Oke ${s} mulai jalan! Tapi ${o} masih unggul, jangan lengah!`,
    (s, o) => `${s} ngegas tapi masih kurang! Ayo terus sampe nyusul!`,
    (s, o) => `${o} jangan santai! ${s} lagi berturut turut ngejar skor!`,
    (s, o) => `Pelan pelan ${s}! Berturut turut, gap nya mulai mengecil!`,
  ],
  en: [
    (s, o) => `${s} is fighting back! Three in a row, but still trailing!`,
    (s, o) => `${s} won't give up! Streak but still behind!`,
    (s, o) => `Great effort by ${s}! But ${o} still has the lead!`,
    (s, o) => `${s} is gaining momentum! But there's still work to do!`,
    (s, o) => `${s} closing the gap! But ${o} is still in front!`,
    (s, o) => `Don't celebrate yet ${o}! ${s} is on a run!`,
    (s, o) => `${s} is not done! Three straight but still needs more!`,
    (s, o) => `Keep pushing ${s}! The gap is shrinking!`,
    (s, o) => `${o} stay focused! ${s} is making a run at you!`,
    (s, o) => `${s} fans, keep cheering! Your team is fighting back!`,
  ],
};

// ── TRAILING (scored a point but still far behind 4+) ──
export const trailingPoint = {
  id: [
    (s, o) => `Lumayan ${s} nambah satu! Tapi masih jauh ketinggalannya bro!`,
    (s, o) => `${s} dapat poin! Tapi ${o} masih unggul jauh, harus ngejar banyak!`,
    (s, o) => `Oke ${s} masuk satu! Tapi jalan masih panjang, ${o} masih jauh di depan!`,
    (s, o) => `Poin ${s}! Semangat ya walaupun masih ketinggalan banyak!`,
    (s, o) => `${s} jangan nyerah! Masuk satu tapi butuh lebih banyak lagi!`,
    (s, o) => `Satu poin ${s}! Pelan pelan mengejar, tapi ${o} masih santai di atas!`,
    (s, o) => `${s} nambah! Tapi ${o} kayaknya gak khawatir, masih jauh unggulnya!`,
    (s, o) => `Setidaknya ${s} dapat poin! Tapi gap nya masih gede banget!`,
    (s, o) => `${s} masih berjuang! Satu poin tapi butuh keajaiban buat nyusul!`,
    (s, o) => `Nah gitu dong ${s}! Tapi masih jauh ya, ayo semangat!`,
    (s, o) => `Suporter ${s} tetap semangat ya! Timnya masih berjuang walau tertinggal!`,
    (s, o) => `${s} gak mau menyerah! Poin masuk walau masih jauh di belakang!`,
    (s, o) => `Ayo ${s} jangan putus asa! Masih ada kesempatan walau tipis!`,
    (s, o) => `Poin ${s}! Sedikit sedikit lama lama jadi bukit, ayo ngejar!`,
    (s, o) => `${s} curi satu poin! Tapi ${o} masih dominant, skornya jauh!`,
  ],
  en: [
    (s, o) => `${s} gets one! But ${o} still has a big lead!`,
    (s, o) => `Point for ${s}! Long way to go though, ${o} is way ahead!`,
    (s, o) => `${s} won't give up! But the deficit is still huge!`,
    (s, o) => `One for ${s}! But ${o} is probably not worried!`,
    (s, o) => `${s} chipping away! But there's a mountain to climb!`,
    (s, o) => `Keep fighting ${s}! Every point counts but ${o} leads big!`,
    (s, o) => `${s} gets on the board! But ${o} is cruising ahead!`,
    (s, o) => `Nice point ${s}! But the gap is still massive!`,
    (s, o) => `${s} fans, stay positive! Your team is still fighting!`,
    (s, o) => `${s} scores but ${o} isn't sweating! Still way ahead!`,
  ],
};

// ── CLOSING IN (trailing 1-3 points, gap shrinking) ──
export const closingInPoint = {
  id: [
    (s, o) => `${s} makin deket! Gap nya tinggal sedikit lagi!`,
    (s, o) => `Uh oh ${o}! ${s} udah di belakang, tinggal selangkah!`,
    (s, o) => `${s} ngejar terus! Selisihnya makin tipis! ${o} awas ya!`,
    (s, o) => `${o} jangan lengah! ${s} udah deket banget!`,
    (s, o) => `${s} mulai nempel! ${o} harus jaga keunggulan!`,
    (s, o) => `Panas nih! ${s} tinggal beberapa poin lagi nyusul ${o}!`,
    (s, o) => `${s} gak mau ditinggal! Gap nya makin kecil!`,
    (s, o) => `Seru! ${s} mendekat! ${o} harus waspada nih!`,
    (s, o) => `${o} mulai grogi kayaknya! ${s} udah hampir nyampe!`,
    (s, o) => `${s} terus mengejar! Selisih makin tipis, deg degan!`,
  ],
  en: [
    (s, o) => `${s} is closing in! Just a few points behind now!`,
    (s, o) => `Watch out ${o}! ${s} is right behind you!`,
    (s, o) => `${s} keeps pushing! The gap is razor thin now!`,
    (s, o) => `${o} looking nervous! ${s} is catching up fast!`,
    (s, o) => `${s} won't back down! Almost level now!`,
    (s, o) => `The gap is shrinking! ${s} is making it interesting!`,
    (s, o) => `${s} is breathing down ${o}'s neck! So close!`,
    (s, o) => `${o} needs to respond! ${s} is right there!`,
    (s, o) => `This is getting tense! ${s} is nearly level!`,
    (s, o) => `${s} clawing back! Just a whisker behind now!`,
  ],
};

// ── COMEBACK (was behind 3+, NOW tied or took the lead) ──
export const comebackPoint = {
  id: [
    (s, o) => `Wah ${s} bangkit! Jangan ditinggal tidur ${o}!`,
    (s, o) => `Cie ${s} mulai nyusul nih! ${o} awas ya!`,
    (s, o) => `${s} gak mau kalah! Mulai ngejar nih!`,
    (s, o) => `Comeback is real! ${s} mulai bangkit!`,
    (s, o) => `${o} jangan senang dulu! ${s} udah mulai panas!`,
    (s, o) => `${s} bilang belum selesai! Masih panjang pertandingannya!`,
    (s, o) => `Jangan remehkan ${s}! Mereka bangkit sekarang!`,
    (s, o) => `${s} mulai nunjukin taringnya! ${o} harus waspada!`,
    (s, o) => `Plot twist nih! ${s} ngejar ${o}!`,
    (s, o) => `${s} gak terima tertinggal! Ayo kejar!`,
    (s, o) => `Ini dia comeback yang ditunggu tunggu! ${s} mulai gaspol!`,
    (s, o) => `${s} kayak anime! Kalah dulu baru menang! Ayo!`,
    (s, o) => `${o} keunggulannya mulai menipis! ${s} ngejar nih!`,
    (s, o) => `Never give up! ${s} buktiin mereka bisa bangkit!`,
    (s, o) => `Aduh ${o} kok kasih ${s} comeback! Awas lo!`,
    (s, o) => `Wih ${s} main character moment nih!`,
    (s, o) => `${s} mode comeback activated! Gak bisa diremehkan!`,
    (s, o) => `${o} mulai grogi nih kayaknya! ${s} ngejar!`,
    (s, o) => `Sabar ${o}! ${s} lagi dalam mode pantang menyerah!`,
    (s, o) => `${s} buktiin mental juara! Bangkit dari ketinggalan!`,
  ],
  en: [
    (s, o) => `What a comeback by ${s}! ${o}, watch out!`,
    (s, o) => `${s} is fighting back! This is getting exciting!`,
    (s, o) => `Don't count ${s} out! They're coming back!`,
    (s, o) => `${o} better stay focused! ${s} is catching up!`,
    (s, o) => `The comeback is real! ${s} is closing the gap!`,
    (s, o) => `${s} says not so fast! Still in this game!`,
    (s, o) => `Plot twist! ${s} is making a run for it!`,
    (s, o) => `${o}'s lead is shrinking! ${s} is on the move!`,
    (s, o) => `Never underestimate ${s}! They're back in it!`,
    (s, o) => `This is the comeback everyone was waiting for!`,
    (s, o) => `${s} with a main character moment! Fighting back!`,
    (s, o) => `Hold on tight! ${s} is closing in on ${o}!`,
    (s, o) => `${s} refuses to give up! What a spirit!`,
    (s, o) => `${o} getting nervous! ${s} is right behind them!`,
    (s, o) => `${s} proving their champion mentality! What a comeback!`,
  ],
};

// ── BIG LEAD (5+ point advantage) ──
export const bigLeadPoint = {
  id: [
    (s, o) => `${s} makin jauh aja! ${o} harus kerja keras nih!`,
    (s, o) => `Jauh banget ${s} unggulnya! ${o} ayo dong!`,
    (s, o) => `${s} udah santai nih kayaknya! Jauh banget!`,
    (s, o) => `Aduh ${o} tertinggal jauh! ${s} mendominasi!`,
    (s, o) => `Gap nya makin lebar! ${s} lagi dominant mode!`,
    (s, o) => `${s} cruise control! ${o} butuh keajaiban nih!`,
    (s, o) => `Waduh ${o} jauh banget ketinggalannya! Ayo bangkit!`,
    (s, o) => `${s} gak kasih celah! Dominan banget!`,
    (s, o) => `${o} butuh comeback gede nih! ${s} udah jauh!`,
    (s, o) => `Suporter ${o} tetap semangat ya! Masih ada peluang!`,
    (s, o) => `${s} main kayak lagi latihan! Mulus banget!`,
    (s, o) => `Oke ini ${s} bener bener nge bossin ${o}!`,
    (s, o) => `${o} harus punya strategi baru nih, udah jauh!`,
    (s, o) => `${s} udah kayak main sama bot! Gampang banget!`,
    (s, o) => `Skornya makin jauh! ${s} mendominasi pertandingan!`,
  ],
  en: [
    (s, o) => `${s} is pulling away! ${o} needs a miracle!`,
    (s, o) => `Huge lead for ${s}! ${o} has to step up now!`,
    (s, o) => `${s} is dominating this game! What a performance!`,
    (s, o) => `The gap keeps growing! ${s} is in total control!`,
    (s, o) => `${o} needs a big comeback! ${s} is way ahead!`,
    (s, o) => `${s} is making this look easy! Dominant display!`,
    (s, o) => `${o} fans, keep cheering! Your team needs you now!`,
    (s, o) => `${s} is cruising! What a commanding lead!`,
    (s, o) => `This is a masterclass by ${s}! ${o} can't keep up!`,
    (s, o) => `${s} is in a league of their own right now!`,
  ],
};

// ── CLOSE FIGHT (score within 2 points, both above 10) ──
export const closeFightPoint = {
  id: [
    (s, o) => `Ketat banget! ${s} unggul tipis!`,
    (s, o) => `Seru nih pertandingannya! ${s} masih unggul!`,
    (s, o) => `Gak ada yang mau ngalah! ${s} nambah satu!`,
    (s, o) => `Deg degan! ${s} selangkah di depan!`,
    (s, o) => `Pertandingan super ketat! Poin buat ${s}!`,
    (s, o) => `Siapa yang bakal menang? ${s} sementara unggul!`,
    (s, o) => `Penontonnya pada tegang nih! ${s} masih leading!`,
    (s, o) => `${s} nambah tapi ${o} pasti gak mau kalah!`,
    (s, o) => `Wuih intense banget! ${s} masih di atas!`,
    (s, o) => `Pertarungan seru! ${s} belum mau lepas keunggulan!`,
    (s, o) => `Tipis banget! ${s} harus jaga fokus!`,
    (s, o) => `Nail biter! ${s} sementara memimpin! Seru!`,
    (s, o) => `Gak bisa kedip! ${s} nambah poin lagi!`,
    (s, o) => `Match of the day nih! ${s} masih unggul tipis!`,
    (s, o) => `${o} jangan sampai lengah! ${s} terus ngejar!`,
  ],
  en: [
    (s, o) => `So close! ${s} takes a slim lead!`,
    (s, o) => `What a match! ${s} edges ahead!`,
    (s, o) => `Neither team is giving up! Point for ${s}!`,
    (s, o) => `This is intense! ${s} stays in front!`,
    (s, o) => `Edge of your seat stuff! ${s} with the point!`,
    (s, o) => `Nail biter! ${s} holds the advantage!`,
    (s, o) => `Can't look away! ${s} adds to the lead!`,
    (s, o) => `${o} won't back down but ${s} keeps pushing!`,
    (s, o) => `What a battle! ${s} still in front!`,
    (s, o) => `The tension is real! Point for ${s}!`,
  ],
};

// ── TAUNT (directed at team that just got scored on) ──
export const tauntLines = {
  id: [
    (o) => `Ayo mana ${o} suaranya, semangatin timnya dong!`,
    (o) => `${o} kok diem aja sih, ayo semangat dong!`,
    (o) => `Mana nih suporter ${o}? Jangan mau kalah dong!`,
    (o) => `Ayo ${o} bangkit! Masa gitu doang!`,
    (o) => `${o} jangan nyerah! Masih bisa kok!`,
    (o) => `Suporter ${o} mana suaranya? Ayo semangatin!`,
    (o) => `${o} kayaknya butuh dukungan nih! Ayo teriak!`,
    (o) => `Gak apa apa ${o}, santai masih bisa ngejar!`,
    (o) => `${o} jangan down! Ini baru pemanasan!`,
    (o) => `Ayo dong ${o} jangan gitu! Masih ada peluang!`,
    (o) => `${o} lagi kurang hoki nih! Ayo semangat!`,
    (o) => `${o} harus lebih fokus nih! Jangan panik!`,
    (o) => `Tenang ${o}! Ini baru babak awal!`,
    (o) => `${o} perlu minum dulu kayaknya! Ayo fokus!`,
    (o) => `Suporter ${o} lebih keras dong! Tim kalian butuh semangat!`,
  ],
  en: [
    (o) => `Come on ${o} fans, where's the noise?`,
    (o) => `${o}, time to wake up! Let's go!`,
    (o) => `${o} supporters, your team needs you right now!`,
    (o) => `Don't be quiet ${o}! Cheer them on!`,
    (o) => `${o}, shake it off! You can do this!`,
    (o) => `${o} fans, make some noise! Rally your team!`,
    (o) => `${o} needs some energy from the crowd!`,
    (o) => `It's not over ${o}! Keep fighting!`,
    (o) => `${o}, don't give up! Still plenty of game left!`,
    (o) => `${o} looking for answers! Fans, support them!`,
  ],
};

// ── TIED GAME lines ──
export const tiedLines = {
  id: [
    (s) => `Imbang lagi! Seru banget pertandingan ini!`,
    (s) => `Balik lagi ke posisi sama! Siapa yang mau unggul?`,
    (s) => `Kejar kejaran! Skornya sama rata!`,
    (s) => `Gak ada yang mau ngalah! Imbang!`,
    (s) => `Wah seri lagi! Deg degan banget!`,
    (s) => `Poin ${s}! Sekarang imbang! Siapa yang mau duluan?`,
    (s) => `Gak bisa ditebak nih! Skor imbang lagi!`,
    (s) => `Reset! Kedua tim sekarang seimbang!`,
    (s) => `${s} menyamakan kedudukan! Panas nih!`,
    (s) => `Imbang bro! Ini pertandingan beneran seru!`,
  ],
  en: [
    (s) => `All tied up! What a match!`,
    (s) => `Back to level! Who wants it more?`,
    (s) => `${s} levels the score! This is exciting!`,
    (s) => `Neither team is backing down! Tied again!`,
    (s) => `Even steven! This game is on fire!`,
    (s) => `Reset! Both teams are level now!`,
    (s) => `${s} pulls it back to even! Intense!`,
    (s) => `Can't separate them! Score is level!`,
    (s) => `What a battle! Scores are tied!`,
    (s) => `Nobody is giving an inch! All square!`,
  ],
};

// ── BREAK / SET INTERVAL (looping voice-over during break) ──
export const breakLines = {
  id: [
    (tA, tB) => `Pertandingan yang luar biasa! Mari kita break sejenak, istirahat dulu ya!`,
    (tA, tB) => `Kita jeda istirahat sebentar ya! Silakan tarik nafas dulu!`,
    (tA, tB) => `Mari kita break sejenak! Pemain silakan istirahat, penonton santai dulu!`,
    (tA, tB) => `Waktu istirahat telah tiba! Mari kita break sejenak ya!`,
  ],
  en: [
    (tA, tB) => `What a match so far! Let's take a short break to rest!`,
    (tA, tB) => `Time for a quick break! Catch your breath!`,
    (tA, tB) => `Let's take a short break! Players, please rest up!`,
    (tA, tB) => `Break time! We will be right back after this short break!`,
  ],
};

// ── PANTUN KOCAK (during break) ──
export const breakPantun = {
  id: [
    "Ke pasar beli ketupat, pulangnya beli es dawet. Ayo penonton bersorak, biar pemain makin semangat!",
    "Burung kutilang hinggap di dahan, terbang ke barat kembali ke timur. Dukung tim jagoan, biar menangnya gak cuma di mimpi semata!",
    "Jalan jalan ke kota Sragen, pulangnya beli tape ketan. Ayo dong jangan cuma diem, teriak yang kenceng biar pemain senang!",
    "Beli rambutan di pinggir jalan, dapat bonus satu ikat. Main badminton emang keren, apalagi kalo penontonnya hebat!",
    "Naik motor pakai helm merah, jangan lupa bawa SIM. Ayo teriak sekeras kerasnya, biar lawan pada takut dan grogi!",
    "Pergi ke sawah cari belut, pulangnya mampir beli sate. Penonton semangat itu bagus, biar pemainnya mainnya lebih greget!",
    "Buah mangga jatuh ke got, anjing lewat kena getah. Ayo dong penonton yang di pojokan, jangan cuma nonton aja ikut teriak dong!",
    "Ke pasar beli tempe mendoan, enak dimakan sambil ngopi. Yang dukung ${tA} ayo teriak, yang dukung ${tB} jangan mau kalahhh!",
    "Terbang tinggi burung elang, hinggap di pohon jambu. Yuk kita semangatin bareng bareng, biar pertandingannya makin seru!",
    "Makan bakso pinggir jalan, kuahnya pedes bikin nagih. Pertandingannya juga seru, bikin penonton gak mau pulang!",
  ],
  en: [
    "Roses are red, violets are blue, cheer for your team, they need support from you!",
    "The crowd is alive, the energy is right, let's make this break, an unforgettable night!",
    "Clap your hands and stamp your feet, this badminton match just can't be beat!",
    "Left side loud, right side louder, let's see who's the prouder supporter!",
    "Take a breath and grab a drink, the next set is closer than you think!",
  ],
};

// ── PRESS PLAY WARNING ──
export const pressPlayLines = {
  id: [
    "Kak, tombol playnya pencet dulu dong kalo mau mulai! Kan saya gak tau, hehe.",
    "Eh sabar kak, pencet play dulu baru bisa main! Gak bisa langsung gitu dong!",
    "Belum dipencet play nya kak! Saya juga butuh persiapan dulu dong!",
    "Woi pencet play dulu dong! Masa langsung main aja, gak sopan banget!",
    "Halo kak, play dulu ya baru bisa nambah skor! Sabar sedikit!",
  ],
  en: [
    "Hey, press the play button first before adding points! I need to get ready!",
    "Hold on! Press play to start the set first!",
    "Can't add points yet! Hit that play button to begin!",
    "Easy there! Press play first, then we can score!",
    "The set hasn't started yet! Press play to continue!",
  ],
};

// ── LONG DEUCE TIED (Deuce 21-21, 22-22, etc) ──
export const longDeuceTied = {
  id: [
    (s, o) => `Ya ampun balik deuce lagi! ${s} nahan imbang nih, ${o} geregetan pasti pengen buru-buru kelar!`,
    (s, o) => `Capek banget lihatnya! ${s} maksa deuce lagi! Kalian berdua mau nginep di lapangan apa gimana?`,
    (s, o) => `Asli gue ngantuk nungguinnya! Skor sama kuat lagi, ${s} nahan laju ${o}! Ayo salah satu ngalah napa!`,
    (s, o) => `Kalian berdua gak capek apa? Deuce mulu daritadi! Suporternya udah pada laper tuh nungguin!`,
    (s, o) => `Astaga deuce terus! Poin krusial diamankan ${s}! ${o} mulai emosi nih kayaknya!`,
  ],
  en: [
    (s, o) => `Oh my goodness, deuce again! ${s} levels it up! ${o} must be frustrated!`,
    (s, o) => `I'm exhausted just watching! ${s} forces another deuce! Are you guys planning to sleep here?`,
    (s, o) => `This is turning into a marathon! Tied again thanks to ${s}! Someone please win!`,
    (s, o) => `Are you guys not tired? Deuce after deuce! The crowd is getting hungry!`,
    (s, o) => `Deuce again?! ${s} refuses to lose! ${o} needs to wrap this up!`,
  ],
};

// ── LONG DEUCE ADVANTAGE (Set point / Match point beyond 20) ──
export const longDeuceAdvantage = {
  id: [
    (s, o) => `Akhirnya ${s} unggul lagi! Ayo dong ${o} masa nyerah gitu aja, kejar lagi biar tambah lama!`,
    (s, o) => `Ini main badminton apa tarik tambang sih! Tarik ulur terus! ${s} di atas angin, ${o} deg-degan parah!`,
    (s, o) => `Sumpah seru banget tapi kelamaan! ${s} ambil poin! ${o} nafasnya udah ngos-ngosan belum tuh?`,
    (s, o) => `Keringat dingin ngelihatnya! ${s} unggul! ${o} ayo tahan dong masa dibiarin lepas!`,
    (s, o) => `Mending pingsan aja deh gue! Poin buat ${s}! ${o} butuh mukjizat nih biar bisa balik deuce!`,
  ],
  en: [
    (s, o) => `Finally ${s} takes the lead! Come on ${o}, don't give up now, let's make it even longer!`,
    (s, o) => `Is this a tug of war? ${s} has the advantage! ${o} must be sweating bullets!`,
    (s, o) => `Incredible drama but so long! ${s} takes the point! Is ${o} out of breath yet?`,
    (s, o) => `My nerves are shot! ${s} gets ahead! ${o} has to defend with their life!`,
    (s, o) => `I can't take much more of this! Advantage ${s}! ${o} needs a miracle right now!`,
  ],
};

// ── RUBBER SET COMPLAINTS (Set 3 starts) ──
export const rubberSetLines = {
  id: [
    "Ya ampun sampai rubber set! Perasaan kok sampai set 3 terus, saya capek ngomong tolong jangan lama-lama mainnya ya saya mau bobok cantik ini!",
    "Haduh set ketiga lagi! Plis deh jangan lama-lama mainnya, udah ngantuk berat nih pengen rebahan!",
    "Lanjut set ketiga nih! Tolong dipercepat ya mainnya, suporter udah pada laper dan saya pengen cepet pulang!",
    "Astaga rubber set! Kalian berdua tenaganya gak habis-habis ya? Ya udah deh, set penentuan nih, let's go!",
    "Oke set penentuan! Janji ya jangan sampai deuce panjang lagi? Capek woy!",
  ],
  en: [
    "Oh my goodness, a rubber set! Why does it always go to three sets? Please finish it quick, I need my beauty sleep!",
    "Here we go again, set three! Please don't make this a marathon, I'm already exhausted from talking!",
    "Third set it is! Let's wrap this up quickly, the crowd wants to go home and so do I!",
    "A rubber set! Do you guys have infinite stamina? Alright, final set, let's get it over with!",
    "Okay, deciding set! Promise me we won't have another long deuce? I'm tired!",
  ],
};
