# 🐾 SufleteDragi - Platformă Web Națională & Registru Integrat

**Realizat de student:** Lăzărică Petruț  
**Coordonare & Îndrumare:** Profesor Emil Burtescu  
**Tip Proiect:** Dezvoltare Web (Aplicație Multi-Page / Frontend Engineering)

Proiect complet de Dezvoltare Web realizat pentru facultate. Site-ul include o arhitectură multi-pagină (MPA) modernă, o bază de date extinsă de **70 de animale**, căutare și filtrare avansată pe 12 orașe din România, vizualizare duală (Carduri / Tabel Registru), export CSV și o separare etică strictă între **adopțiile fizice la domiciliu (50 animale)** și **animalele sălbatice din Sanctuar (20 rezidenți ocrotiți pe viață, susținuți prin donații)**.

---

## 📁 Structura Fișierelor

```text
adoptie-animale/
│
├── index.html          # Hub central: prezentarea celor 3 mari domenii, statistici, preview dinamic
├── animale.html        # Adopții: 50 de animale (Câini, Pisici, Mici Companioni, Fermă) - FĂRĂ animale de sanctuar
├── sanctuar.html       # Sanctuarul Sălbatic: 20 rezidenți protejați pe viață (Girafe, Zebre, Lei, Tigri, Urși, Lemuri)
├── veterinar.html      # Spital Veterinar Universitar (6 secții, Urgențe 24/7 cu avertisment 112, Programare veterinară)
├── contact.html        # Date oficiale, Rețeaua celor 6 Sanctuare din România, Voluntariat & FAQ cu întrebări amuzante
├── README.md           # Documentația tehnică a proiectului
│
├── css/
│   └── style.css       # Design modern, CSS Grid/Flexbox, carduri sanctuare, modale, toast 30 secunde
│
└── js/
    ├── data.js         # Baza de date națională completă (70 de animale cu câmpuri animalType și nume amuzante)
    └── app.js          # Logica aplicației (filtrare live, sortare, comutator Carduri/Tabel, export CSV, modale & toast 30s)
```

---

## 🦁 Baza de Date Extinsă: 240 Animale

### 1. Adopții Domestice & Fermă (`animale.html` - 50 Animale)
Animalele din Sanctuar **nu mai apar** în această secțiune. Aici se găsesc exclusiv animale disponibile pentru adopție gratuită acasă:
* 🐕 **Câini (65):** Ciolănel, Pufulete Turbat, Covrig, Mămăligă, Sarmăluță, Șnițel, Tractor, Șeriful-Costică, Biceps, Zambilă, Dorel-Mecanicu, alături de nume clasice (Bruno, Thor, Bella, Lucky).
* 🐈 **Pisici (50):** Pisi-Cozonac, Mitzi-Teroare, Puf-de-Canapea, Ceafă-Lată, Miorlau-Viteazul, Gheară-Lungă, Mustață-Gheorghe, Pâiniță-Caldă, Tigaie, Gogoașă-Felină, Cotoi-Împărat, alături de feline clasice (Luna, Mimi, Felix).
* 🐹 **Mici Companioni (35):**
  * 10 Porcușori de Guineea: Doctor-Guineea, Ghiță-Ronțăilă, Morcovel-Supărat, Bibi-Somnorosul etc.
  * 6 Iepurași de companie: Țopăilă-Parașutistul, Morcovel, Urechiușe-Radar, Fulgușor etc.
  * 5 Țestoase: Franklin-Viteză-Melc, Shelly-Carapace-Oțel, Donatello-Filozoful etc.
  * 5 Pești de acvariu: Nemo-de-Dâmbovița, Dory, Picur-și-Solzișor, Auraș etc.
  * 4 Dihori domestici: Banditu-Hoț-de-Șosete, Furry, Snoop-Spionul, Pippin.
  * 2 Veverițe siberiene: Vevi-Spărgătorul-de-Nuci, Alunel.
  * 3 Păsări de colivie: Rio-Gură-Spartă, Kiki, Polly-Contabila.
