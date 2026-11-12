# ==============================================================================
# SCRIPT POWERSHELL PENTRU GENERAREA BAZEI DE DATE COMPLETE „SUFLETEDRAGI”
# 70 ANIMALE SANCTUAR + 170 ANIMALE DOMESTICE (240 ANIMALE TOTAL)
# JUMĂTATE DIN ANIMALELE DE COMPANIE AU NUME AMUZANTE ÎN LIMBA ROMÂNĂ
# FIECARE ANIMAL ARE PROPRIETATEA animalType PENTRU FILTRARE EXTINSĂ
# ==============================================================================

$outputPath = "C:\Users\Name\.gemini\antigravity\scratch\adoptie-animale\js\data.js"

$cities = @("București", "Cluj-Napoca", "Timișoara", "Brașov", "Iași", "Constanța", "Sibiu", "Oradea", "Craiova", "Ploiești", "Arad", "Galați")

# ------------------------------------------------------------------------------
# 1. GENERARE 70 ANIMALE SANCTUAR
# ------------------------------------------------------------------------------
$sanctuaryAnimals = @()

$sancDefs = @(
    @{ group="leu"; species="exotic"; origin="Circ Abandonat"; min=250; max=450; size="mare"; breeds=@("Leu African de Savană", "Leu de Atlas metis", "Leu Berber Salvat"); photos=@("photo-1546182990-dffeafbe841d", "photo-1614027164847-1b28caa14434", "photo-1518709268805-4e9042af9f23", "photo-1534188753412-3e26d0d618d6") }
    @{ group="tigru"; species="exotic"; origin="Grădină Zoo Închisă"; min=300; max=500; size="mare"; breeds=@("Tigru Bengalez", "Tigru Siberian", "Tigru Hibrid Fost Circ"); photos=@("photo-1534188753412-3e26d0d618d6", "photo-1500467412204-6b93a9d949cf", "photo-1507667522163-37fb4a007d1a", "photo-1549480017-d76466a4b7e8") }
    @{ group="urs"; species="exotic"; origin="Menajerie Ilegală"; min=250; max=400; size="mare"; breeds=@("Urs Brun Carpatin", "Urs Brun European"); photos=@("photo-1530595467537-0b5996c41f2d", "photo-1589656966895-2f33e7653819", "photo-1575550959106-5a7defe28b56", "photo-1546975490-e8b92a360b24") }
    @{ group="lup"; species="exotic"; origin="Salvat din Braconaj"; min=150; max=250; size="mare"; breeds=@("Lup Cenușiu Carpatin", "Lup de Pădure"); photos=@("photo-1564988218433-861782d15053", "photo-1568470535948-43d93cb0cfa9", "photo-1588167056547-49712a3250b7") }
    @{ group="girafa"; species="exotic"; origin="Zoo Falimentară"; min=400; max=650; size="mare"; breeds=@("Girafă Rothschild", "Girafă Reticulată Africană"); photos=@("photo-1547721064-da6cfb341d50", "photo-1574870111867-089730e5a72b", "photo-1534567153574-2b12153a87f0") }
    @{ group="zebra"; species="exotic"; origin="Menajerie Privată"; min=200; max=350; size="mare"; breeds=@("Zebră de Stepă", "Zebră Grant"); photos=@("photo-1526095179574-86e545346ae6", "photo-1509114397022-ed747cca3f65", "photo-1551884170-09fb70a3a2ed") }
    @{ group="camila"; species="exotic"; origin="Circ Desființat"; min=200; max=380; size="mare"; breeds=@("Cămilă Bactriană Salvată", "Dromader de Deșert", "Lamă Alpahească"); photos=@("photo-1563281577-a7be47e20db9", "photo-1500595046743-cd271d694d30", "photo-1518791841217-8f162f1e1131") }
    @{ group="primata"; species="exotic"; origin="Captivitate Ilegală"; min=80; max=180; size="mica"; breeds=@("Lemur cu Coadă Inelată", "Maimuță Capucin Brun", "Macac Rhesus Salvat"); photos=@("photo-1540573133985-87b6da6d54a9", "photo-1516728778615-2d590ea1855e", "photo-1579202673506-ca3ce28943ef") }
    @{ group="suricata"; species="exotic"; origin="Minizoo Comercial Închis"; min=60; max=150; size="mica"; breeds=@("Suricată Africană", "Mangustă Vărgată Salvată"); photos=@("photo-1551085254-e96b210df58a", "photo-1534188753412-3e26d0d618d6") }
    @{ group="pasare-sanctuar"; species="exotic"; origin="Accident / Tăiere Aripi"; min=70; max=150; size="medie"; breeds=@("Vultur Pleșuv Carpatin", "Bufniță Mare Uhu", "Papagal Mare Ara Salvat", "Șoim Călător"); photos=@("photo-1611689342806-0863700ce1e4", "photo-1552728089-57bdde30beb3", "photo-1508873696983-2df5293cb32f") }
    @{ group="ras"; species="exotic"; origin="Fost Circ Ambulant"; min=180; max=300; size="medie"; breeds=@("Râs Carpatin Salvat", "Pumă de Circ Pensionată", "Serval African"); photos=@("photo-1561731216-c3a4d99437d5", "photo-1518709268805-4e9042af9f23") }
)

