<script lang="ts">
  import { resolve } from '$app/paths';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import * as Sheet from '$lib/components/ui/sheet/index.js';
  import { goto } from '$app/navigation';

  type Recipe = {
    id: number;
    name: string;
    time: string;
    price: string;
    color: string;
  };

  const recommendedRecipes: Recipe[] = [
    { id: 1, name: 'Kuřecí nudličky s rýží', time: '30 min', price: '100 Kč/porce', color: '#c9a98a' },
    { id: 2, name: 'Těstovinový salát', time: '20 min', price: '80 Kč/porce', color: '#a8bfa8' },
    { id: 3, name: 'Svíčková na smetaně', time: '90 min', price: '150 Kč/porce', color: '#b8a0c8' },
    { id: 4, name: 'Smažený řízek', time: '40 min', price: '120 Kč/porce', color: '#d4a574' },
  ];

  const budgetRecipes: Recipe[] = [
    { id: 5, name: 'Čočková polévka', time: '25 min', price: '40 Kč/porce', color: '#c8b870' },
    { id: 6, name: 'Bramborová kaše', time: '20 min', price: '35 Kč/porce', color: '#8ab0c0' },
    { id: 7, name: 'Fazolový guláš', time: '45 min', price: '50 Kč/porce', color: '#c87860' },
    { id: 8, name: 'Zeleninová polévka', time: '30 min', price: '45 Kč/porce', color: '#90b890' },
  ];

  let selectedRecipe: Recipe | null = $state(null);
  let sheetOpen = $state(false);

  function openRecipe(recipe: Recipe) {
    selectedRecipe = recipe;
    sheetOpen = true;
  }
</script>

