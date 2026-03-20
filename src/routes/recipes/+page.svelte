<script lang="ts">
  import { resolve } from '$app/paths';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import { goto } from '$app/navigation';

  type Category = 'Vše' | 'Polévky' | 'Hlavní jídla' | 'Saláty' | 'Dezerty' | 'Rychlé';

  type Recipe = {
    id: number;
    name: string;
    time: string;
    price: string;
    color: string;
    category: Exclude<Category, 'Vše'>;
    difficulty: 'Lehké' | 'Střední' | 'Těžké';
    description: string;
    ingredients: string[];
    country: string;
  };

  const allRecipes: Recipe[] = [
    { id: 1,  name: 'Kuřecí nudličky s rýží',  time: '30 min', price: '100 Kč', color: '#c9a98a', category: 'Hlavní jídla', difficulty: 'Lehké',   description: 'Jemné kuřecí nudličky opečené na oleji, podávané s vařenou rýží a čerstvou zeleninou.', ingredients: ['Kuřecí prsa 300 g', 'Rýže 200 g', 'Olej 2 lžíce', 'Sůl, pepř'], country: '🇨🇿 Česká republika' },
    { id: 2,  name: 'Těstovinový salát',        time: '20 min', price: '80 Kč',  color: '#a8bfa8', category: 'Saláty',       difficulty: 'Lehké',   description: 'Studený salát z vaječných těstovin, zeleniny a majonézy. Ideální na léto.', ingredients: ['Těstoviny 250 g', 'Kukuřice', 'Hrášek', 'Majonéza 3 lžíce'], country: '🇮🇹 Itálie' },
    { id: 3,  name: 'Svíčková na smetaně',      time: '90 min', price: '150 Kč', color: '#b8a0c8', category: 'Hlavní jídla', difficulty: 'Těžké',   description: 'Tradiční české jídlo — hovězí svíčková ve smetanové omáčce s knedlíky a brusinkami.', ingredients: ['Hovězí svíčková 500 g', 'Mrkev', 'Celer', 'Smetana 200 ml', 'Houskový knedlík'], country: '🇨🇿 Česká republika' },
    { id: 4,  name: 'Smažený řízek',            time: '40 min', price: '120 Kč', color: '#d4a574', category: 'Hlavní jídla', difficulty: 'Střední', description: 'Klasický vídeňský řízek z vepřové kotlety, obalený ve strouhance a smažený dozlatova.', ingredients: ['Vepřová kotleta 400 g', 'Vejce 2 ks', 'Strouhanka', 'Olej na smažení'], country: '🇦🇹 Rakousko' },
    { id: 5,  name: 'Čočková polévka',          time: '25 min', price: '40 Kč',  color: '#c8b870', category: 'Polévky',      difficulty: 'Lehké',   description: 'Sytá polévka z červené čočky s kmínem, česnekem a kapkou citronu.', ingredients: ['Červená čočka 200 g', 'Cibule', 'Česnek', 'Kmín', 'Citron'], country: '🇮🇳 Indie' },
    { id: 6,  name: 'Bramborová kaše',          time: '20 min', price: '35 Kč',  color: '#8ab0c0', category: 'Hlavní jídla', difficulty: 'Lehké',   description: 'Krémová bramborová kaše s máslem a mlékem. Dokonalá příloha ke každému jídlu.', ingredients: ['Brambory 600 g', 'Máslo 50 g', 'Mléko 100 ml', 'Sůl, muškátový oříšek'], country: '🇨🇿 Česká republika' },
    { id: 7,  name: 'Fazolový guláš',           time: '45 min', price: '50 Kč',  color: '#c87860', category: 'Hlavní jídla', difficulty: 'Střední', description: 'Vydatný vegetariánský guláš z červených fazolí, paprik a rajčat s kouřovou paprikou.', ingredients: ['Červené fazole 400 g', 'Paprika 2 ks', 'Rajčatový protlak', 'Uzená paprika'], country: '🇲🇽 Mexiko' },
    { id: 8,  name: 'Zeleninová polévka',       time: '30 min', price: '45 Kč',  color: '#90b890', category: 'Polévky',      difficulty: 'Lehké',   description: 'Lehká a výživná polévka plná sezónní zeleniny, bylinek a dobrého vývaru.', ingredients: ['Mrkev', 'Celer', 'Petržel', 'Hrášek', 'Zeleninový vývar 1 l'], country: '🇫🇷 Francie' },
    { id: 9,  name: 'Pad Thai',                 time: '25 min', price: '90 Kč',  color: '#d4b896', category: 'Hlavní jídla', difficulty: 'Střední', description: 'Thajské smažené nudličky s krevetami, klíčky fazolí a arašídovou omáčkou.', ingredients: ['Rýžové nudličky 200 g', 'Krevety 150 g', 'Klíčky', 'Vejce 2 ks', 'Rybí omáčka'], country: '🇹🇭 Thajsko' },
    { id: 10, name: 'Tiramisu',                 time: '20 min', price: '70 Kč',  color: '#c8b4a0', category: 'Dezerty',      difficulty: 'Střední', description: 'Klasický italský dezert z mascarpone, piškotů namočených v kávě a kakaem.', ingredients: ['Mascarpone 250 g', 'Piškoty 200 g', 'Espresso 150 ml', 'Kakao', 'Vejce 3 ks'], country: '🇮🇹 Itálie' },
    { id: 11, name: 'Hummus',                   time: '10 min', price: '30 Kč',  color: '#d4c890', category: 'Rychlé',       difficulty: 'Lehké',   description: 'Hladký krémový hummus z cizrny, tahini a citronu. Perfektní dip k pita chlebu.', ingredients: ['Cizrna 400 g', 'Tahini 2 lžíce', 'Citron', 'Česnek', 'Olivový olej'], country: '🇮🇱 Izrael' },
    { id: 12, name: 'Avokádový toast',          time: '10 min', price: '60 Kč',  color: '#a0c890', category: 'Rychlé',       difficulty: 'Lehké',   description: 'Opečený chléb s rozetřeným avokádem, vejcem a vločkami červené papriky.', ingredients: ['Chléb 2 plátky', 'Avokádo 1 ks', 'Vejce', 'Citronová šťáva', 'Sůl, pepř'], country: '🇺🇸 USA' },
  ];

  const categories: Category[] = ['Vše', 'Polévky', 'Hlavní jídla', 'Saláty', 'Dezerty', 'Rychlé'];

  let activeCategory = $state<Category>('Vše');
  let searchQuery = $state('');
  let selectedRecipe = $state<Recipe | null>(null);
  let sheetOpen = $state(false);

  let filteredRecipes = $derived(
    allRecipes.filter((r) => {
      const matchesCategory = activeCategory === 'Vše' || r.category === activeCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q) || r.country.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    })
  );

  function openRecipe(recipe: Recipe) {
    selectedRecipe = recipe;
    sheetOpen = true;
  }

  const difficultyColor: Record<Recipe['difficulty'], string> = {
    Lehké: 'badge-easy',
    Střední: 'badge-medium',
    Těžké: 'badge-hard',
  };