$sancNames = @(
    "Simba", "Tara", "Khan", "Baloo", "Twiga", "Marty", "Julien", "Timon", "Ali", "Lupul Dac",
    "Nala", "Mufasa", "Leo", "Bagheera", "Raja", "Maya", "Amur", "Misha", "Barni", "Ursu",
    "Maricica", "Fenrir", "Cenușiu", "Haiduc", "Foxy", "Roxy", "Zara", "Melman", "Kibo", "Stripes",
    "Ziggy", "Sahara", "Sultan", "Paco", "Maurice", "Mort", "Zaza", "Chico", "Coco", "Marcel",
    "Pumbaa-Jr", "Saffi", "Rocky", "Aquila", "Zeus", "Fulger", "Icar", "Bubo", "Hedwig", "Kiko",
    "Rio", "Polly", "Kira", "Felix", "Boris", "Carpatina", "Cora", "Nero", "Thorin", "Zazu",
    "Shere-Khan", "Kiara", "Kovu", "Sarabi", "Brunel", "Ursa", "Camelot", "Rafiki", "Akela", "Aslan"
)

for ($i = 0; $i -lt 70; $i++) {
    $def = $sancDefs[$i % $sancDefs.Count]
    $name = $sancNames[$i % $sancNames.Count]
    if ($i -ge $sancNames.Count) { $name = "$name Sanctuar" }
    
    $gender = if ($i % 2 -eq 0) { "mascul" } else { "femela" }
    $ageYears = ($i % 12) + 2
    $ageMonths = $ageYears * 12
    $loc = $cities[$i % $cities.Count]
    $breed = $def.breeds[$i % $def.breeds.Count]
    $rawCost = $def.min + (($i * 19) % ($def.max - $def.min + 1))
    $cost = [math]::Floor($rawCost / 10) * 10
    if ($cost -lt $def.min) { $cost = $def.min }
    
    $photoList = $def.photos
    $photoId = $photoList[$i % $photoList.Count]
    $img = "https://images.unsplash.com/" + $photoId + "?auto=format&fit=crop&w=700&q=80"
    
    $isUrgent = ($i % 7 -eq 0)
    $reg = "RO-SANC-" + (1000 + $i)
    $story = "$name este un exemplar superb de $breed, salvat din $($def.origin.ToLower()). Trăiește în siguranță deplină în sanctuar, unde primește hrană specifică, îngrijire veterinară zilnică și spațiu generos adaptat speciei."

    $sanctuaryAnimals += [PSCustomObject]@{
        id = "sanc-$($i + 1)"
        registryCode = $reg
        name = $name
        species = "exotic"
        animalType = "sanctuar"
        breed = $breed
        originType = $def.origin
        age = "$ageYears ani"
        ageMonths = $ageMonths
        ageCategory = if ($ageYears -le 4) { "tanar" } elseif ($ageYears -le 9) { "adult" } else { "senior" }
        size = $def.size
        gender = $gender
        location = $loc
        shelter = "Sanctuarul de Faună Sălbatică $loc"
        image = $img
        tags = @("Rezident Sanctuar", $def.origin, "$cost Lei/lună", "Protejat pe Viață")
        story = $story
        vaccinated = $true
        sterilized = ($i % 4 -ne 0)
        microchipped = $true
        urgent = $isUrgent
        status = "sanctuar"
        monthlyCost = $cost
        dateAdded = "2026-0$([math]::Max(1, ($i % 2) + 1))-$(([math]::Max(1, ($i % 27) + 1)).ToString('00'))"
        isSanctuary = $true
        sanctuaryName = "Sanctuarul de Faună Sălbatică $loc"
    }
}

# ------------------------------------------------------------------------------
# 2. GENERARE 170 ANIMALE DOMESTICE ȘI FERMĂ PENTRU ADOPȚIE
# ------------------------------------------------------------------------------
$adoptAnimals = @()

# 2.1 CÂINI (65) - Jumătate au nume amuzante românești!
$funnyDogNames = @(
    "Ciolănel", "Pufulete Turbat", "Covrig", "Mămăligă", "Sarmăluță", "Șnițel", 
    "Fănel-Viteză", "Tractor", "Papuc-Spaimă", "Lăbuș-Detector", "Domnul Profesor", 
    "Mititelu", "Biceps", "Polițistul", "Cârnat-Afumat", "Zambilă", "Ciorbă-de-Burtă", 
    "Gheorghiță-Rachetă", "Gogu-Frână", "Puf-Mitralieră", "Mușcă-Nu-Mușcă", 
    "Dorel-Mecanicu", "Gălușcă", "Cozonac-Pufos", "Pătrunjel", "Pompieru", 
    "Fănică-Șmecheru", "Bobiță-Bolid", "Gigi-Talent", "Tarzan-de-Bloc", 
    "Grivei-VIP", "Tăvălug", "Ursulet-de-Plus"
)
$classicDogNames = @(
    "Bruno", "Thor", "Bella", "Max", "Rex", "Nala", "Oscar", "Rocky", "Daisy", 
    "Lucky", "Toby", "Luna", "Bailey", "Charlie", "Milo", "Kira", "Zeus", "Sam", 
    "Buster", "Cody", "Leo", "Roxy", "Benji", "Marley", "Rusty", "Simba", "Buddy", 
    "Jack", "Oreo", "Teddy", "Finn", "Apollo"
)