<div class="app">
  <header>
    <a href={resolve('/')} class="logo">Pipa</a>

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
          <a href={resolve('/')}>Domů</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href={resolve('/')}>Recepty</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href={resolve('/')}>Nastavení</a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </header>

  <main>
    <section class="hero">
      <h1>Ahoj! Co si<br />dnes uvaříme?</h1>
    </section>

    <!-- Recommended recipes -->
    <section class="recipe-section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8603a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
          <h2>Doporučené recepty</h2>
        </div>
        <Button variant="link" class="show-all-btn">Zobrazit vše</Button>
      </div>
      <div class="card-scroll">
        {#each recommendedRecipes as recipe}
          <Card.Root class="recipe-card">
            <div class="card-image" style="background-color: {recipe.color}"></div>
            <Card.Content class="card-body">
              <Card.Title class="card-title">{recipe.name}</Card.Title>
              <p class="card-meta">{recipe.time} <span class="dot">•</span> {recipe.price}</p>
              <Button class="cta-btn" onclick={() => openRecipe(recipe)}>Zobrazit více</Button>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </section>

    <!-- Jídlo za lepší cenu -->
    <section class="recipe-section">
      <div class="section-header">
        <div class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8603a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"/><path d="M15 6h1v4"/><path d="m6.134 14.768.866-.5 2 3.464"/><circle cx="16" cy="8" r="6"/></svg>
          <h2>Jídlo za lepší cenu</h2>
        </div>
        <Button variant="link" class="show-all-btn">Zobrazit vše</Button>
      </div>
      <div class="card-scroll">
        {#each budgetRecipes as recipe}
          <Card.Root class="recipe-card">
            <div class="card-image" style="background-color: {recipe.color}"></div>
            <Card.Content class="card-body">
              <Card.Title class="card-title">{recipe.name}</Card.Title>
              <p class="card-meta">{recipe.time} <span class="dot">•</span> {recipe.price}</p>
              <Button class="cta-btn" onclick={() => openRecipe(recipe)}>Zobrazit více</Button>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </section>
  </main>
</div>

<!-- Recipe Sheet -->
<Sheet.Root bind:open={sheetOpen}>
  <Sheet.Content side="bottom" class="recipe-sheet">
    {#if selectedRecipe}
      <div class="sheet-image" style="background-color: {selectedRecipe.color}"></div>
      <Sheet.Header class="sheet-header">
        <Sheet.Title class="sheet-title">{selectedRecipe.name}</Sheet.Title>
        <p class="sheet-meta">{selectedRecipe.time} <span class="dot">•</span> {selectedRecipe.price}</p>
      </Sheet.Header>
      <div class="sheet-body">
        <p class="sheet-section-label">Ingredience:</p>
        <ul class="sheet-ingredients">
          <li>seznam</li>
          <li>seznam</li>
        </ul>
        <Button onclick={() => goto('/voice')} class="sheet-cta">Pojďme na to</Button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Lato:wght@400;700&display=swap');

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    background: #f5f0eb;
    font-family: 'Lato', sans-serif;
    color: #1a1a1a;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    background: #ffffff;
    min-height: 100vh;
    position: relative;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    background: #ffffff;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo {
    font-family: 'Caveat', cursive;
    font-size: 1.75rem;
    font-weight: 600;
    color: #1a1a1a;
    text-decoration: none;
  }

  /* Dropdown overrides */
  :global(.nav-dropdown) {
    font-family: 'Lato', sans-serif !important;
    border-radius: 12px !important;
    border: 1px solid #e8e2dc !important;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1) !important;
    padding: 8px 0 !important;
    min-width: 180px !important;
    background: #ffffff !important;
    z-index: 100;
  }

  :global(.nav-dropdown a) {
    display: block;
    padding: 12px 20px;
    text-decoration: none;
    color: #1a1a1a;
    font-size: 0.95rem;
    font-weight: 500;
    width: 100%;
  }

  :global(.nav-dropdown [data-highlighted] a),
  :global(.nav-dropdown [data-highlighted]) {
    background: #f8f4f0 !important;
    color: #1a1a1a !important;
  }

  /* Hero */
  .hero { padding: 28px 20px 20px; }

  .hero h1 {
    font-size: 2.1rem;
    font-weight: 700;
    line-height: 1.25;
  }

  /* Sections */
  .recipe-section {
    margin-top: 24px;
    position: relative;
  }

  .recipe-section::after {
    content: '';
    position: absolute;
    top: 44px;
    right: 0;
    width: 24px;
    height: calc(100% - 44px);
    background: linear-gradient(to right, transparent, #ffffff);
    pointer-events: none;
    z-index: 1;
  }

  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 14px;
  }

  .section-title {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title h2 { font-size: 1.05rem; font-weight: 700; }

  :global(.show-all-btn) {
    color: #c8603a !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    padding: 0 !important;
    height: auto !important;
    text-decoration: underline !important;
    text-underline-offset: 2px !important;
    font-family: 'Lato', sans-serif !important;
  }

  .card-scroll {
    display: flex;
    gap: 14px;
    overflow-x: auto;
    padding: 4px 20px 16px;
    margin-left: 20px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .card-scroll::-webkit-scrollbar { display: none; }

  :global(.recipe-card) {
    flex: 0 0 230px !important;
    scroll-snap-align: start;
    border-radius: 14px !important;
    border: 1px solid #f0ece8 !important;
    overflow: hidden;
    transition: transform 0.18s, box-shadow 0.18s !important;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
    background: #ffffff !important;
    padding: 0 !important;
  }

  .card-image {
    width: 100%;
    height: 140px;
  }

  :global(.card-body) {
    padding: 14px 14px 16px !important;
  }

  :global(.card-title) {
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    margin-bottom: 6px !important;
    line-height: 1.3 !important;
  }

  .card-meta {
    font-size: 0.82rem;
    color: #666;
    margin-bottom: 12px;
  }

  .dot { margin: 0 4px; }

  :global(.cta-btn) {
    background: #c8603a !important;
    color: #ffffff !important;
    border-radius: 8px !important;
    padding: 9px 18px !important;
    font-size: 0.88rem !important;
    font-weight: 700 !important;
    font-family: 'Lato', sans-serif !important;
    height: auto !important;
  }

  /* Sheet overrides */
  :global(.recipe-sheet) {
    border-radius: 20px 20px 0 0 !important;
    padding: 0 !important;
    max-height: 60vh !important;
    overflow-y: auto !important;
    font-family: 'Lato', sans-serif !important;
  }

  /* Tmavé pozadí místo rozmazaného */
  :global([data-vaul-overlay]),
  :global([data-radix-dialog-overlay]) {
    background: rgba(0, 0, 0, 0.4) !important;
    backdrop-filter: none !important;
  }

  /* Odstraní křížek */
  :global(.recipe-sheet > button:first-of-type) {
    display: none !important;
  }

  .sheet-image {
    width: calc(100% - 32px);
    height: 180px;
    border-radius: 16px;
    margin: 16px 16px 0;
  }

  :global(.sheet-header) {
    padding: 16px 20px 0 !important;
  }

  :global(.sheet-title) {
    font-size: 1.2rem !important;
    font-weight: 700 !important;
    color: #1a1a1a !important;
    font-family: 'Lato', sans-serif !important;
  }

  .sheet-meta {
    font-size: 0.85rem;
    color: #666;
    margin-top: 4px;
  }

  .sheet-body {
    padding: 16px 20px 24px;
  }

  .sheet-section-label {
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: #1a1a1a;
  }

  .sheet-ingredients {
    list-style: disc;
    padding-left: 20px;
    font-size: 0.9rem;
    color: #444;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  :global(.sheet-cta) {
    width: 100% !important;
    background: #c8603a !important;
    color: #ffffff !important;
    border-radius: 10px !important;
    font-size: 0.95rem !important;
    font-weight: 700 !important;
    font-family: 'Lato', sans-serif !important;
    height: 48px !important;
  }
</style>