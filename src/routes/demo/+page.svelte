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

  // ── User level — wire up to your backend here ─────────────────────────
  type UserLevel = { level: number; xp: number; xpMax: number };

  // Default mock shown instantly; replaced by real data on load
  let userLevel = $state<UserLevel>({ level: 8, xp: 90, xpMax: 195 });

  $effect(() => {
    fetch('/api/user/level')            // ← replace with your endpoint
      .then((r) => r.json())
      .then((data: UserLevel) => { userLevel = data; })
      .catch(() => { /* keep mock values on error */ });
  });
  // ─────────────────────────────────────────────────────────────────────

  function openRecipe(recipe: Recipe) {
    selectedRecipe = recipe;
    sheetOpen = true;
  }

  let xpPercent = $derived(Math.min((userLevel.xp / userLevel.xpMax) * 100, 100));
</script>

<div class="mx-auto max-w-[480px] min-h-screen bg-background relative">

  <header class="flex items-center justify-between px-5 py-[18px] bg-background sticky top-0 z-[100] border-b border-border">
    <a href={resolve('/')} class="font-['Caveat'] text-[1.75rem] font-semibold text-foreground no-underline">Papi</a>

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
          <a href={resolve('/recipes')}>Recepty</a>
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <a href={resolve('/')}>Nastavení</a>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </header>

  <main>
    <section class="px-5 pt-7 pb-6">
      <h1 class="text-[2.1rem] font-bold leading-[1.25] text-foreground">Ahoj! Co si<br />dnes uvaříme?</h1>

      <!-- Level progress bar -->
      <div class="mt-5">
        <div class="flex items-center justify-between mb-[7px]">
          <span class="text-[0.95rem] font-bold text-foreground">Úroveň {userLevel.level}</span>
          <span class="text-[0.82rem] font-semibold text-muted-foreground">{userLevel.xp}/{userLevel.xpMax}</span>
        </div>
        <div class="level-bar-track">
          <div class="level-bar-fill" style="width: {xpPercent}%"></div>
        </div>
      </div>
    </section>

    <!-- Recommended recipes -->
    <section class="mt-2 relative recipe-section">
      <div class="flex items-center justify-between px-5 pb-[14px]">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
          <h2 class="text-[1.05rem] font-bold text-foreground">Doporučené recepty</h2>
        </div>
        <Button variant="link" class="show-all-btn">Zobrazit vše</Button>
      </div>
      <div class="card-scroll">
        {#each recommendedRecipes as recipe}
          <Card.Root class="recipe-card">
            <div class="h-[140px] w-full" style="background-color: {recipe.color}"></div>
            <Card.Content class="p-[14px]">
              <Card.Title class="text-[0.95rem] font-bold mb-[6px] leading-[1.3]">{recipe.name}</Card.Title>
              <p class="text-[0.82rem] text-muted-foreground mb-3">{recipe.time} <span class="mx-1">•</span> {recipe.price}</p>
              <Button class="cta-btn" onclick={() => openRecipe(recipe)}>Zobrazit více</Button>
            </Card.Content>
          </Card.Root>
        {/each}
      </div>
    </section>

    <!-- Budget recipes -->
    <section class="mt-6 relative recipe-section">
      <div class="flex items-center justify-between px-5 pb-[14px]">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M13.744 17.736a6 6 0 1 1-7.48-7.48"/><path d="M15 6h1v4"/><path d="m6.134 14.768.866-.5 2 3.464"/><circle cx="16" cy="8" r="6"/></svg>
          <h2 class="text-[1.05rem] font-bold text-foreground">Jídlo za lepší cenu</h2>
        </div>
        <Button variant="link" class="show-all-btn">Zobrazit vše</Button>
      </div>
      <div class="card-scroll">
        {#each budgetRecipes as recipe}
          <Card.Root class="recipe-card">
            <div class="h-[140px] w-full" style="background-color: {recipe.color}"></div>
            <Card.Content class="p-[14px]">
              <Card.Title class="text-[0.95rem] font-bold mb-[6px] leading-[1.3]">{recipe.name}</Card.Title>
              <p class="text-[0.82rem] text-muted-foreground mb-3">{recipe.time} <span class="mx-1">•</span> {recipe.price}</p>
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
      <div class="mx-4 mt-4 h-[180px] rounded-2xl" style="background-color: {selectedRecipe.color}"></div>
      <Sheet.Header class="px-5 pt-4">
        <Sheet.Title class="text-[1.2rem] font-bold text-foreground">{selectedRecipe.name}</Sheet.Title>
        <p class="text-[0.85rem] text-muted-foreground mt-1">{selectedRecipe.time} <span class="mx-1">•</span> {selectedRecipe.price}</p>
      </Sheet.Header>
      <div class="px-5 pt-4 pb-6">
        <p class="text-[0.9rem] font-bold mb-2 text-foreground">Ingredience:</p>
        <ul class="list-disc pl-5 text-[0.9rem] text-secondary-foreground mb-5 flex flex-col gap-1">
          <li>seznam</li>
          <li>seznam</li>
        </ul>
        <Button onclick={() => goto('/voice')} class="sheet-cta">Pojďme na to</Button>
      </div>
    {/if}
  </Sheet.Content>
</Sheet.Root>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');

  /* Level progress bar */
  .level-bar-track {
    width: 100%;
    height: 10px;
    background: var(--secondary);
    border-radius: 999px;
    overflow: hidden;
  }
  .level-bar-fill {
    height: 100%;
    background: var(--primary);
    border-radius: 999px;
    transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Fade-out edge on card rows */
  :global(.recipe-section::after) {
    content: '';
    position: absolute;
    top: 44px;
    right: 0;
    width: 24px;
    height: calc(100% - 44px);
    background: linear-gradient(to right, transparent, var(--background));
    pointer-events: none;
    z-index: 1;
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
    border-radius: var(--radius-xl) !important;
    border: 1px solid var(--border) !important;
    overflow: hidden;
    background: var(--background) !important;
    padding: 0 !important;
    box-shadow: 0 2px 12px oklch(0 0 0 / 0.07) !important;
  }

  :global(.show-all-btn) {
    color: var(--primary) !important;
    font-size: 0.85rem !important;
    font-weight: 700 !important;
    padding: 0 !important;
    height: auto !important;
    text-decoration: underline !important;
    text-underline-offset: 2px !important;
  }

  :global(.cta-btn) {
    background: var(--primary) !important;
    color: var(--primary-foreground) !important;
    border-radius: var(--radius-lg) !important;
    padding: 9px 18px !important;
    font-size: 0.88rem !important;
    font-weight: 700 !important;
    height: auto !important;
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

  /* Sheet */
  :global(.recipe-sheet) {
    border-radius: var(--radius-3xl) var(--radius-3xl) 0 0 !important;
    padding: 0 !important;
    max-height: 60vh !important;
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
  }
</style>