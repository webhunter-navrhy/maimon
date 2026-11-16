# Koncept MAIMON – agentura práce pro firmy (16. 11. 2026)

## Tři koncepty
1. **Rozpis směn** – web jako tabule směn, kterou firma potřebuje zaplnit: Po–Ne × ranní/odpolední/noční. Limetka = zvýrazňovač na rozpisu i reflexní vesta. Poptávka se „zapisuje do rozpisu“.
2. **Vstupka na halu** – každý oddíl jako visačka / návštěvnická karta na šňůrce, nástup = „odcvaknutí“ karty.
3. **Mapa dojezdu** – Liberec uprostřed, kruhy dojezdu k závodům v kraji.

## Výběr: 1 – Rozpis směn
- Firma nepřichází pro „HR služby“, ale s děrou v rozpisu: chybí 6 lidí na odpolední od pondělí. Web mluví přesně touhle řečí.
- Konkurence (Manpower modrá, Adecco červená, Grafton, Jobleader) jsou korporátní portály s nabídkami práce; tenhle je jen pro firmy, světlý, plakátový, s jednou signální barvou.
- Unese ilustrační fotky (lidi při práci), protože nosná je typografie a rozpis, ne fotka „našeho týmu“.
- 2 je moc hravé pro B2B, 3 nemáme data (kam jezdí).

## Skladba úvodu
1. Hero: fotka haly přes celou šířku, obří „Lidi na směnu.“ + konkrétní nabídka a 2 tlačítka; pod tím už začátek rozpisu.
2. **Signature: rozpis směn** – firma klikne obor, počet lidí, směny, dny a nástup; tabule 7×3 se zaplní limetkou, vznikne věta poptávky → přenese se do formuláře.
3. Formy spolupráce (3 různé způsoby, řešené jako velké řádky s fotkou, ne karty): dočasné přidělení, nábor do kmene, pokrytí špičky.
4. Obory: velké fotky s obřími slovy (výroba, sklad, potraviny, kovo, VZV).
5. Kdo co řeší: dvousloupcové „Vy / My“ (jasné rozdělení odpovědnosti u agenturního zaměstnávání).
6. Jak spolupráce probíhá: 4 kroky od poptávky po první směnu (pořadí je skutečné → číslování smí).
7. Povolení a firma (placeholder čísla povolení), malý pruh „Hledáte práci?“.
8. Kontakt / formulář.

Podstránky: Pro firmy, Obory, Spolupráce, O nás, Kontakt, **Značka** (3 návrhy loga + aplikace: vizitka, visačka, vesta, auto, avatar).

## Písma
- Display **Bricolage Grotesque** (wdth 75–80, opsz 96, wght ~520) – plakátové úzké, test háčků OK (render 16. 11.). Jiný než Host Grotesk (safeocean-2) i Archivo (Rox).
- Text **Geist** 400/500.

## Paleta
papír #F1EFE8 · inkoust #15171A · signální limetka #D2F53C (jediný akcent, vždy s inkoustem) · kámen #D9D5CA · šedá textu #55585E.

## Fotky
Ilustrační Unsplash (zdroje v foto/zdroje.txt), vybrané bez cizojazyčných nápisů, jednotně lehce teplý grade; v patičce „Fotografie jsou ilustrační“.

## Zakázané vzory
- Žádný marquee, countery, tmavá+žlutá šablona s helmou, 4 sloupce ikon.
- Číslování jen u kroků spolupráce (skutečné pořadí) – odůvodněno.
- Pohyb: IntersectionObserver reveal, CSS scroll-driven zvětšení fotky v hero, bez GSAP/Lenis.

## Porovnání
- Rox (stejný klient): výkres, žlutá, Archivo → tady rozpis, limetka, Bricolage. Sourozenec povahou (technická přesnost), ne vzhledem.
- safeocean-2/3: akvária, Host Grotesk, jiná skladba.