* 🐴 **Animale de Fermă (20):**
  * 5 Ponei: Poneiul-Vitezoman, Caramel-Gălușcă, Poneiul-Spiriduș-Nervoșel etc.
  * 5 Măgăruși: Inimioară-Urechi-Lungi, Ghiocel-Încăpățânatu, Măgărița-Filozof etc.
  * 5 Cai: Ducipal-de-Bărăgan, Murgu-Tractor, Zorilă-Armăsarul-Blând etc.
  * 5 Animale de Fermă: Steluța-Vițica-Răsfățată, Cornel-Tăuraș-Vegetarian, Văcuța-Milka-de-Vaslui, Cori-Căprița-Capricioasă, Miorița-Cântăreața.

> **Nume Amuzante:** Exact jumătate din animalele de companie au primit nume amuzante românești savuroase, cu descrieri pline de umor și afecțiune!

---

### 2. Rezidenți Sanctuar Sălbatic (`sanctuar.html` - 70 Animale)
* 🦁 **Feline Mari:** Lei Africani, Lei de Atlas, Tigri Bengalezi, Tigri Siberieni, Râși Carpatini, Pume pensionate din circuri.
* 🦒 **Animale Mari Exotice:** Girafe Rothschild, Zebre de Stepă, Cămile Bactriene, Dromaderi, Lame.
* 🐻 **Faună Mare Protejată:** Urși Bruni Carpatini și Lupi salvați din braconaj ilegal și captivități insalubre.
* 🐒 **Primate & Mici Mamifere:** Lemuri cu coadă inelată, Maimuțe Capucin, Macaci și colonii de Suricate.
* 🦅 **Păsări Răpitoare:** Vulturi pleșuvi, Bufnițe mari Uhu, Șoimi călători și Papagali mari Ara.

> **Regulă Etică:** Animalele de sanctuar **NU se adoptă fizic**. Butonul **„Donează”** deschide modalul prin care oricine poate deveni Părinte Simbolic printr-o **Donație Lunară (recurentă)** sau o **Donație Unică (o singură dată)**.

---

## 🌲 Rețeaua Națională de Sanctuare din România (Pe `contact.html`)

Secțiunea **„Centrele Noastre”** include prezentarea a 6 mari sanctuare specializate fictive, plasate în habitate geografice românești reale și plauzibile:
1. **Sanctuarul de Feline Mari & Urși „Poiana Bucegilor”** – Râșnov - Valea Glăjăriei, jud. Brașov (45 ha pădure montană).
2. **Rezervația de Faună de Stepă „Colinele Dobrogei”** – Casimcea - com. Stejaru, jud. Tulcea (65 ha stepă deschisă pentru girafe, zebre, cămile).
3. **Refugiul Primate & Mici Mamifere „Lunca Siretului”** – Pădurea Neagră, jud. Vrancea (18 ha domuri bioclimatice calde pentru lemuri și suricate).
4. **Sanctuarul Ursului & Lupilor „Codrii Apusenilor”** – Valea Iadului, Munții Pădurea Craiului, jud. Bihor (55 ha pădure virgină izolată).
5. **Centrul de Recuperare Ecvidee & Fermă Etică „Câmpia Soarelui”** – Gruiu-Lipia, jud. Ilfov (35 ha pășune pentru cai, ponei și măgăruși).
6. **Oaza Aviană & Refugiul Răpitoarelor „Defileul Jiului”** – Cheile Sohodolului - Runcu, jud. Gorj (voliere alpine suspendate de 28m).

---

## 😂 Întrebări Frecvente (Serioase & Amuzante)