$dogBreeds = @(
    "Metis Golden Retriever", "Ciobănesc German metis", "Labrador Retriever mix", 
    "Husky Siberian metis", "Bichon Maltez mix", "Beagle metis", "Border Collie mix", 
    "Teckel cu păr scurt", "Boxer metis", "Ciobănesc Mioritic carpatin", 
    "Jack Russell Terrier mix", "Cocker Spaniol metis", "Metis Talie Mică de Apartament", 
    "Metis Talie Medie", "Metis Talie Mare de Curte"
)

$dogPhotos = @(
    "photo-1552053831-71594a27632d", "photo-1537151625747-768eb6cf92b2", 
    "photo-1583511655857-d19b40a7a54e", "photo-1507146426996-ef05306b995a", 
    "photo-1543466835-00a7907e9de1", "photo-1587300003388-59208cc962cb", 
    "photo-1561037404-61cd46aa615b", "photo-1517849845537-4d257902454a", 
    "photo-1534361960057-19889db9621e", "photo-1583337130417-3346a1be7dee", 
    "photo-1598133894008-61f7fdb8cc3a"
)

for ($i = 0; $i -lt 65; $i++) {
    $isFunny = ($i % 2 -eq 0)
    $name = if ($isFunny) { $funnyDogNames[($i / 2) % $funnyDogNames.Count] } else { $classicDogNames[(($i - 1) / 2) % $classicDogNames.Count] }
    $breed = $dogBreeds[$i % $dogBreeds.Count]
    $gender = if ($i % 2 -eq 0) { "mascul" } else { "femela" }
    $ageMonths = [math]::Max(3, (($i * 7) % 130))
    $ageStr = if ($ageMonths -lt 12) { "$ageMonths luni" } else { "$([math]::Round($ageMonths/12)) ani" }
    $ageCat = if ($ageMonths -lt 12) { "pui" } elseif ($ageMonths -le 36) { "tanar" } elseif ($ageMonths -le 84) { "adult" } else { "senior" }
    $size = if ($i % 3 -eq 0) { "mica" } elseif ($i % 3 -eq 1) { "medie" } else { "mare" }
    $loc = $cities[$i % $cities.Count]
    $photo = $dogPhotos[$i % $dogPhotos.Count]
    $img = "https://images.unsplash.com/" + $photo + "?auto=format&fit=crop&w=700&q=80"
    $reg = "RO-RECS-" + (2000 + $i)
    $isUrgent = ($i % 9 -eq 0)
    $genderTag = if ($gender -eq "mascul") { "Băiețel" } else { "Fetiță" }

    $story = if ($isFunny) {
        "$name este o legendă a veseliei în adăpost! Din rasa $breed, are o energie contagioasă, fură zâmbete (și ocazional papucii îngrijitorilor) și își caută o familie care apreciază un cățel plin de haz și devotament."
    } else {
        "$name este un cățel loial și iubitor din rasa $breed. A fost vaccinat, deparazitat intern/extern și este pregătit să devină membrul devotat al unei familii responsabile."
    }

    $adoptAnimals += [PSCustomObject]@{
        id = "pet-dog-$($i + 1)"
        registryCode = $reg
        name = $name
        species = "caine"
        animalType = "caine"
        breed = $breed
        originType = "Adăpost Comunitar"
        age = $ageStr
        ageMonths = $ageMonths
        ageCategory = $ageCat
        size = $size
        gender = $gender
        location = $loc
        shelter = "Centrul Canin $loc"
        image = $img
        tags = @("Câine", $breed, $genderTag, "Vaccinat la zi")
        story = $story
        vaccinated = $true
        sterilized = ($ageMonths -ge 6)
        microchipped = $true
        urgent = $isUrgent
        status = "disponibil"
        dateAdded = "2026-0$([math]::Max(1, ($i % 2) + 1))-$(([math]::Max(1, ($i % 27) + 1)).ToString('00'))"
        isSanctuary = $false
    }
}

# 2.2 PISICI (50) - Jumătate au nume amuzante românești!
$funnyCatNames = @(
    "Pisi-Cozonac", "Mitzi-Teroare", "Puf-de-Canapea", "Ceafă-Lată", "Miorlau-Viteazul", 
    "Gheară-Lungă", "Mustață-Gheorghe", "Pâiniță-Caldă", "Șosetă-Murad", "Pliculeț-Pofticios", 
    "Dormilă-Somnorilă", "Tigaie", "Gogoașă-Felină", "Cotoi-Împărat", "Pernuță-Spaimă", 
    "Ghemuț-Turbat", "Cleo-Drama-Queen", "Cornel-Miaunel", "Miau-Miau-Gelu", "Fulg-de-Ceaun", 
    "Murătură", "Pifulete-Mic", "Blăniță-Gonzo", "Costel-Motanul", "Vasile-Mustăciosul"
)
$classicCatNames = @(
    "Luna", "Mimi", "Oscar", "Felix", "Sisi", "Tom", "Oliver", "Leo", "Bella", 
    "Garfield", "Simba", "Loki", "Chloe", "Nala", "Mia", "Toby", "Oreo", "Jasper", 
    "Smokey", "Gizmo", "Shadow", "Milo", "Tiger", "Sammy", "Puf"
)

