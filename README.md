# Entur Case oppgave for NLT
Dette er en applikasjon for å finne stoppesteder og se avgangstider ved hjelp av Entur's Geocoder og Journey Planner API-er. Prosjektet er bygget med Yarn, Next.js og Tailwind CSS.

## Installasjon
Klon prosjektet fra GitHub: `git clone https://github.com/din-repo-url`

Gå inn i prosjektmappen: cd `entur-case`

Installer avhengigheter med Yarn: `yarn install`

Start utviklingsserveren: `yarn dev`

Applikasjonen vil kjøre på http://localhost:3000.

## Beskrivelse
Denne applikasjonen lar deg søke etter stoppesteder og se avgangstider for offentlig transport. Du kan søke ved å skrive inn stedsnavn i søkefeltet. Resultatene vises som forslag mens du skriver, og du kan klikke på et forslag for å se avgangstider for det valgte stoppestedet.

Applikasjonen bruker Entur's Geocoder API for å finne stedsnavn og Entur's Journey Planner API for å hente avgangstider. Søkeresultatene og avgangstidene oppdateres i sanntid.

## Teknologier og verktøy
Yarn: Et pakkehåndteringssystem for å installere avhengigheter og kjøre skript.
Next.js: Et rammeverk for React-baserte applikasjoner med innebygd server-side rendering og ruting.
Tailwind CSS: Et CSS-rammeverk for å bygge responsivt brukergrensesnitt.
Entur Geocoder API: En API for å geokode stedsnavn og finne stoppesteder.
Entur Journey Planner API: En API for å hente avgangstider og reiseinformasjon for offentlig transport.

## Lisens
Dette prosjektet er lisensiert under MIT Lisensen.