Pe [`contact.html`](file:///C:/Users/Name/.gemini/antigravity/scratch/adoptie-animale/contact.html), pe lângă răspunsurile oficiale despre adopții și clinica veterinară, am adăugat întrebări amuzante cu răspunsuri ce par inițial serioase:
* *„Pot adopta o girafă dacă am tavanul înalt la apartament (3.8 metri, bloc interbelic)?”*
* *„Dacă pisica adoptată mă privește cu dispreț suveran și refuză să execute comenzi, beneficiază de garanție sau drept de retur?”*
* *„Dacă donez pentru un leu din sanctuar, îl pot scoate duminica în lesă în Parcul Herăstrău sau la o terasă pet-friendly?”*
* *„Câinele adoptat a mâncat o telecomandă, doi papuci și jumătate dintr-un raport contabil. Este inclus acest incident în contract?”*
* *„Pot aduce un dihor domestic la ședințele pe Zoom în calitate de consultant juridic sau manager de proiect?”*
* *„Cât de des trebuie să scot țestoasa la alergat pentru a-și menține condiția fizică de maratonist?”*

---

## ⚙️ Butoane, Navigare & Imagini Reprezentative

1. **Navigație Superioară Aerisită & Elegantă:**
   * Butonul redundant „Programare veterinară” a fost **eliminat din antetul/navbarul superior**, lăsând bara de navigare aerisită, perfect aliniată și echilibrată. Link-ul „Servicii Veterinare” din meniu rămâne activ pentru accesarea spitalului.
   * Butoanele din navbar (`Favorite` cu badge roșu și `Dă spre adopție` cu stil gradient modern) au primit finisaje CSS rotunjite (pills) și efecte tactile de hover.
2. **Servicii Veterinare - Butoane 100% Funcționale:**
   * Butoanele „Programează” și „Înscrie Animal” de pe fiecare din cele 6 carduri de servicii veterinare (`veterinar.html`) funcționează impecabil: selectează automat specialitatea medicală în formularul de jos, derulează lin pagina (smooth scroll) până la formular, evidențiază containerul cu o animație pulsantă și pun cursorul direct în câmpul de nume.
   * Butonul de Urgență 24/7 copiază automat numărul de telefon în clipboard pe desktop și inițiază apelul pe dispozitive mobile.
   * Fotografia medicului **Dr. Elena Pop** a fost actualizată cu o imagine profesională de înaltă rezoluție.
3. **Imagini Reprezentative Unice pentru Fiecare Animal:**
   * Toate cele **242 de animale** din baza de date au acum o **fotografie unică și reprezentativă**, care corespunde cu rasa și specia din listă (zero imagini duplicate în platformă).
   * Câinele Beagle numit anterior „Domnul Profesor” a fost redenumit în **„Șeriful-Costică”**.
4. **Notificări Pop-Up (Toast) de 30 de Secunde:**
   * După orice acțiune de confirmare sau trimitere (cerere de adopție, donație sanctuar, programare veterinară, dare spre adopție, trimitere mesaj contact), mesajul de confirmare rămâne pe ecran timp de **30 de secunde** (30.000 ms).
   * Pop-up-ul conține iconiță, text detaliat, indicator de timp și buton rapid de închidere `✕`.
5. **Căutare & Filtrare Extinsă pe `animale.html`:**
   * Butoane rapide (pills) și dropdown dedicat pentru fiecare tip de animal: Câini, Pisici, Porcușori de Guineea, Iepurași, Țestoase, Pești, Dihori, Veverițe, Păsări, Ponei, Măgăruși, Cai, Animale de fermă.
   * Căutare liberă instantanee după nume amuzante, rase, coduri RECS sau orașe.

---

## 🚀 Cum rulezi proiectul

1. Folderul de lucru: `C:\Users\Name\.gemini\antigravity\scratch\adoptie-animale\`
2. Deschide în browser oricare dintre pagini:
   * **`index.html`** – Pagina principală
   * **`animale.html`** – Registrul național de Adopții (50 animale, comutator Carduri/Tabel, CSV)
   * **`sanctuar.html`** – Sanctuarul sălbatic (20 rezidenți, donații lunare/unice)
   * **`veterinar.html`** – Spitalul veterinar și linia de urgență
   * **`contact.html`** – Centrele din România, FAQ amuzant și formular