$catBreeds = @(
    "Europeană Shorthair", "British Shorthair mix", "Siameză metis", "Albastră de Rusia mix", 
    "Motan Tigrat Tabby", "Pisică Neagră Norocoasă", "Tricoloră Călduroasă", "Persană metis", 
    "Albă cu Ochi Albastri", "Pisoi Jucăuș de Salvare"
)
$catPhotos = @(
    "photo-1514888286974-6c03e2ca1dba", "photo-1573865526739-10659fec78a5", 
    "photo-1533738363-b7f9aef128ce", "photo-1518791841217-8f162f1e1131", 
    "photo-1548767797-d8c844163c4c", "photo-1574158622682-e40e69881006", 
    "photo-1513360309081-38f076278f94", "photo-1561948955-570b270e7c36"
)

for ($i = 0; $i -lt 50; $i++) {
    $isFunny = ($i % 2 -eq 0)
    $name = if ($isFunny) { $funnyCatNames[($i / 2) % $funnyCatNames.Count] } else { $classicCatNames[(($i - 1) / 2) % $classicCatNames.Count] }
    $breed = $catBreeds[$i % $catBreeds.Count]
    $gender = if ($i % 2 -eq 0) { "mascul" } else { "femela" }
    $ageMonths = [math]::Max(2, (($i * 5) % 96))
    $ageStr = if ($ageMonths -lt 12) { "$ageMonths luni" } else { "$([math]::Round($ageMonths/12)) ani" }
    $ageCat = if ($ageMonths -lt 12) { "pui" } elseif ($ageMonths -le 36) { "tanar" } elseif ($ageMonths -le 84) { "adult" } else { "senior" }
    $loc = $cities[($i + 3) % $cities.Count]
    $photo = $catPhotos[$i % $catPhotos.Count]
    $img = "https://images.unsplash.com/" + $photo + "?auto=format&fit=crop&w=700&q=80"
    $reg = "RO-RECS-" + (4000 + $i)
    $isUrgent = ($i % 8 -eq 0)

    $story = if ($isFunny) {
        "$name este o felină cu personalitate imperială din rasa $breed! Doarme încolăcită strategic și solicită atenție și pliculețe doar când consideră de cuviință. Este extrem de curată, educată la litieră și toarce zgomotos ca un motor de avion."
    } else {
        "$name este o felină fermecătoare din rasa $breed. Este blândă, curată, educată la litieră și toarce instantaneu la mângâieri."
    }

    $adoptAnimals += [PSCustomObject]@{
        id = "pet-cat-$($i + 1)"
        registryCode = $reg
        name = $name
        species = "pisica"
        animalType = "pisica"
        breed = $breed
        originType = "Preluat din Stradă"
        age = $ageStr
        ageMonths = $ageMonths
        ageCategory = $ageCat
        size = "mica"
        gender = $gender
        location = $loc
        shelter = "Adăpostul Felin $loc"
        image = $img
        tags = @("Pisică", $breed, "Tors sonor", "Litieră")
        story = $story
        vaccinated = $true
        sterilized = ($ageMonths -ge 6)
        microchipped = $true
        urgent = $isUrgent
        status = "disponibil"
        dateAdded = "2026-0$([math]::Max(1, ($i % 2) + 1))-$(([math]::Max(1, ($i % 26) + 1)).ToString('00'))"
        isSanctuary = $false
    }
}

