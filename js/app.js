/**
 * ==========================================================
 * LOGICA PRINCIPALĂ A BAZELOR DE DATE & INTERFEȚEI (APP.JS)
 * ==========================================================
 * Suportă:
 * 1. Adopții animale domestice & fermă (câini, pisici, ponei, măgari,
 *    cai, viței, dihori, porcușori de Guineea, țestoase, pești, păsări)
 * 2. Sanctuar Sălbatic (lei, girafe, zebre, urși, lupi, lemuri, suricate,
 *    cămile - DONAȚII LUNARE & UNICE)
 * 3. Bază de date & Registru cu filtre, sortare și export CSV
 * 4. Modale de Adopție, Sponsorizare/Donație Sanctuar și Programări Veterinar
 */

document.addEventListener('DOMContentLoaded', () => {

    // ---------- 1. GESTIONARE STOCARE LOCALĂ (LOCALSTORAGE) ----------
    const STORAGE_PETS_KEY = 'sufletedragi_pets_list_v50_sanc20_final'; // Bază 50 animale adopție + 20 rezidenți sanctuar (100% UTF-8 curat)
    const STORAGE_FAVS_KEY = 'sufletedragi_favorites';

    function getStoredPets() {
        // Curățare chei vechi cu date corupte sau număr depășit de animale
        [
            'sufletedragi_pets_list',
            'sufletedragi_pets_list_v1',
            'sufletedragi_pets_list_v16',
            'sufletedragi_pets_list_v17',
            'sufletedragi_pets_list_v18',
            'sufletedragi_pets_list_v50_clean',
            'sufletedragi_pets_list_v50_sanc20'
        ].forEach(k => {
            try { localStorage.removeItem(k); } catch (err) {}
        });

        // Verificare că DEFAULT_PETS este un array valid
        const defaultList = Array.isArray(DEFAULT_PETS) ? DEFAULT_PETS : [];

        const stored = localStorage.getItem(STORAGE_PETS_KEY);
        if (!stored) {
            localStorage.setItem(STORAGE_PETS_KEY, JSON.stringify(defaultList));
            return defaultList;
        }
        try {
            const parsed = JSON.parse(stored);
            if (!Array.isArray(parsed) || parsed.length !== defaultList.length) {
                localStorage.setItem(STORAGE_PETS_KEY, JSON.stringify(defaultList));
                return defaultList;
            }
            const rawStr = JSON.stringify(parsed);
            const hasMojibake = rawStr.includes('Äƒ') || rawStr.includes('È™') || rawStr.includes('Ă¢') || rawStr.includes('Ã®') || rawStr.includes('È›');
            if (hasMojibake) {
                localStorage.setItem(STORAGE_PETS_KEY, JSON.stringify(defaultList));
                return defaultList;
            }
            return parsed;
        } catch (e) {
            console.error('Eroare la parsarea bazei de date din storage:', e);
            localStorage.setItem(STORAGE_PETS_KEY, JSON.stringify(defaultList));
            return defaultList;
        }
    }

    function savePets(petsList) {
        localStorage.setItem(STORAGE_PETS_KEY, JSON.stringify(petsList));
    }

    function getFavorites() {
        const stored = localStorage.getItem(STORAGE_FAVS_KEY);
        return stored ? JSON.parse(stored) : [];
    }

    function saveFavorites(favsList) {
        localStorage.setItem(STORAGE_FAVS_KEY, JSON.stringify(favsList));
        updateFavoriteBadge();
    }

    let pets = getStoredPets();
    if (!Array.isArray(pets) || pets.length === 0) {
        pets = Array.isArray(DEFAULT_PETS) ? DEFAULT_PETS : [];
    }
    let favorites = getFavorites();

    // ---------- 2. STARE FILTRE & SORTARE ----------
    const isSanctuaryPage = window.location.pathname.includes('sanctuar.html') || window.location.pathname.includes('circuri.html');

    const filters = {
        search: '',
        animalType: 'toate',
        species: isSanctuaryPage ? 'exotic' : 'toate',
        location: 'toate',
        size: 'toate',
        age: 'toate',
        gender: 'toate',
        vaccinatedOnly: false,
        sterilizedOnly: false,
        microchippedOnly: false,
        sort: 'default',
        viewMode: 'cards', // 'cards' | 'table'
        onlyFavorites: false
    };

    // ---------- 3. ELEMENTE DOM GENERALE ----------
    const favCountBadge = document.getElementById('favCount');
    const favoritesBtn = document.getElementById('favoritesBtn');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    const faqItems = document.querySelectorAll('.faq-item');

    // Modale Adopție & Detalii
    const detailsModal = document.getElementById('detailsModal');
    const detailsModalBody = document.getElementById('detailsModalBody');
    const closeDetailsModalBtn = document.getElementById('closeDetailsModalBtn');

    const adoptModal = document.getElementById('adoptModal');
    const closeAdoptModalBtn = document.getElementById('closeAdoptModalBtn');
    const cancelAdoptBtn = document.getElementById('cancelAdoptBtn');
    const adoptionForm = document.getElementById('adoptionForm');
    const adoptModalTitle = document.getElementById('adoptModalTitle');
    const adoptModalSubtitle = document.getElementById('adoptModalSubtitle');
    const adoptPetId = document.getElementById('adoptPetId');
    const adoptPetName = document.getElementById('adoptPetName');
    const submitAdoptBtn = document.getElementById('submitAdoptBtn');

    // Modal Special Donație Sanctuar (Lunară / Unică)
    const sponsorModal = document.getElementById('sponsorModal');
    const openSponsorModalBtn = document.getElementById('openSponsorModalBtn');
    const closeSponsorModalBtn = document.getElementById('closeSponsorModalBtn');
    const cancelSponsorBtn = document.getElementById('cancelSponsorBtn');
    const sponsorForm = document.getElementById('sponsorForm');
    const sponsorPetSelect = document.getElementById('sponsorPetSelect');
    const freqRadios = document.querySelectorAll('input[name="donationFrequency"]');
    const tierAmountTexts = document.querySelectorAll('.tier-amount-text');
    const submitDonationBtn = document.getElementById('submitDonationBtn');

    // Elemente Bază de Date & Filtre (animale.html)
    const petsGrid = document.getElementById('petsGrid');
    const previewGrid = document.getElementById('previewGrid');
    const dbTableContainer = document.getElementById('dbTableContainer');
    const dbTableBody = document.getElementById('dbTableBody');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');
    const searchInput = document.getElementById('searchInput');
    const speciesPills = document.querySelectorAll('#speciesFilter .pill');
    const animalTypeFilter = document.getElementById('animalTypeFilter');
    const locationFilter = document.getElementById('locationFilter');
    const sizeFilter = document.getElementById('sizeFilter');
    const ageFilter = document.getElementById('ageFilter');
    const genderFilter = document.getElementById('genderFilter');
    const sortSelect = document.getElementById('sortSelect');
    const filterVaccinated = document.getElementById('filterVaccinated');
    const filterSterilized = document.getElementById('filterSterilized');
    const filterMicrochipped = document.getElementById('filterMicrochipped');
    const resetFiltersBtn = document.getElementById('resetFiltersBtn');
    const emptyResetBtn = document.getElementById('emptyResetBtn');
    const activeFilterBadge = document.getElementById('activeFilterBadge');
    const clearFavoritesFilter = document.getElementById('clearFavoritesFilter');

    // Statistici Bază de Date
    const dbTotalCount = document.getElementById('dbTotalCount');
    const dbVaccinatedRate = document.getElementById('dbVaccinatedRate');
    const dbUrgentCount = document.getElementById('dbUrgentCount');

    // Comutatoare Vizualizare & Export CSV
    const viewCardsBtn = document.getElementById('viewCardsBtn');
    const viewTableBtn = document.getElementById('viewTableBtn');
    const exportCsvBtn = document.getElementById('exportCsvBtn');

    // Modal Înregistrare Animal
    const addPetModal = document.getElementById('addPetModal');
    const openAddModalBtn = document.getElementById('openAddModalBtn');
    const closeAddPetModalBtn = document.getElementById('closeAddPetModalBtn');
    const cancelAddPetBtn = document.getElementById('cancelAddPetBtn');
    const addPetForm = document.getElementById('addPetForm');

    // Modal & Formular Servicii Veterinare
    const vetAppointmentModal = document.getElementById('vetAppointmentModal');
    const openVetModalBtn = document.getElementById('openVetModalBtn');
    const closeVetModalBtn = document.getElementById('closeVetModalBtn');
    const cancelVetBtn = document.getElementById('cancelVetBtn');
    const vetAppointmentForm = document.getElementById('vetAppointmentForm');
    const vetServiceChoice = document.getElementById('vetServiceChoice');
    const vetPreferredDate = document.getElementById('vetPreferredDate');
    const bookServiceBtns = document.querySelectorAll('.book-service-btn');

    // Formular Contact
    const contactForm = document.getElementById('contactForm');

    if (vetPreferredDate) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        vetPreferredDate.min = tomorrow.toISOString().split('T')[0];
        vetPreferredDate.value = tomorrow.toISOString().split('T')[0];
    }

    // ---------- 4. FILTRARE & SORTARE BAZĂ DE DATE ----------
    function getFilteredAndSortedPets() {
        let result = pets.filter(pet => {
            // REGULĂ ETICĂ STRICTĂ: Animalele din sanctuar NU apar în baza de date de adopție!
            if (isSanctuaryPage) {
                if (!pet.isSanctuary && pet.species !== 'exotic') return false;
            } else {
                if (pet.isSanctuary || pet.species === 'exotic') return false;
            }

            // Filtrare după tip de animal specific (câine, pisică, porcușor, iepure, țestoasă, pește, dihor, veveriță, pasăre, ponei, măgar, cal, fermă)
            if (filters.animalType && filters.animalType !== 'toate' && pet.animalType !== filters.animalType) {
                return false;
            }

            // Căutare text liberă (nume, rasă, cod RECS, descriere, taguri, tip de animal)
            if (filters.search) {
                const q = filters.search.toLowerCase();
                const matchName = pet.name.toLowerCase().includes(q);
                const matchBreed = pet.breed.toLowerCase().includes(q);
                const matchLocation = pet.location && pet.location.toLowerCase().includes(q);
                const matchCode = pet.registryCode && pet.registryCode.toLowerCase().includes(q);
                const matchOrigin = pet.originType && pet.originType.toLowerCase().includes(q);
                const matchDesc = pet.story && pet.story.toLowerCase().includes(q);
                const matchTags = pet.tags && pet.tags.some(t => t.toLowerCase().includes(q));
                const matchType = pet.animalType && pet.animalType.toLowerCase().includes(q);

                if (!matchName && !matchBreed && !matchLocation && !matchCode && !matchOrigin && !matchDesc && !matchTags && !matchType) {
                    return false;
                }
            }

            // Specie macro (dacă e setată)
            if (!isSanctuaryPage && filters.species !== 'toate' && pet.species !== filters.species) {
                return false;
            }

            // Locație
            if (filters.location !== 'toate' && pet.location !== filters.location) {
                return false;
            }

            // Talie
            if (filters.size !== 'toate' && pet.size !== filters.size) {
                return false;
            }

            // Vârstă
            if (filters.age !== 'toate' && pet.ageCategory !== filters.age) {
                return false;
            }

            // Sex
            if (filters.gender !== 'toate' && pet.gender !== filters.gender) {
                return false;
            }

            // Filtre Medicale
            if (filters.vaccinatedOnly && !pet.vaccinated) return false;
            if (filters.sterilizedOnly && !pet.sterilized) return false;
            if (filters.microchippedOnly && !pet.microchipped) return false;

            // Favorite
            if (filters.onlyFavorites && !favorites.includes(pet.id)) {
                return false;
            }

            return true;
        });

        // Sortare
        switch (filters.sort) {
            case 'ageAsc':
                result.sort((a, b) => (a.ageMonths || 0) - (b.ageMonths || 0));
                break;
            case 'ageDesc':
                result.sort((a, b) => (b.ageMonths || 0) - (a.ageMonths || 0));
                break;
            case 'nameAsc':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameDesc':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'urgent':
                result.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
                break;
            case 'newest':
                result.sort((a, b) => new Date(b.dateAdded || 0) - new Date(a.dateAdded || 0));
                break;
            default:
                break;
        }

        return result;
    }

    // ---------- 5. RANDARE INTERFAȚĂ BAZĂ DE DATE ----------
    function renderPets() {
        if (!petsGrid && !dbTableContainer) return;

        const filtered = getFilteredAndSortedPets();

        updateDatabaseStats(filtered);

        if (resultsCount) {
            resultsCount.textContent = `Au fost găsite ${filtered.length} înregistrări în baza de date`;
        }

        if (filtered.length === 0) {
            if (petsGrid) petsGrid.innerHTML = '';
            if (dbTableBody) dbTableBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        } else {
            if (emptyState) emptyState.style.display = 'none';
        }

        if (filters.viewMode === 'table' && dbTableContainer) {
            if (petsGrid) petsGrid.style.display = 'none';
            dbTableContainer.style.display = 'block';
            renderTableView(filtered);
        } else {
            if (petsGrid) {
                petsGrid.style.display = 'grid';
                petsGrid.innerHTML = filtered.map(pet => createPetCardHTML(pet)).join('');
            }
            if (dbTableContainer) dbTableContainer.style.display = 'none';
        }
    }

    function renderTableView(list) {
        if (!dbTableBody) return;

        dbTableBody.innerHTML = list.map(pet => {
            const isFav = favorites.includes(pet.id);
            const isMale = pet.gender === 'mascul';
            const genderSymbol = isMale ? '<span style="color:#3b82f6;">♂</span>' : '<span style="color:#ec4899;">♀</span>';
            const regCode = pet.registryCode || `RO-${pet.id.toUpperCase()}`;
            const isExotic = pet.species === 'exotic' || pet.isSanctuary;

            let statusHTML = '<span class="pet-status-badge status-available" style="position:static;">Disponibil Adopție</span>';
            let actionBtnHTML = `
                <button class="btn btn-primary btn-table-sm" data-action="adopt" data-id="${pet.id}">
                    <i class="fa-solid fa-paw"></i> Adoptă
                </button>
            `;

            if (isExotic) {
                statusHTML = '<span class="pet-status-badge status-circus" style="position:static;"><i class="fa-solid fa-tree"></i> Rezident Sanctuar</span>';
                actionBtnHTML = `
                    <button class="btn btn-circus btn-table-sm" data-action="sponsor" data-id="${pet.id}">
                        <i class="fa-solid fa-hand-holding-heart"></i> Donează
                    </button>
                `;
            } else if (pet.urgent) {
                statusHTML = '<span class="pet-status-badge status-urgent" style="position:static;">Urgență</span>';
            }

            return `
                <tr>
                    <td>
                        <div class="table-pet-cell">
                            <img src="${escapeHTML(pet.image)}" alt="${escapeHTML(pet.name)}" class="table-pet-thumb" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80';">
                            <div class="table-pet-info">
                                <strong>${escapeHTML(pet.name)} ${genderSymbol}</strong>
                                <span class="table-reg-code">${escapeHTML(regCode)}</span>
                            </div>
                        </div>
                    </td>
                    <td>
                        <strong>${escapeHTML(pet.species.toUpperCase())}</strong>
                        <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(pet.breed)}</div>
                    </td>
                    <td>
                        <strong>${escapeHTML(pet.age)}</strong>
                        <div style="font-size:0.75rem; color:var(--text-muted);">${pet.ageMonths ? `${pet.ageMonths} luni` : ''}</div>
                    </td>
                    <td>
                        <span class="table-location-badge">
                            <i class="fa-solid fa-location-dot"></i> ${escapeHTML(pet.location || 'România')}
                        </span>
                    </td>
                    <td>
                        <div class="table-med-chips">
                            <span class="med-chip ${pet.vaccinated ? 'chip-yes' : 'chip-no'}" title="${pet.vaccinated ? 'Vaccinat' : 'Nevaccinat'}">
                                <i class="fa-solid fa-syringe"></i>
                            </span>
                            <span class="med-chip ${pet.sterilized ? 'chip-yes' : 'chip-no'}" title="${pet.sterilized ? 'Sterilizat' : 'Nesterilizat'}">
                                <i class="fa-solid fa-scissors"></i>
                            </span>
                            <span class="med-chip ${pet.microchipped ? 'chip-yes' : 'chip-no'}" title="${pet.microchipped ? 'Microcipat RECS' : 'Fără Microcip'}">
                                <i class="fa-solid fa-microchip"></i>
                            </span>
                        </div>
                    </td>
                    <td>
                        ${statusHTML}
                    </td>
                    <td style="text-align:right;">
                        <div class="table-actions" style="justify-content: flex-end;">
                            <button class="btn btn-outline btn-table-sm" data-action="details" data-id="${pet.id}">
                                <i class="fa-solid fa-eye"></i> Detalii
                            </button>
                            ${actionBtnHTML}
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    function updateDatabaseStats(filteredList) {
        if (dbTotalCount) {
            dbTotalCount.textContent = `${filteredList.length} înregistrări`;
        }

        if (dbVaccinatedRate && filteredList.length > 0) {
            const vaccinatedCount = filteredList.filter(p => p.vaccinated).length;
            const rate = Math.round((vaccinatedCount / filteredList.length) * 100);
            dbVaccinatedRate.textContent = `${rate}% Vaccinate`;
        }

        if (dbUrgentCount) {
            const urgentCount = filteredList.filter(p => p.urgent).length;
            dbUrgentCount.textContent = `${urgentCount} Urgențe Active`;
        }
    }

    function renderHomePreview() {
        if (!previewGrid) return;
        const previewPets = pets.slice(0, 4);
        previewGrid.innerHTML = previewPets.map(pet => createPetCardHTML(pet)).join('');
    }

    function createPetCardHTML(pet) {
        const isFav = favorites.includes(pet.id);
        const isMale = pet.gender === 'mascul';
        const genderIcon = isMale ? 'fa-mars gender-male' : 'fa-venus gender-female';
        const isExotic = pet.species === 'exotic' || pet.isSanctuary;
        const regCode = pet.registryCode || `RO-${pet.id.toUpperCase()}`;

        let statusBadge = '';
        let actionBtnHTML = '';

        if (isExotic) {
            statusBadge = '<span class="pet-status-badge status-circus"><i class="fa-solid fa-tree"></i> Rezident Sanctuar</span>';
            actionBtnHTML = `
                <button class="btn btn-circus btn-card-adopt" data-action="sponsor" data-id="${pet.id}">
                    <i class="fa-solid fa-hand-holding-heart"></i> Donează
                </button>
            `;
        } else if (pet.urgent) {
            statusBadge = '<span class="pet-status-badge status-urgent">Urgență</span>';
            actionBtnHTML = `
                <button class="btn btn-primary btn-card-adopt" data-action="adopt" data-id="${pet.id}">
                    <i class="fa-solid fa-paw"></i> Adoptă
                </button>
            `;
        } else {
            statusBadge = '<span class="pet-status-badge status-available">Disponibil Adopție</span>';
            actionBtnHTML = `
                <button class="btn btn-primary btn-card-adopt" data-action="adopt" data-id="${pet.id}">
                    <i class="fa-solid fa-paw"></i> Adoptă
                </button>
            `;
        }

        const tagsHTML = pet.tags 
            ? pet.tags.slice(0, 3).map(tag => `<span class="pet-tag">${escapeHTML(tag)}</span>`).join('')
            : '';

        const locationHTML = pet.location 
            ? `<span style="font-size:0.8rem; color:#0284c7; font-weight:600;"><i class="fa-solid fa-location-dot"></i> ${escapeHTML(pet.location)}</span>`
            : '';

        const originBadge = pet.originType 
            ? `<div style="font-size:0.75rem; color:#d97706; font-weight:700; margin-bottom:0.3rem;"><i class="fa-solid fa-shield-cat"></i> Proveniență: ${escapeHTML(pet.originType)}</div>` 
            : '';

        return `
            <article class="pet-card" data-id="${pet.id}">
                <div class="pet-img-container">
                    <img src="${escapeHTML(pet.image)}" alt="${escapeHTML(pet.name)}" class="pet-card-img" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80';">
                    ${statusBadge}
                </div>
                <div class="pet-card-content">
                    <div class="pet-card-header">
                        <h3 class="pet-name">${escapeHTML(pet.name)}</h3>
                        <i class="fa-solid ${genderIcon} pet-gender-icon" title="${isMale ? 'Mascul' : 'Femelă'}"></i>
                    </div>
                    ${originBadge}
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                        <span class="table-reg-code">${escapeHTML(regCode)}</span>
                        ${locationHTML}
                    </div>
                    <p class="pet-breed">${escapeHTML(pet.breed)} &bull; ${escapeHTML(pet.age)}</p>
                    <div class="pet-tags">
                        ${tagsHTML}
                    </div>
                    <div class="pet-card-footer">
                        <button class="btn btn-outline btn-card-details" data-action="details" data-id="${pet.id}">
                            <i class="fa-solid fa-circle-info"></i> Detalii
                        </button>
                        ${actionBtnHTML}
                    </div>
                </div>
            </article>
        `;
    }

    function escapeHTML(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ---------- 6. EXPORT CSV ----------
    function exportToCSV() {
        const filteredList = getFilteredAndSortedPets();
        if (filteredList.length === 0) {
            showToast('Nu există date de exportat cu filtrele curente.', 'error');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
        csvContent += "Cod_Identificare,Nume,Specie,Provenienta,Rasa,Varsta,Varsta_Luni,Locatie,Sex,Talie,Vaccinat,Sterilizat,Microcipat,Status_Sanctuar\r\n";

        filteredList.forEach(p => {
            const row = [
                `"${p.registryCode || p.id}"`,
                `"${p.name}"`,
                `"${p.species}"`,
                `"${p.originType || 'Comunitate'}"`,
                `"${p.breed}"`,
                `"${p.age}"`,
                `"${p.ageMonths || ''}"`,
                `"${p.location || 'Romania'}"`,
                `"${p.gender}"`,
                `"${p.size}"`,
                `"${p.vaccinated ? 'DA' : 'NU'}"`,
                `"${p.sterilized ? 'DA' : 'NU'}"`,
                `"${p.microchipped ? 'DA' : 'NU'}"`,
                `"${p.isSanctuary ? 'Rezident Sanctuar (Donație)' : 'Disponibil Adopție'}"`
            ];
            csvContent += row.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `registru_sufletedragi_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`📥 Baza de date (${filteredList.length} animale) a fost exportată în CSV!`);
    }

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCSV);
    }

    // ---------- 7. EVENIMENTE FILTRE & SORTARE ----------
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filters.search = e.target.value.trim();
            renderPets();
        });
    }

    if (speciesPills.length > 0) {
        speciesPills.forEach(pill => {
            pill.addEventListener('click', () => {
                speciesPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const selectedType = pill.dataset.type || pill.dataset.species || 'toate';
                filters.animalType = selectedType;
                if (animalTypeFilter) animalTypeFilter.value = selectedType;
                renderPets();
            });
        });
    }

    if (animalTypeFilter) {
        animalTypeFilter.addEventListener('change', (e) => {
            filters.animalType = e.target.value;
            if (speciesPills.length > 0) {
                speciesPills.forEach(p => {
                    const match = (p.dataset.type || p.dataset.species) === filters.animalType;
                    p.classList.toggle('active', match);
                });
            }
            renderPets();
        });
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', (e) => {
            filters.location = e.target.value;
            renderPets();
        });
    }

    if (sizeFilter) {
        sizeFilter.addEventListener('change', (e) => {
            filters.size = e.target.value;
            renderPets();
        });
    }

    if (ageFilter) {
        ageFilter.addEventListener('change', (e) => {
            filters.age = e.target.value;
            renderPets();
        });
    }

    if (genderFilter) {
        genderFilter.addEventListener('change', (e) => {
            filters.gender = e.target.value;
            renderPets();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            filters.sort = e.target.value;
            renderPets();
        });
    }

    if (filterVaccinated) {
        filterVaccinated.addEventListener('change', (e) => {
            filters.vaccinatedOnly = e.target.checked;
            renderPets();
        });
    }

    if (filterSterilized) {
        filterSterilized.addEventListener('change', (e) => {
            filters.sterilizedOnly = e.target.checked;
            renderPets();
        });
    }

    if (filterMicrochipped) {
        filterMicrochipped.addEventListener('change', (e) => {
            filters.microchippedOnly = e.target.checked;
            renderPets();
        });
    }

    if (viewCardsBtn && viewTableBtn) {
        viewCardsBtn.addEventListener('click', () => {
            viewCardsBtn.classList.add('active');
            viewTableBtn.classList.remove('active');
            filters.viewMode = 'cards';
            renderPets();
        });

        viewTableBtn.addEventListener('click', () => {
            viewTableBtn.classList.add('active');
            viewCardsBtn.classList.remove('active');
            filters.viewMode = 'table';
            renderPets();
        });
    }

    function resetAllFilters() {
        filters.search = '';
        filters.animalType = 'toate';
        filters.species = isSanctuaryPage ? 'exotic' : 'toate';
        filters.location = 'toate';
        filters.size = 'toate';
        filters.age = 'toate';
        filters.gender = 'toate';
        filters.vaccinatedOnly = false;
        filters.sterilizedOnly = false;
        filters.microchippedOnly = false;
        filters.sort = 'default';
        filters.onlyFavorites = false;

        if (searchInput) searchInput.value = '';
        if (animalTypeFilter) animalTypeFilter.value = 'toate';
        if (locationFilter) locationFilter.value = 'toate';
        if (sizeFilter) sizeFilter.value = 'toate';
        if (ageFilter) ageFilter.value = 'toate';
        if (genderFilter) genderFilter.value = 'toate';
        if (sortSelect) sortSelect.value = 'default';
        if (filterVaccinated) filterVaccinated.checked = false;
        if (filterSterilized) filterSterilized.checked = false;
        if (filterMicrochipped) filterMicrochipped.checked = false;

        if (speciesPills.length > 0) {
            speciesPills.forEach(p => {
                const isDefault = (p.dataset.type === 'toate') || (p.dataset.species === (isSanctuaryPage ? 'exotic' : 'toate'));
                p.classList.toggle('active', isDefault);
            });
        }

        if (activeFilterBadge) activeFilterBadge.style.display = 'none';
        renderPets();
        showToast('Filtrele bazei de date au fost resetate.', 'success', 5000);
    }

    if (resetFiltersBtn) resetFiltersBtn.addEventListener('click', resetAllFilters);
    if (emptyResetBtn) emptyResetBtn.addEventListener('click', resetAllFilters);

    // ---------- 8. FAVORITE ----------
    function updateFavoriteBadge() {
        if (favCountBadge) {
            favCountBadge.textContent = favorites.length;
        }
    }

    if (favoritesBtn) {
        favoritesBtn.addEventListener('click', () => {
            if (!petsGrid && !previewGrid) {
                window.location.href = 'animale.html?filter=favorites';
                return;
            }

            filters.onlyFavorites = !filters.onlyFavorites;
            if (activeFilterBadge) {
                activeFilterBadge.style.display = filters.onlyFavorites ? 'inline-flex' : 'none';
            }
            renderPets();

            if (filters.onlyFavorites) {
                showToast(`Se afișează ${favorites.length} suflete favorite.`);
                const targetSec = document.getElementById('catalog-section') || document.getElementById('animale');
                if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (clearFavoritesFilter) {
        clearFavoritesFilter.addEventListener('click', () => {
            filters.onlyFavorites = false;
            activeFilterBadge.style.display = 'none';
            renderPets();
        });
    }

    // Delegare evenimente acțiuni carduri & tabel
    [petsGrid, previewGrid, dbTableContainer].forEach(container => {
        if (!container) return;
        container.addEventListener('click', (e) => {
            const favBtn = e.target.closest('.fav-btn');
            if (favBtn) {
                toggleFavorite(favBtn.dataset.id);
                return;
            }

            const detailsBtn = e.target.closest('[data-action="details"]');
            if (detailsBtn) {
                openDetailsModal(detailsBtn.dataset.id);
                return;
            }

            const adoptBtn = e.target.closest('[data-action="adopt"]');
            if (adoptBtn) {
                openAdoptModal(adoptBtn.dataset.id);
                return;
            }

            const sponsorBtn = e.target.closest('[data-action="sponsor"]');
            if (sponsorBtn) {
                openSponsorModal(sponsorBtn.dataset.id);
                return;
            }
        });
    });

    function toggleFavorite(id) {
        const pet = pets.find(p => p.id === id);
        const petName = pet ? pet.name : 'Animalul';
        const isAdding = !favorites.includes(id);

        if (isAdding) {
            favorites.push(id);
            saveFavorites(favorites);
            showToast(`❤️ ${petName} a fost adăugat la favorite!`);
        } else {
            favorites = favorites.filter(favId => favId !== id);
            saveFavorites(favorites);
            showToast(`${petName} a fost eliminat din favorite.`);
        }

        // Animație bump pe contorul din navbar
        if (favCountBadge) {
            favCountBadge.classList.remove('badge-bump');
            void favCountBadge.offsetWidth;
            favCountBadge.classList.add('badge-bump');
            setTimeout(() => favCountBadge.classList.remove('badge-bump'), 450);
        }

        renderPets();
        renderHomePreview();

        // Animație pop pe butonul apăsat
        const pressedBtn = document.querySelector(`.fav-btn[data-id="${id}"]`);
        if (pressedBtn) {
            pressedBtn.classList.add('heart-pop');
            setTimeout(() => pressedBtn.classList.remove('heart-pop'), 500);
        }
    }

    // ---------- 9. MODAL DETALII ANIMAL ----------
    function openDetailsModal(id) {
        if (!detailsModal || !detailsModalBody) return;
        const pet = pets.find(p => p.id === id);
        if (!pet) return;

        const isMale = pet.gender === 'mascul';
        const isExotic = pet.species === 'exotic' || pet.isSanctuary;
        const regCode = pet.registryCode || `RO-${pet.id.toUpperCase()}`;

        const categoryTag = isExotic 
            ? '<span class="section-tag" style="background:#fffbeb; color:#b45309; border-color:#fde68a;"><i class="fa-solid fa-tree"></i> REZIDENT SANCTUAR</span>'
            : `<span class="section-tag">${escapeHTML(pet.species.toUpperCase())}</span>`;

        let sanctuaryNoticeHTML = '';
        let modalActionBtnHTML = '';

        if (isExotic) {
            sanctuaryNoticeHTML = `
                <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.85rem; color:#92400e;">
                    <i class="fa-solid fa-shield-heart" style="color:#d97706;"></i>
                    <strong>Rezident Permanent în Sanctuar:</strong> Acest animal trăiește în semi-libertate și <u>NU se poate adopta la domiciliu</u>. Poți însă dona (lunar sau o singură dată) pentru hrana și îngrijirea lui!
                </div>
            `;
            modalActionBtnHTML = `
                <button class="btn btn-circus btn-block" id="modalSponsorBtn" data-id="${pet.id}">
                    <i class="fa-solid fa-hand-holding-heart"></i> Donează pentru ${escapeHTML(pet.name)}
                </button>
            `;
        } else {
            modalActionBtnHTML = `
                <button class="btn btn-primary btn-block" id="modalAdoptBtn" data-id="${pet.id}">
                    <i class="fa-solid fa-heart"></i> Vreau să-l adopt pe ${escapeHTML(pet.name)}
                </button>
            `;
        }

        const locationNotice = `
            <div style="margin-bottom:1rem; padding:0.6rem 0.9rem; background:#f0f9ff; border-radius:8px; font-size:0.88rem; color:#0369a1; border:1px solid #bae6fd;">
                <i class="fa-solid fa-location-dot"></i> <strong>Locație:</strong> ${escapeHTML(pet.location || 'România')} &bull; ${escapeHTML(pet.shelter || 'Centru Partener')}
            </div>
        `;

        detailsModalBody.innerHTML = `
            <div class="details-grid">
                <div class="details-media">
                    <img src="${escapeHTML(pet.image)}" alt="${escapeHTML(pet.name)}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=700&q=80';">
                </div>
                <div class="details-info">
                    <div class="details-badges">
                        ${categoryTag}
                        <span class="table-reg-code" style="font-size:0.85rem; padding:0.25rem 0.6rem;">Cod: ${escapeHTML(regCode)}</span>
                        ${pet.urgent ? '<span class="pet-status-badge status-urgent" style="position:static;">Urgență</span>' : ''}
                    </div>

                    <h2 class="details-title">${escapeHTML(pet.name)}</h2>
                    <p class="details-breed">${escapeHTML(pet.breed)} ${pet.originType ? `&bull; Proveniență: ${escapeHTML(pet.originType)}` : ''}</p>

                    ${sanctuaryNoticeHTML}
                    ${locationNotice}

                    <div class="details-specs">
                        <div class="spec-item">
                            <span>Vârstă</span>
                            <strong>${escapeHTML(pet.age)}</strong>
                        </div>
                        <div class="spec-item">
                            <span>Sex</span>
                            <strong>${isMale ? 'Mascul' : 'Femelă'}</strong>
                        </div>
                        <div class="spec-item">
                            <span>Talie</span>
                            <strong>${escapeHTML(pet.size.toUpperCase())}</strong>
                        </div>
                    </div>

                    <div class="details-story">
                        <h4>Poveste & Istoric:</h4>
                        <p>${escapeHTML(pet.story)}</p>
                    </div>

                    <div class="details-medical">
                        <h4>Statut Medical:</h4>
                        <div class="medical-tags">
                            <span class="med-tag ${pet.vaccinated ? 'yes' : 'no'}">
                                <i class="fa-solid ${pet.vaccinated ? 'fa-check' : 'fa-xmark'}"></i>
                                ${pet.vaccinated ? 'Vaccinat' : 'Nevaccinat'}
                            </span>
                            <span class="med-tag ${pet.sterilized ? 'yes' : 'no'}">
                                <i class="fa-solid ${pet.sterilized ? 'fa-check' : 'fa-xmark'}"></i>
                                ${pet.sterilized ? 'Sterilizat' : 'Nesterilizat'}
                            </span>
                            <span class="med-tag ${pet.microchipped ? 'yes' : 'no'}">
                                <i class="fa-solid ${pet.microchipped ? 'fa-check' : 'fa-xmark'}"></i>
                                ${pet.microchipped ? 'Microcipat & RECS' : 'Fără cip'}
                            </span>
                        </div>
                    </div>

                    <div class="details-footer-actions">
                        ${modalActionBtnHTML}
                    </div>
                </div>
            </div>
        `;

        const modalAdoptBtn = document.getElementById('modalAdoptBtn');
        if (modalAdoptBtn) {
            modalAdoptBtn.addEventListener('click', () => {
                closeModal(detailsModal);
                openAdoptModal(pet.id);
            });
        }

        const modalSponsorBtn = document.getElementById('modalSponsorBtn');
        if (modalSponsorBtn) {
            modalSponsorBtn.addEventListener('click', () => {
                closeModal(detailsModal);
                openSponsorModal(pet.id);
            });
        }

        openModal(detailsModal);
    }

    if (closeDetailsModalBtn) {
        closeDetailsModalBtn.addEventListener('click', () => closeModal(detailsModal));
    }

    // ---------- 10. MODAL FORMULAR ADOPȚIE DOMESTICĂ ----------
    function openAdoptModal(id) {
        if (!adoptModal) return;
        const pet = pets.find(p => p.id === id);
        if (!pet) return;

        if (pet.isSanctuary || pet.species === 'exotic') {
            openSponsorModal(id);
            return;
        }

        if (adoptPetId) adoptPetId.value = pet.id;
        if (adoptPetName) adoptPetName.value = pet.name;
        if (adoptModalTitle) adoptModalTitle.textContent = `Cerere de Adopție: ${pet.name}`;
        if (adoptModalSubtitle) adoptModalSubtitle.textContent = `Completează datele pentru a începe adopția lui ${pet.name} (${pet.breed}) din ${pet.location || 'România'}.`;

        openModal(adoptModal);
    }

    if (closeAdoptModalBtn) closeAdoptModalBtn.addEventListener('click', () => closeModal(adoptModal));
    if (cancelAdoptBtn) cancelAdoptBtn.addEventListener('click', () => closeModal(adoptModal));

    if (adoptionForm) {
        adoptionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const petName = adoptPetName ? adoptPetName.value : 'Animalul';
            const adopter = document.getElementById('adopterName').value.trim();

            closeModal(adoptModal);
            adoptionForm.reset();

            if (typeof launchConfetti === 'function') launchConfetti();
            showToast(`🎉 Felicitări, ${adopter}! Cererea ta de adopție pentru ${petName} a fost trimisă cu succes către adăpost. Te vom contacta în maxim 24 de ore pentru stabilirea unei vizite de cunoaștere!`, 'success', 30000);
        });
    }

    // ---------- 11. MODAL DONAȚIE SANCTUAR (LUNARĂ / UNICĂ) ----------
    function openSponsorModal(petId) {
        if (!sponsorModal) return;

        if (petId && sponsorPetSelect) {
            const pet = pets.find(p => p.id === petId);
            if (pet) {
                let found = false;
                for (let option of sponsorPetSelect.options) {
                    if (option.text.toLowerCase().includes(pet.name.toLowerCase())) {
                        option.selected = true;
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    const opt = document.createElement('option');
                    opt.value = `${pet.name} (${pet.breed})`;
                    opt.text = `${pet.name} - ${pet.breed} (${pet.originType || 'Sanctuar'})`;
                    opt.selected = true;
                    sponsorPetSelect.insertBefore(opt, sponsorPetSelect.firstChild);
                }
            }
        }

        openModal(sponsorModal);
    }

    if (openSponsorModalBtn) {
        openSponsorModalBtn.addEventListener('click', () => openSponsorModal());
    }

    if (closeSponsorModalBtn) closeSponsorModalBtn.addEventListener('click', () => closeModal(sponsorModal));
    if (cancelSponsorBtn) cancelSponsorBtn.addEventListener('click', () => closeModal(sponsorModal));

    // Schimbare dinamică a textelor de sumă când se comută între Lunară și Unică
    if (freqRadios.length > 0) {
        freqRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const isMonthly = e.target.value === 'lunara';
                tierAmountTexts.forEach(txt => {
                    const baseAmount = txt.textContent.replace(/[^0-9]/g, '');
                    txt.textContent = isMonthly ? `${baseAmount} Lei/lună` : `${baseAmount} Lei (o dată)`;
                });
                if (submitDonationBtn) {
                    submitDonationBtn.innerHTML = isMonthly 
                        ? '<i class="fa-solid fa-heart"></i> Confirmă Donația Lunară' 
                        : '<i class="fa-solid fa-heart"></i> Confirmă Donația Unică';
                }
            });
        });
    }

    if (sponsorForm) {
        sponsorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const sponsorName = document.getElementById('sponsorName').value.trim();
            const petChosen = sponsorPetSelect ? sponsorPetSelect.value : 'Animalele din Sanctuar';
            const selectedTier = document.querySelector('input[name="donationAmount"]:checked');
            const amount = selectedTier ? selectedTier.value : '50';
            const selectedFreq = document.querySelector('input[name="donationFrequency"]:checked');
            const isMonthly = selectedFreq ? selectedFreq.value === 'lunara' : true;

            closeModal(sponsorModal);
            sponsorForm.reset();

            if (typeof launchConfetti === 'function') launchConfetti();
            if (isMonthly) {
                showToast(`🦁 Mulțumim, ${sponsorName}! Donația ta lunară recurentă de ${amount} Lei pentru ${petChosen} a fost confirmată. Certificatul oficial a fost trimis pe e-mail!`, 'success', 30000);
            } else {
                showToast(`🦁 Mulțumim din suflet, ${sponsorName}! Donația ta unică de ${amount} Lei pentru ${petChosen} a fost înregistrată. Ai primit certificatul oficial pe e-mail!`, 'success', 30000);
            }
        });
    }

    // ---------- 12. MODAL PROGRAMARE VETERINAR ----------
    if (openVetModalBtn) {
        openVetModalBtn.addEventListener('click', () => {
            if (vetAppointmentModal) {
                openModal(vetAppointmentModal);
            } else {
                window.location.href = 'veterinar.html#programare';
            }
        });
    }

    if (closeVetModalBtn) closeVetModalBtn.addEventListener('click', () => closeModal(vetAppointmentModal));
    if (cancelVetBtn) cancelVetBtn.addEventListener('click', () => closeModal(vetAppointmentModal));

    bookServiceBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = btn.dataset.service;
            if (serviceName && vetServiceChoice) {
                vetServiceChoice.value = serviceName;
            }
            const progSection = document.getElementById('programare');
            if (progSection) {
                progSection.scrollIntoView({ behavior: 'smooth' });
                const ownerInput = document.getElementById('vetOwnerName');
                if (ownerInput) {
                    setTimeout(() => ownerInput.focus(), 400);
                }
                progSection.classList.add('highlight-pulse');
                setTimeout(() => progSection.classList.remove('highlight-pulse'), 2500);
                showToast(`✅ Serviciu selectat: „${serviceName}”. Completează formularul de mai jos pentru programare!`, 'info', 5000);
            } else if (vetAppointmentModal) {
                openModal(vetAppointmentModal);
            } else {
                window.location.href = 'veterinar.html#programare';
            }
        });
    });

    const emergencyBtns = document.querySelectorAll('.btn-emergency');
    emergencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (navigator.clipboard) {
                navigator.clipboard.writeText('0722000999').catch(() => {});
            }
            showToast('📞 Numărul de urgențe 0722 000 999 a fost apelat / salvat în clipboard! Linie veterinară 24/7 activă.', 'success', 8000);
        });
    });

    if (vetAppointmentForm) {
        vetAppointmentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const owner = document.getElementById('vetOwnerName').value.trim();
            const pet = document.getElementById('vetPetName').value.trim();
            const service = document.getElementById('vetServiceChoice').value;
            const date = document.getElementById('vetPreferredDate').value;

            if (vetAppointmentModal) closeModal(vetAppointmentModal);
            vetAppointmentForm.reset();

            if (typeof launchConfetti === 'function') launchConfetti();
            showToast(`🩺 Programare confirmată! ${owner}, te așteptăm cu ${pet} pe data de ${date} pentru ${service}. Medicul specialist de gardă a fost notificat.`, 'success', 30000);
        });
    }

    // ---------- 13. MODAL DĂ SPRE ADOPȚIE ----------
    if (openAddModalBtn) {
        openAddModalBtn.addEventListener('click', () => {
            if (addPetModal) {
                const randomImages = [
                    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=700&q=80',
                    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=700&q=80'
                ];
                const randomImg = randomImages[Math.floor(Math.random() * randomImages.length)];
                const imgInput = document.getElementById('newPetImage');
                if (imgInput) imgInput.value = randomImg;

                openModal(addPetModal);
            } else {
                window.location.href = 'animale.html?action=add';
            }
        });
    }

    if (closeAddPetModalBtn) closeAddPetModalBtn.addEventListener('click', () => closeModal(addPetModal));
    if (cancelAddPetBtn) cancelAddPetBtn.addEventListener('click', () => closeModal(addPetModal));

    if (addPetForm) {
        addPetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('newPetName').value.trim();
            const species = document.getElementById('newPetSpecies').value;
            const breed = document.getElementById('newPetBreed') ? document.getElementById('newPetBreed').value.trim() : 'Metis';
            const location = document.getElementById('newPetLocation') ? document.getElementById('newPetLocation').value : 'București';
            const age = document.getElementById('newPetAge') ? document.getElementById('newPetAge').value.trim() : '1 an';
            const size = document.getElementById('newPetSize') ? document.getElementById('newPetSize').value : 'medie';
            const gender = document.getElementById('newPetGender') ? document.getElementById('newPetGender').value : 'mascul';
            const image = document.getElementById('newPetImage') ? document.getElementById('newPetImage').value.trim() : 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=700&q=80';
            const desc = document.getElementById('newPetDesc') ? document.getElementById('newPetDesc').value.trim() : 'Un animal minunat.';

            const isExotic = species === 'exotic';
            const randomCode = isExotic 
                ? `RO-SANC-${Math.floor(1000 + Math.random() * 9000)}` 
                : `RO-RECS-${Math.floor(1000 + Math.random() * 9000)}`;

            const newPet = {
                id: `pet-${Date.now()}`,
                registryCode: randomCode,
                name: name,
                species: (species === 'caine' || species === 'pisica' || species === 'ferma') ? species : 'altele',
                animalType: species,
                breed: breed,
                originType: isExotic ? "Sanctuar Salvare" : "Dăruit spre Adopție",
                age: age,
                ageMonths: 24,
                size: size,
                gender: gender,
                location: location,
                shelter: isExotic ? `Sanctuarul ${location}` : `Centrul de Adopție ${location}`,
                image: image,
                tags: ["Înregistrat Recent", breed, location],
                story: desc,
                vaccinated: true,
                sterilized: true,
                microchipped: true,
                urgent: false,
                status: isExotic ? "sanctuar" : "disponibil",
                dateAdded: new Date().toISOString().split('T')[0],
                isSanctuary: isExotic,
                sanctuaryName: isExotic ? `Sanctuar ${location}` : undefined
            };

            pets.unshift(newPet);
            savePets(pets);

            closeModal(addPetModal);
            addPetForm.reset();

            if (typeof launchConfetti === 'function') launchConfetti();
            showToast(`🐾 Mulțumim! ${name} a fost înregistrat cu succes pentru adopție (${randomCode}). Este acum vizibil în baza de date!`, 'success', 30000);

            if (petsGrid || dbTableContainer) {
                resetAllFilters();
                const targetSec = document.getElementById('catalog-section') || document.getElementById('sanctuar-animale');
                if (targetSec) targetSec.scrollIntoView({ behavior: 'smooth' });
            } else {
                renderHomePreview();
            }
        });
    }

    // Helpers modale
    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    [detailsModal, adoptModal, addPetModal, vetAppointmentModal, sponsorModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modal);
                }
            });
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(detailsModal);
            closeModal(adoptModal);
            closeModal(addPetModal);
            closeModal(vetAppointmentModal);
            closeModal(sponsorModal);
        }
    });

    // ---------- 14. FAQ ACCORDION ----------
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---------- 15. FORMULAR CONTACT ----------
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cName').value.trim();
            contactForm.reset();
            if (typeof launchConfetti === 'function') launchConfetti();
            showToast(`✉️ Mulțumim, ${name}! Mesajul tău a fost transmis cu succes echipei noastre. Îți vom răspunde în cel mai scurt timp posibil.`, 'success', 30000);
        });
    }

    // ---------- 16. MENIU MOBIL RESPONSIV ----------
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const isOpen = navLinks.classList.contains('open');
            mobileMenuBtn.innerHTML = isOpen 
                ? '<i class="fa-solid fa-xmark"></i>' 
                : '<i class="fa-solid fa-bars"></i>';
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileMenuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            });
        });
    }

    // ---------- 17. NOTIFICĂRI TOAST (RĂMÂN PE ECRAN 30 DE SECUNDE) ----------
    function showToast(message, type = 'success', duration = 30000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast ${type === 'error' ? 'toast-error' : ''}`;
        
        const icon = type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check';
        toast.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:0.85rem; width:100%;">
                <i class="fa-solid ${icon}" style="font-size:1.35rem; margin-top:0.15rem; color:${type === 'error' ? '#ef4444' : '#10b981'};"></i>
                <div style="flex:1;">
                    <div style="font-weight:600; font-size:0.95rem; line-height:1.45; color:var(--dark);">${escapeHTML(message)}</div>
                    <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; display:flex; align-items:center; gap:0.4rem;">
                        <i class="fa-regular fa-clock"></i> Notificarea rămâne pe ecran 30 de secunde (sau apasă ✕)
                    </div>
                </div>
                <button class="toast-close-btn" style="background:none; border:none; color:var(--text-muted); cursor:pointer; font-size:1.3rem; line-height:1; padding:0 0.25rem;" title="Închide">&times;</button>
            </div>
        `;

        const closeBtn = toast.querySelector('.toast-close-btn');
        let timer = null;

        const dismissToast = () => {
            if (timer) clearTimeout(timer);
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.35s ease';
            setTimeout(() => toast.remove(), 350);
        };

        if (closeBtn) closeBtn.addEventListener('click', dismissToast);

        container.appendChild(toast);
        timer = setTimeout(dismissToast, duration);
    }

    // ---------- 18. INIȚIALIZARE & PARAMETRI URL LA PORNIRE ----------
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'add') {
        if (addPetModal) openModal(addPetModal);
    }
    if (urlParams.get('filter') === 'favorites') {
        filters.onlyFavorites = true;
        if (activeFilterBadge) activeFilterBadge.style.display = 'inline-flex';
    }
    if (urlParams.get('type')) {
        const t = urlParams.get('type');
        filters.animalType = t;
        if (animalTypeFilter) animalTypeFilter.value = t;
        if (speciesPills.length > 0) {
            speciesPills.forEach(p => p.classList.toggle('active', (p.dataset.type || p.dataset.species) === t));
        }
    }

    updateFavoriteBadge();
    renderPets();
    renderHomePreview();

    // ---------- 19. ANIMAȚII, EFECTE & MICRO-INTERACȚIUNI MODERNE ----------

    // A. Sticky Navbar Scroll Elevation
    const navbarWrapper = document.querySelector('.navbar-wrapper');
    if (navbarWrapper) {
        const handleNavScroll = () => {
            if (window.scrollY > 30) {
                navbarWrapper.classList.add('navbar-scrolled');
            } else {
                navbarWrapper.classList.remove('navbar-scrolled');
            }
        };
        window.addEventListener('scroll', handleNavScroll, { passive: true });
        handleNavScroll();
    }

    // B. Buton Plutitor "Înapoi Sus" (Back to Top)
    let backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) {
        backToTopBtn = document.createElement('button');
        backToTopBtn.id = 'backToTopBtn';
        backToTopBtn.className = 'back-to-top-btn';
        backToTopBtn.setAttribute('aria-label', 'Înapoi sus');
        backToTopBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 320) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // C. Scroll-Reveal cu IntersectionObserver & Efecte Cascade
    function initScrollReveal() {
        if (!('IntersectionObserver' in window)) return;

        const revealTargets = document.querySelectorAll(
            '.section-header, .hub-card, .vet-card, .vet-member-card, .step-card, ' +
            '.contact-card, .contact-info, .faq-item, .stat-card, .mission-item, ' +
            '#programare, .rule-card, .donation-tier-box, .stat-number'
        );

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        });

        revealTargets.forEach(el => {
            if (!el.classList.contains('reveal-on-scroll')) {
                el.classList.add('reveal-on-scroll');
            }
            observer.observe(el);
        });
    }

    // D. Numărători Animate pentru Statistici (Count-Up)
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        if (!counters.length || !('IntersectionObserver' in window)) return;

        const counterObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                obs.unobserve(el);

                const originalText = el.textContent.trim();
                const match = originalText.match(/^([^\d]*)(\d+)([^\d]*)$/);
                if (!match) return;

                const prefix = match[1] || '';
                const targetNum = parseInt(match[2], 10);
                const suffix = match[3] || '';

                const duration = 1400; // ms
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const easeOut = 1 - Math.pow(1 - progress, 3);
                    const currentVal = Math.floor(easeOut * targetNum);

                    el.textContent = `${prefix}${currentVal}${suffix}`;

                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = originalText;
                    }
                }

                requestAnimationFrame(updateCounter);
            });
        }, { threshold: 0.3 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // E. Confetti & Sparkles Celebration
    function launchConfetti() {
        let canvas = document.getElementById('confettiCanvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'confettiCanvas';
            document.body.appendChild(canvas);
        }

        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);

        const colors = ['#10b981', '#059669', '#f59e0b', '#fbbf24', '#ec4899', '#3b82f6', '#14b8a6'];
        const particles = [];
        const count = 75;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: window.innerWidth * (0.2 + Math.random() * 0.6),
                y: window.innerHeight * 0.35 + (Math.random() * 100 - 50),
                vx: (Math.random() - 0.5) * 14,
                vy: -(Math.random() * 10 + 6),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: Math.random() * 8 + 5,
                shape: Math.random() > 0.4 ? 'rect' : 'circle',
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 12,
                opacity: 1,
                decay: 0.008 + Math.random() * 0.008
            });
        }

        let animationFrameId;
        const render = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            let alive = false;

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.32;
                p.vx *= 0.98;
                p.rotation += p.rotationSpeed;
                p.opacity -= p.decay;

                if (p.opacity > 0) {
                    alive = true;
                    ctx.save();
                    ctx.globalAlpha = Math.max(p.opacity, 0);
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rotation * Math.PI) / 180);
                    ctx.fillStyle = p.color;

                    if (p.shape === 'rect') {
                        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
                    } else {
                        ctx.beginPath();
                        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                        ctx.fill();
                    }
                    ctx.restore();
                }
            });

            if (alive) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                cancelAnimationFrame(animationFrameId);
                canvas.remove();
            }
        };

        animationFrameId = requestAnimationFrame(render);
    }

    // F. Carusel Hero (Index.html)
    function initHeroCarousel() {
        const heroCarousel = document.getElementById('heroCarousel');
        if (!heroCarousel) return;

        const slides = heroCarousel.querySelectorAll('.carousel-slide');
        const prevBtn = document.getElementById('carouselPrevBtn');
        const nextBtn = document.getElementById('carouselNextBtn');
        const dotsContainer = document.getElementById('carouselDots');
        let currentIndex = 0;
        let slideInterval = null;
        const totalSlides = slides.length;

        if (totalSlides === 0) return;

        // Creează punctele indicatoare
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
                dot.setAttribute('aria-label', `Sari la diapozitivul ${idx + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(idx);
                    resetAutoplay();
                });
                dotsContainer.appendChild(dot);
            });
        }

        const dots = dotsContainer ? dotsContainer.querySelectorAll('.carousel-dot') : [];

        function goToSlide(index) {
            slides[currentIndex].classList.remove('active');
            if (dots[currentIndex]) dots[currentIndex].classList.remove('active');

            currentIndex = (index + totalSlides) % totalSlides;

            slides[currentIndex].classList.add('active');
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoplay();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoplay();
            });
        }

        function startAutoplay() {
            slideInterval = setInterval(nextSlide, 4500);
        }

        function resetAutoplay() {
            if (slideInterval) clearInterval(slideInterval);
            startAutoplay();
        }

        // Pauză la hover
        heroCarousel.addEventListener('mouseenter', () => {
            if (slideInterval) clearInterval(slideInterval);
        });
        heroCarousel.addEventListener('mouseleave', startAutoplay);

        // Suport swipe touch pe ecrane mobile
        let touchStartX = 0;
        let touchEndX = 0;
        heroCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 45) {
                nextSlide();
                resetAutoplay();
            } else if (touchEndX - touchStartX > 45) {
                prevSlide();
                resetAutoplay();
            }
        }, { passive: true });

        startAutoplay();
    }

    // G. Inițializare declanșatoare
    initHeroCarousel();
    initScrollReveal();
    initCounterAnimation();
});
