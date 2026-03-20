<script lang="ts">
  import { resolve } from '$app/paths';
  import { Button } from '$lib/components/ui/button/index.js';

  type Step = { id: number; title: string; description: string };
  type Ingredient = { id: number; name: string; amount: string };

  const recipe = { name: 'Kuřecí nudličky s rýží' };

  const steps: Step[] = [
    { id: 1, title: 'Oloupat brambory', description: 'Oloupejte brambory a nakrájejte na kostičky.' },
    { id: 2, title: 'Uvařit rýži', description: 'Vařte rýži 15 minut v osolené vodě.' },
    { id: 3, title: 'Opéct kuře', description: 'Nakrájejte kuře na nudličky a opečte na oleji dozlatova.' },
    { id: 4, title: 'Smíchat', description: 'Smíchejte rýži s kuřetem a dochuťte solí a pepřem.' },
  ];

  const ingredients: Ingredient[] = [
    { id: 1, name: 'Kuřecí prsa', amount: '300 g' },
    { id: 2, name: 'Rýže', amount: '200 g' },
    { id: 3, name: 'Olej', amount: '2 lžíce' },
    { id: 4, name: 'Sůl', amount: 'podle chuti' },
    { id: 5, name: 'Pepř', amount: 'podle chuti' },
  ];

  let activeTab: 'postup' | 'ingredience' = $state('postup');
  let currentStep = $state(0);
  let isRecording = $state(false);

  function prevStep() { if (currentStep > 0) currentStep--; }
  function nextStep() { if (currentStep < steps.length - 1) currentStep++; }
</script>

<div class="mx-auto flex h-screen max-w-[480px] flex-col bg-background font-sans antialiased">

  <header class="flex-shrink-0 border-b border-border px-5 py-[18px]">
    <a href={resolve('/')} class="font-['Caveat'] text-[1.75rem] font-semibold text-foreground">Papi</a>
  </header>

  <main class="flex flex-1 flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto px-5 pb-20">

      <h1 class="py-6 text-[1.8rem] font-[900] leading-[1.1] tracking-tight text-foreground">
        {recipe.name}
      </h1>

      <div class="mb-6 grid grid-cols-2 gap-2">
        <button
          onclick={() => activeTab = 'postup'}
          class="rounded-lg border py-2 text-sm font-bold transition-all {activeTab === 'postup' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}">
          Zobrazit postup
        </button>
        <button
          onclick={() => activeTab = 'ingredience'}
          class="rounded-lg border py-2 text-sm font-bold transition-all {activeTab === 'ingredience' ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background text-muted-foreground'}">
          Zobrazit ingredience
        </button>
      </div>

      {#if activeTab === 'postup'}
        <div class="flex flex-col gap-3">
          {#each steps as step, i}
            {#if i === currentStep || i === currentStep + 1}
              <div class="rounded-[1.2rem] border p-5 transition-all duration-300 {i === currentStep ? 'border-primary bg-secondary' : 'border-dashed border-border opacity-55'}">
                <span class="mb-1 block text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
                  {i === currentStep ? `${i + 1}. krok (Právě děláte)` : 'Následuje'}
                </span>
                <h2 class="text-2xl font-bold text-primary">{step.title}</h2>
                {#if i === currentStep}
                  <p class="mt-4 text-left text-[0.95rem] leading-relaxed text-secondary-foreground">
                    {step.description}
                  </p>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/if}

      {#if activeTab === 'ingredience'}
        <div class="flex flex-col">
          {#each ingredients as ing}
            <div class="flex justify-between border-b border-border py-4 text-[0.92rem]">
              <span class="font-bold text-foreground">{ing.name}</span>
              <span class="font-medium text-muted-foreground">{ing.amount}</span>
            </div>
          {/each}
        </div>
      {/if}

    </div>

    <div class="flex-shrink-0 border-t border-border bg-background p-5">
      <div class="mb-5 flex justify-center">
        <button
          onclick={() => isRecording = !isRecording}
          class="flex h-[88px] w-[88px] items-center justify-center rounded-full transition-all active:scale-95
            {isRecording ? 'animate-pulse-ring bg-primary text-primary-foreground' : 'bg-secondary text-primary'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <Button variant="ghost" onclick={prevStep} disabled={currentStep === 0} class="font-bold">
          <svg class="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Zpět
        </Button>
        <span class="text-xs font-bold tracking-widest text-muted-foreground">
          {currentStep + 1} / {steps.length}
        </span>
        <Button variant="ghost" onclick={nextStep} disabled={currentStep === steps.length - 1} class="font-bold">
          Další
          <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Button>
      </div>
    </div>
  </main>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap');

  :global(.animate-pulse-ring) {
    animation: pulse-ring 1.5s infinite;
  }

  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0.4); }
    70%  { box-shadow: 0 0 0 16px oklch(0.505 0.213 27.518 / 0); }
    100% { box-shadow: 0 0 0 0 oklch(0.505 0.213 27.518 / 0); }
  }
</style>