# 2.3 MICI COMPANIONI (35) - Porcușori, Iepuri, Țestoase, Pești, Dihori, Veverițe, Păsări
# Jumătate au nume amuzante românești!
$smallDefs = @(
    @{ type="porcusor"; name="Doctor-Guineea"; breed="Porcușor de Guineea Neted"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Ierbos", "Sociabil"); story="Doctor-Guineea a absolvit facultatea de ronțăit fân cu diplomă de merit. Consultă morcovi zilnic și fluieră de fericire când aude ușa de la frigider." }
    @{ type="porcusor"; name="Pufulete"; breed="Porcușor de Guineea Abisinian"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Păr ciufulit", "Blând"); story="Pufulete are o freză permanent ciufulită în 8 rozete și adoră să stea în poala adoptatorului în timp ce ronțăie frunze de păpădie." }
    @{ type="porcusor"; name="Ghiță-Ronțăilă"; breed="Porcușor Peruvian cu Păr Lung"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Docil", "Blăniță moale"); story="Ghiță-Ronțăilă are o viteză de procesare a fânului record pe minut și o blană lungă și spectaculoasă care necesită periaj zilnic." }
    @{ type="porcusor"; name="Mugur"; breed="Porcușor de Guineea Coronet"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Curios", "Prietenos"); story="Mugur este un porcușor foarte calm și prietenos, cu o coroniță distinsă pe frunte." }
    @{ type="porcusor"; name="Cici-Puf-de-Hambar"; breed="Porcușor Teddy American"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Calm", "Iubește fânul"); story="Arată exact ca un ursuleț de pluș miniatural cu blană aspră și deasă. Este extrem de blând." }
    @{ type="porcusor"; name="Morcovel-Supărat"; breed="Porcușor de Guineea Bicolor"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Vocal", "Jucăuș"); story="Se supără foarte tare doar dacă întârzie porția de castravete mai mult de 30 de secunde, protestând cu fluierături melodioase." }
    @{ type="porcusor"; name="Nucșor"; breed="Porcușor de Guineea Agouti"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Rapid", "Inteligent"); story="Nucșor are o culoare naturală agouti superbă și este deosebit de isteț la parcurgerea labirinturilor din carton." }
    @{ type="porcusor"; name="Bibi-Somnorosul"; breed="Porcușor de Guineea Sheltie"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Răsfățat", "Drăgălaș"); story="Bibi doarme întins complet pe burtă în hamacul de pluș și se trezește doar pentru bucățele crocante de ardei gras." }
    @{ type="porcusor"; name="Pufina"; breed="Porcușor Pitic Olandez"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Tandru", "Mic"); story="Pufina este micuță, delicată și se atașează rapid de vocea persoanei care o hrănește." }
    @{ type="porcusor"; name="Mazăre-Campionul"; breed="Porcușor Rozător Trusă"; photo="photo-1548767797-d8c844163c4c"; tags=@("Porcușor Guineea", "Pofticios", "Drăguț"); story="Mazăre-Campionul este mereu primul la bolul de hrană și face salturi acrobatice când primește iarbă proaspătă." }

    @{ type="iepure"; name="Țopăilă-Parașutistul"; breed="Iepuraș Berbec Pitic cu Urechi Lungi"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Urechi lăsate", "Litieră"); story="Face salturi de 1 metru în aer când e fericit (binkying). Are urechile lăsate adorabil și este complet învățat la litieră." }
    @{ type="iepure"; name="Morcovel"; breed="Iepuraș Cap de Leu Pufos"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Coamă de leu", "Curios"); story="Are o coamă regală de leu în jurul capului și este dornic să exploreze sufrageria fără să roadă cabluri." }
    @{ type="iepure"; name="Urechiușe-Radar"; breed="Iepuraș Pitic Olandez Albastru"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Activ", "Vegetarian"); story="Urechile lui mici recepționează orice mișcare din bucătărie. Este sprinten, curios și foarte curat." }
    @{ type="iepure"; name="Fulgușor"; breed="Iepuraș Angora de Apartament"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Blană fină", "Timid"); story="O minge de puf alb imaculat. Iubește mângâierile line pe frunte și fânul proaspăt de munte." }
    @{ type="iepure"; name="Bobiță-Vitează"; breed="Iepure Chinchilla metis"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Sociabil", "Sănătos"); story="Iepuraș extrem de sociabil și curajos, salvat dintr-un balcon neîncălzit. Acum este sănătos și deparazitat." }
    @{ type="iepure"; name="Mugur-Alb"; breed="Iepure Nouzeelandez Pitic"; photo="photo-1585110396000-c9ffd4e4b308"; tags=@("Iepure Companie", "Ochi blânzi", "Blând"); story="Ochi blânzi, caracter liniștit și docil, ideal pentru conviețuirea într-un apartament calm." }

    @{ type="testoasa"; name="Franklin-Viteză-Melc"; breed="Țestoasă de Uscat Testudo Hermanni"; photo="photo-1508455858334-95337ba25607"; tags=@("Țestoasă", "Uscat", "Ierbivoră", "Microcipată"); story="Se deplasează cu viteza uluitoare de 12 metri pe oră spre frunzele de trifoi. Are carapacea sănătoasă, microcip și acte legale." }
    @{ type="testoasa"; name="Shelly"; breed="Țestoasă de Apă Dulce Salvată"; photo="photo-1508455858334-95337ba25607"; tags=@("Țestoasă", "Apă Dulce", "Acvaterariu"); story="Salvată dintr-un bazin abandonat. Înoată cu grație și adoră să facă plajă sub lampa UVB încălzită." }
    @{ type="testoasa"; name="Sammy-Carapace-Oțel"; breed="Țestoasă Greacă cu Carapace Galbenă"; photo="photo-1508455858334-95337ba25607"; tags=@("Țestoasă", "Vegetariană", "Longevivă"); story="O broscuță venerabilă și rezistentă, dornică să trăiască alături de o familie responsabilă încă vreo 60 de ani." }
    @{ type="testoasa"; name="Leonardo"; breed="Țestoasă de Florida (Salvare)"; photo="photo-1508455858334-95337ba25607"; tags=@("Țestoasă", "Salvată din Iaz", "Docilă"); story="Preluată dintr-un parc urban. Are nevoie de un acvaterariu spațios cu filtrare adecvată." }
    @{ type="testoasa"; name="Donatello-Filozoful"; breed="Țestoasă de Uscat Marginată"; photo="photo-1508455858334-95337ba25607"; tags=@("Țestoasă", "Pașnică", "Protejată"); story="Meditează profund în fața unei frunze de salată verde timp de 20 de minute înainte de a mușca. Este extrem de pașnic." }

    @{ type="peste"; name="Nemo-de-Dâmbovița"; breed="Pereche Carași Aurii Fantail de Acvariu"; photo="photo-1522069169874-c58ec4b76be5"; tags=@("Pești Acvariu", "Carași Aurii", "Ușor de îngrijit"); story="Doi carași aurii grațioși și voioși, salvați dintr-un bol neadecvat. Au nevoie de un acvariu de minim 80 litri cu filtru ciclabil." }
    @{ type="peste"; name="Dory"; breed="Pește Betta Splendens Coroană"; photo="photo-1522069169874-c58ec4b76be5"; tags=@("Pești Acvariu", "Betta", "Culori vibrante"); story="Betta maiestuos cu înotătoare de culoare safir intens. Nu uită niciodată unde îi sunt ascunși fulgii de hrană." }
    @{ type="peste"; name="Picur-și-Solzișor"; breed="Grup de 6 Guppy Coloranți"; photo="photo-1522069169874-c58ec4b76be5"; tags=@("Pești Acvariu", "Guppy", "Mici"); story="Un grup plin de viață care luminează orice acvariu plantat. Se donează împreună cu ghidul de parametri ai apei." }
    @{ type="peste"; name="Auraș"; breed="Caras Telescop Negru Mooring"; photo="photo-1522069169874-c58ec4b76be5"; tags=@("Pești Acvariu", "Telescop", "Liniștit"); story="Ochi mari proeminenți și înot domol. Un caras negru deosebit de elegant." }
    @{ type="peste"; name="Bancul-Veseliei"; breed="Banc 10 Tetre Neon Salvate"; photo="photo-1522069169874-c58ec4b76be5"; tags=@("Pești Acvariu", "Cardiaci", "Apă dulce"); story="10 peștișori neon care înoată sincronizat ca o trupă de dans acvatic." }

    @{ type="dihor"; name="Banditu-Hoț-de-Șosete"; breed="Dihor Domestic (Mustela putorius furo)"; photo="photo-1615087240969-eeff2fa558f2"; tags=@("Dihor Domestic", "Foarte Jucăuș", "Vaccinat", "Sterilizat"); story="A sustras 14 șosete și două pixuri în prima săptămână la adăpost. Este vaccinat, sterilizat, hiper-inteligent și comic până la lacrimi." }
    @{ type="dihor"; name="Furry"; breed="Dihor Alb Albinos de Companie"; photo="photo-1615087240969-eeff2fa558f2"; tags=@("Dihor Domestic", "Curios", "Microcipat"); story="Blăniță albă ca neaua, ochișori rubinii și o curiozitate infinită pentru cutiile de carton." }
    @{ type="dihor"; name="Snoop-Spionul"; breed="Dihor Sable Mască Neagră"; photo="photo-1615087240969-eeff2fa558f2"; tags=@("Dihor Domestic", "Energic", "Deparazitat"); story="Poartă o mască de bandit naturală în jurul ochilor și inspectează fiecare colțișor al camerei înainte de a adormi 16 ore." }
    @{ type="dihor"; name="Pippin"; breed="Dihor Panda Argintiu"; photo="photo-1615087240969-eeff2fa558f2"; tags=@("Dihor Domestic", "Tandru", "Jucării"); story="Tandru și afectuos, adoră să se cuibărească la gâtul stăpânului după o sesiune intensă de joacă." }

    @{ type="veverita"; name="Vevi-Spărgătorul-de-Nuci"; breed="Veveriță Siberiană Burunduc salvată"; photo="photo-1549608276-5786777e6587"; tags=@("Veveriță", "Burunduc", "Iubește nucile"); story="Poate îndesa trei alune de pădure simultan în fălcuțe. Are dungi elegante pe spate și este extrem de vioaie." }
    @{ type="veverita"; name="Alunel"; breed="Veveriță Japoneză Dungată de Captivitate"; photo="photo-1549608276-5786777e6587"; tags=@("Veveriță", "Agilă", "Colivie mare"); story="Salvată dintr-o cușcă neconformă, are nevoie de o volieră înaltă cu crengi naturale unde să își etaleze acrobațiile." }

    @{ type="pasare"; name="Rio-Gură-Spartă"; breed="Papagal Mare Micul Alexandru Verde"; photo="photo-1552728089-57bdde30beb3"; tags=@("Papagal", "Micul Alexandru", "Inteligent", "Vocal"); story="Imită fluieratul arbitrului de fotbal și salută îngrijitorii cu 'Bună dimineața!' la orice oră din noapte. Este verde smarald și carismatic." }
    @{ type="pasare"; name="Kiki"; breed="Pereche Papagali Nimfă Cântători"; photo="photo-1552728089-57bdde30beb3"; tags=@("Papagali", "Nimfe", "Melodioși"); story="Doi nimfi nedespărțiți cu obraji portocalii focoși, care fredonează linii melodice relaxante dimineața." }
    @{ type="pasare"; name="Polly-Contabila"; breed="Grup 4 Peruși Ondulați Salvați"; photo="photo-1552728089-57bdde30beb3"; tags=@("Păsări", "Peruși", "Sociali", "Zbor liber"); story="Analizează fiecare grăunte de mei cu atenție de contabil-șef. Sunt sociabili, veseli și foarte colorați." }
)

for ($i = 0; $i -lt $smallDefs.Count; $i++) {
    $sd = $smallDefs[$i]
    $loc = $cities[($i + 4) % $cities.Count]
    $gender = if ($i % 2 -eq 0) { "mascul" } else { "femela" }
    $ageMonths = [math]::Max(4, (($i * 5) % 48))
    $ageStr = if ($ageMonths -lt 12) { "$ageMonths luni" } else { "$([math]::Round($ageMonths/12)) ani" }
    $ageCat = if ($ageMonths -lt 12) { "pui" } else { "adult" }
    $reg = "RO-PET-" + (6000 + $i)
    $img = "https://images.unsplash.com/" + $sd.photo + "?auto=format&fit=crop&w=700&q=80"
    $isUrgent = ($i % 8 -eq 0)

    $adoptAnimals += [PSCustomObject]@{
        id = "pet-small-$($i + 1)"
        registryCode = $reg
        name = $sd.name
        species = "altele"
        animalType = $sd.type
        breed = $sd.breed
        originType = "Salvat din Petshop / Donație Proprietar"
        age = $ageStr
        ageMonths = $ageMonths
        ageCategory = $ageCat
        size = "mica"
        gender = $gender
        location = $loc
        shelter = "Centrul de Mici Animale și Păsări $loc"
        image = $img
        tags = $sd.tags
        story = $sd.story
        vaccinated = ($i % 2 -eq 0)
        sterilized = ($i % 3 -eq 0)
        microchipped = ($i % 2 -eq 0)
        urgent = $isUrgent
        status = "disponibil"
        dateAdded = "2026-0$([math]::Max(1, ($i % 2) + 1))-$(([math]::Max(1, ($i % 25) + 1)).ToString('00'))"
        isSanctuary = $false
    }
}

# 2.4 ANIMALE DE FERMĂ, PONEI, MĂGĂRUȘI, CAI, VIȚEI (20)
# Jumătate au nume amuzante românești!
$farmDefs = @(
    @{ type="ponei"; name="Poneiul-Vitezoman"; breed="Ponei Shetland de Talie Mică"; photo="photo-1553284965-83fd3e82fa5a"; story="Ponei adorabil cu picioare scurte și ambiție de Formula 1. Iubește morcovii crocanți și alergatul vesel prin trifoi." }
    @{ type="ponei"; name="Poneiul Steluță"; breed="Mini-Ponei Falabella metis"; photo="photo-1553284965-83fd3e82fa5a"; story="Talie foarte mică, blană deasă și un caracter extrem de calm. Ideal pentru o fermă educațională prietenoasă." }
    @{ type="ponei"; name="Caramel-Gălușcă"; breed="Ponei Welsh Salvat"; photo="photo-1553284965-83fd3e82fa5a"; story="Rotunjor și pofticios, cere mere prin sforăituri amuzante. A fost salvat din condiții improprii și este complet reabilitat." }
    @{ type="ponei"; name="Ponei Zori"; breed="Ponei Connemara metis"; photo="photo-1553284965-83fd3e82fa5a"; story="Tânăr și vioi, socializează excelent cu alte animale de fermă și adoră să fie periat pe coamă." }
    @{ type="ponei"; name="Poneiul-Spiriduș-Nervoșel"; breed="Ponei Shetland Alb-Negru"; photo="photo-1553284965-83fd3e82fa5a"; story="Se preface supărat dacă nu e primul scos la pășune dimineața, dar se topește instantaneu dacă primește o bucățică de măr." }

    @{ type="magar"; name="Inimioară-Urechi-Lungi"; breed="Măgăruș Domestic Carpatin"; photo="photo-1546445317-29f4545e9d53"; story="Măgăruș salvat din munci istovitoare. Are urechi uriașe și o inimă și mai mare plină de recunoștință și blândețe." }
    @{ type="magar"; name="Măgărușul Vasile"; breed="Măgăruș Mediteranean metis"; photo="photo-1546445317-29f4545e9d53"; story="Răbdător, pașnic și atașat de oameni. A fost îngrijit medical în spitalul nostru veterinar și este complet sănătos." }
    @{ type="magar"; name="Ghiocel-Încăpățânatu"; breed="Măgăruș Carpatin Salvat"; photo="photo-1546445317-29f4545e9d53"; story="Dacă hotărăște să admire peisajul, nu se mai clintește 15 minute. Când termină admirația, vine singur să fie scărpinat după urechi." }
    @{ type="magar"; name="Urechilă"; breed="Măgăruș Pitic de Curte"; photo="photo-1546445317-29f4545e9d53"; story="Extrem de afectuos, dornic să fie mângâiat și periat în fiecare zi. Adoră compania copiilor." }
    @{ type="magar"; name="Măgărița-Filozof"; breed="Măgăruș Cenușiu Domestic"; photo="photo-1546445317-29f4545e9d53"; story="Privește lumea cu o înțelepciune antică. Este salvată de la un târg ilegal și merită o bătrânețe senină pe pășune." }

    @{ type="cal"; name="Ducipal-de-Bărăgan"; breed="Cal Cal de Sport Pensionat"; photo="photo-1534447677768-be436bb09401"; story="Fost campion de obstacole pensionat cu onoruri. Acum apreciază plimbările domoale la pas și iarba dulce de luncă." }
    @{ type="cal"; name="Murgu-Tractor"; breed="Cal Semigreu Carpatin"; photo="photo-1534447677768-be436bb09401"; story="Cal puternic și nobil salvat din exploatare forestieră ilegală. În ciuda forței sale uriașe, este blând ca un mielușel." }
    @{ type="cal"; name="Zorilă-Armăsarul-Blând"; breed="Cal Lipițan metis"; photo="photo-1534447677768-be436bb09401"; story="Cal alb maiestuos, sănătos, vaccinat și microcipat în registrul național al ecvideelor." }
    @{ type="cal"; name="Bălan"; breed="Cal Huțul Tradițional"; photo="photo-1534447677768-be436bb09401"; story="Rasă românească nobilă și rezistentă, dresat cu blândețe, foarte ascultător și calm." }
    @{ type="cal"; name="Steaua"; breed="Iapă Pur Sânge Arab mix"; photo="photo-1534447677768-be436bb09401"; story="Iapă grațioasă retrasă dintr-o școală de echitație, potrivită pentru pășunat și companie relaxantă." }

    @{ type="ferma"; name="Steluța-Vițica-Răsfățată"; breed="Vițelușă Bălțată Românească Salvată"; photo="photo-1516467508483-a7212febe31a"; story="Salvată de la abator când era pui. Trăiește fericită ca animal de companie și aleargă ca un cățeluș când vede voluntarii." }
    @{ type="ferma"; name="Cornel-Tăuraș-Vegetarian"; breed="Vițeluș Brun Salvat"; photo="photo-1516467508483-a7212febe31a"; story="Băiețel blând și jucăuș, iubește trifoiul proaspăt, merele tăiate și masajul cu peria pe greabăn." }
    @{ type="ferma"; name="Văcuța-Milka-de-Vaslui"; breed="Văcuță Pitică Dexter de Fermă"; photo="photo-1516467508483-a7212febe31a"; story="Văcuță de talie mică și extrem de docilă, ideală pentru o gospodărie ecologică cu spațiu generos de pășune." }
    @{ type="ferma"; name="Cori-Căprița-Capricioasă"; breed="Căpriță Pitică Olandeză de Companie"; photo="photo-1516467508483-a7212febe31a"; story="Extrem de jucăușă, curioasă și sociabilă. Sare pe baloții de paie și este prietenă bună cu câinii adăpostului." }
    @{ type="ferma"; name="Miorița-Cântăreața"; breed="Oiță Țurcană Salvată de pe Munte"; photo="photo-1516467508483-a7212febe31a"; story="Oiță blândă și calmă, deparazitată, tunsă igienic și ocrotită de voluntarii noștri pe viață." }
)

for ($i = 0; $i -lt $farmDefs.Count; $i++) {
    $fd = $farmDefs[$i]
    $loc = $cities[($i + 1) % $cities.Count]
    $gender = if ($i % 2 -eq 0) { "mascul" } else { "femela" }
    $ageYears = ($i % 9) + 2
    $ageMonths = $ageYears * 12
    $reg = "RO-FARM-" + (7000 + $i)
    $img = "https://images.unsplash.com/" + $fd.photo + "?auto=format&fit=crop&w=700&q=80"
    $isUrgent = ($i % 5 -eq 0)

    $adoptAnimals += [PSCustomObject]@{
        id = "pet-farm-$($i + 1)"
        registryCode = $reg
        name = $fd.name
        species = "ferma"
        animalType = $fd.type
        breed = $fd.breed
        originType = "Salvat din Munci Grele / Abator"
        age = "$ageYears ani"
        ageMonths = $ageMonths
        ageCategory = "adult"
        size = "mare"
        gender = $gender
        location = $loc
        shelter = "Ferma Etică și Sanctuarul de Pășune $loc"
        image = $img
        tags = @("Animal de Fermă", $fd.breed, "Grajd / Pășune Sigură", "Foarte Blând")
        story = $fd.story
        vaccinated = $true
        sterilized = $true
        microchipped = $true
        urgent = $isUrgent
        status = "disponibil"
        dateAdded = "2026-01-$(([math]::Max(1, ($i % 28) + 1)).ToString('00'))"
        isSanctuary = $false
    }
}

# ------------------------------------------------------------------------------
# 3. COMBINARE TOTALĂ & SALVARE ÎN JS/DATA.JS
# ------------------------------------------------------------------------------
$allPets = $sanctuaryAnimals + $adoptAnimals

$json = $allPets | ConvertTo-Json -Depth 6

$fileContent = @"
/**
 * ==========================================================
 * BAZĂ DE DATE NAȚIONALĂ EXTINSĂ - 240 ANIMALE
 * ==========================================================
 * 70 Rezidenți Sanctuar (Feline mari, Girafe, Zebre, Urși, Lupi, Primate, Suricate etc.)
 * 170 Animale Domestice & Fermă (65 Câini, 50 Pisici, 35 Mici Animale/Păsări/Pești, 20 Fermă)
 * Notă: Jumătate din animalele de companie au nume amuzante românești.
 * Fiecare animal include câmpul `animalType` pentru căutare și filtrare specifică.
 */

const DEFAULT_PETS = $json;
"@

# Salvare cu UTF-8 fără erori de codare
[System.IO.File]::WriteAllText($outputPath, $fileContent, (New-Object System.Text.UTF8Encoding($true)))

Write-Host "SUCCESS: Generat $($sanctuaryAnimals.Count) animale Sanctuar + $($adoptAnimals.Count) animale Adoptie = $($allPets.Count) animale totale!"