</script>

<div class="mx-auto max-w-[480px] min-h-screen bg-background relative">

  <!-- Navbar (same as home) -->
  <header class="flex items-center justify-between px-5 py-[18px] bg-background sticky top-0 z-[100] border-b border-border">
    <a href={resolve('/')} class="font-['Caveat'] text-[1.75rem] font-semibold text-foreground no-underline">Pipa</a>

    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props }: { props: Record<string, unknown> })}
          <Button variant="ghost" size="icon" {...props} aria-label="Menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>
            </svg>
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" sideOffset={8} class="nav-dropdown">
        <DropdownMenu.Item>
          <a href={resolve('/demo')}>Domů</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href={resolve('/recipes')}>Recepty</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href={resolve('/')}>Nastavení</a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </header>

  <main class="pb-10">

    <!-- Page title + search -->
    <section class="px-5 pt-7 pb-4">
      <h1 class="text-[2.1rem] font-bold leading-[1.1] tracking-tight text-foreground">Recepty</h1>
      <p class="text-[0.88rem] text-muted-foreground mt-1">{allRecipes.length} receptů celkem</p>

      <!-- Search -->
      <div class="search-wrap mt-4">
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="search"
          placeholder="Hledat recept nebo zemi…"
          bind:value={searchQuery}
          class="search-input"
        />
      </div>
    </section>

    <!-- Category filters -->
    <div class="filter-scroll">
      {#each categories as cat}
        <button
          onclick={() => activeCategory = cat}
          class="filter-chip {activeCategory === cat ? 'active' : ''}"
        >
          {cat}
        </button>
      {/each}
    </div>

    <!-- Results count -->
    <div class="px-5 pt-4 pb-2">
      <span class="text-[0.78rem] font-semibold text-muted-foreground uppercase tracking-wider">
        {filteredRecipes.length} {filteredRecipes.length === 1 ? 'výsledek' : filteredRecipes.length >= 2 && filteredRecipes.length <= 4 ? 'výsledky' : 'výsledků'}
      </span>
    </div>

    <!-- Recipe grid -->
    {#if filteredRecipes.length > 0}
      <div class="recipe-grid">
        {#each filteredRecipes as recipe}
          <button
            class="recipe-tile"
            onclick={() => openRecipe(recipe)}
          >
            <div class="recipe-tile-image" style="background-color: {recipe.color}">
              <span class="recipe-tile-country">{recipe.country.split(' ')[0]}</span>
            </div>
            <div class="recipe-tile-body">
              <div class="flex items-start justify-between gap-2">
                <h3 class="recipe-tile-name">{recipe.name}</h3>
                <span class="badge {difficultyColor[recipe.difficulty]}">{recipe.difficulty}</span>
              </div>
              <p class="recipe-tile-meta">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                {recipe.time}
                <span class="mx-1 opacity-40">•</span>
                {recipe.price}/porce
              </p>
            </div>
          </button>
        {/each}
      </div>
    {:else}
      <div class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
        <p class="empty-text">Žádné recepty nenalezeny</p>
        <button onclick={() => { searchQuery = ''; activeCategory = 'Vše'; }} class="empty-reset">
          Zobrazit vše
        </button>
      </div>
    {/if}

  </main>
</div>

<!-- Recipe detail sheet -->
<Sheet.Root bind:open={sheetOpen}>
  <Sheet.Content side="bottom" class="recipe-sheet">
    {#if selectedRecipe}
      <div class="sheet-image-wrap">
        <div class="sheet-image" style="background-color: {selectedRecipe.color}">
          <span class="sheet-flag">{selectedRecipe.country.split(' ')[0]}</span>
        </div>
      </div>
      <Sheet.Header class="px-5 pt-4">
        <div class="flex items-start justify-between gap-3">
          <Sheet.Title class="text-[1.25rem] font-bold text-foreground leading-snug">{selectedRecipe.name}</Sheet.Title>
          <span class="badge {difficultyColor[selectedRecipe.difficulty]} flex-shrink-0 mt-[3px]">{selectedRecipe.difficulty}</span>
        </div>
        <div class="flex items-center gap-3 mt-1">
          <span class="text-[0.82rem] text-muted-foreground flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {selectedRecipe.time}
          </span>
          <span class="text-muted-foreground opacity-40 text-xs">•</span>
          <span class="text-[0.82rem] text-muted-foreground">{selectedRecipe.price}/porce</span>
          <span class="text-muted-foreground opacity-40 text-xs">•</span>
          <span class="text-[0.82rem] text-muted-foreground">{selectedRecipe.country}</span>
        </div>
      </Sheet.Header>
      <div class="px-5 pt-4 pb-6">
        <p class="text-[0.88rem] leading-relaxed text-secondary-foreground mb-5">{selectedRecipe.description}</p>

        <p class="text-[0.9rem] font-bold mb-2 text-foreground">Ingredience:</p>
        <ul class="mb-6 flex flex-col gap-2">
          {#each selectedRecipe.ingredients as ing}
            <li class="flex items-center gap-2 text-[0.88rem] text-secondary-foreground">
              <span class="ing-dot"></span>
              {ing}
            </li>
          {/each}
        </ul>

        <Button onclick={() => goto('/voice')} class="sheet-cta">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          Pojďme vařit!
        </Button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');

  /* ── Search ── */
  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search-icon {
    position: absolute;
    left: 12px;
    color: var(--muted-foreground);
    pointer-events: none;
  }
  .search-input {
    width: 100%;
    height: 42px;
    padding: 0 14px 0 36px;
    border-radius: var(--radius-xl);
    border: 1px solid var(--border);
    background: var(--secondary);
    color: var(--foreground);
    font-family: var(--font-sans);
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.15s;
  }
  .search-input:focus {
    border-color: var(--primary);
    background: var(--background);
  }
  .search-input::placeholder {
    color: var(--muted-foreground);
  }

  /* ── Filter chips ── */
  .filter-scroll {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding: 0 20px;
    scrollbar-width: none;
  }
  .filter-scroll::-webkit-scrollbar { display: none; }

  .filter-chip {
    flex-shrink: 0;
    padding: 6px 14px;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--muted-foreground);
    font-family: var(--font-sans);
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
    white-space: nowrap;
  }
  .filter-chip.active {
    background: var(--primary);
    color: var(--primary-foreground);
    border-color: var(--primary);
  }
  .filter-chip:not(.active):hover {
    border-color: var(--primary);
    color: var(--primary);
  }

  /* ── Recipe grid ── */
  .recipe-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0 20px;
  }

  .recipe-tile {
    display: flex;
    align-items: stretch;
    gap: 0;
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: var(--radius-xl);
    overflow: hidden;
    margin-bottom: 12px;
    cursor: pointer;
    text-align: left;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .recipe-tile:hover {
    border-color: var(--primary);
    box-shadow: 0 2px 16px oklch(0 0 0 / 0.08);
  }
  .recipe-tile-image {
    width: 88px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 6px;
  }
  .recipe-tile-country {
    font-size: 1.4rem;
    line-height: 1;
  }
  .recipe-tile-body {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
  }
  .recipe-tile-name {
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--foreground);
    line-height: 1.3;
  }
  .recipe-tile-meta {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 0.78rem;
    color: var(--muted-foreground);
  }

  /* ── Difficulty badges ── */
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .badge-easy   { background: oklch(0.93 0.05 150); color: oklch(0.35 0.12 150); }
  .badge-medium { background: oklch(0.95 0.06 60);  color: oklch(0.45 0.15 60);  }
  .badge-hard   { background: oklch(0.93 0.06 27);  color: oklch(0.45 0.18 27);  }

  /* ── Empty state ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 20px;
    gap: 12px;
  }
  .empty-icon { color: var(--muted-foreground); opacity: 0.4; }
  .empty-text { font-size: 0.95rem; color: var(--muted-foreground); font-weight: 500; }
  .empty-reset {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--primary);
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  /* ── Sheet ── */
  .sheet-image-wrap {
    padding: 16px 16px 0;
  }
  .sheet-image {
    width: 100%;
    height: 160px;
    border-radius: var(--radius-xl);
    position: relative;
    display: flex;
    align-items: flex-end;
    padding: 10px 12px;
  }
  .sheet-flag {
    font-size: 2rem;
    line-height: 1;
  }
  .ing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
    flex-shrink: 0;
  }

  :global(.recipe-sheet) {
    border-radius: var(--radius-3xl) var(--radius-3xl) 0 0 !important;
    padding: 0 !important;
    max-height: 80vh !important;
    overflow-y: auto !important;
    background: var(--background) !important;
  }
  :global([data-vaul-overlay]),
  :global([data-radix-dialog-overlay]) {
    background: oklch(0 0 0 / 0.4) !important;
    backdrop-filter: none !important;
  }
  :global(.recipe-sheet > button:first-of-type) {
    display: none !important;
  }
  :global(.sheet-cta) {
    width: 100% !important;
    background: var(--primary) !important;
    color: var(--primary-foreground) !important;
    border-radius: var(--radius-xl) !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    height: 48px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }

  /* Dropdown */
  :global(.nav-dropdown) {
    border-radius: var(--radius-xl) !important;
    border: 1px solid var(--border) !important;
    box-shadow: 0 8px 24px oklch(0 0 0 / 0.1) !important;
    padding: 8px 0 !important;
    min-width: 180px !important;
    background: var(--background) !important;
    z-index: 100;
  }
  :global(.nav-dropdown a) {
    display: block;
    padding: 12px 20px;
    text-decoration: none;
    color: var(--foreground);
    font-size: 0.95rem;
    font-weight: 500;
    width: 100%;
  }
  :global(.nav-dropdown [data-highlighted]) {
    background: var(--secondary) !important;
    color: var(--secondary-foreground) !important;
  }
</style>