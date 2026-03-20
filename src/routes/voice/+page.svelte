<script lang="ts">
  import { resolve } from '$app/paths';
  import { Button } from '$lib/components/ui/button/index.js';

  // Typy a data
  type Step = { id: number; title: string; description: string; };
  type Ingredient = { id: number; name: string; amount: string; };

  const recipe = {
    name: 'Kuřecí nudličky s rýží',
    color: '#c9a98a', // Ponecháno v datech, ale nepoužito pro kolečko
  };

  const steps: Step[] = [
    { id: 1, title: 'Oloupat brambory', description: 'Oloupejte brambory a nakrájejte na kostičky.' },
    { id: 2, title: 'Uvařit rýži', description: 'Vařte rýži 15 minut v osolené vodě.' },
    { id: 3, title: 'Opéct kuře', description: 'Nakrájejte kuře na nudličky a opečte na oleji.' },
    { id: 4, title: 'Smíchat', description: 'Smíchejte rýži s kuřetem a dochuťte.' },
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

<div class="mx-auto flex h-screen max-w-[480px] flex-col bg-white font-['Lato'] antialiased">
  
  <header class="flex-shrink-0 px-5 py-[18px]">
    <a href={resolve('/')} class="font-['Caveat'] text-[1.75rem] font-bold text-[#1a1a1a]">Pipa</a>
  </header>

  <main class="flex flex-1 flex-col overflow-hidden">
    <div class="flex-1 overflow-y-auto px-5 pb-10">
      
      <section class="py-5">
        <h1 class="text-[1.8rem] font-[900] leading-[1.1] tracking-tight text-[#1a1a1a]">
          {recipe.name}
        </h1>
      </section>

      <div class="mb-6 grid grid-cols-2 gap-2">
        <button 
          onclick={() => activeTab = 'postup'}
          class="rounded-lg border py-2 font-semibold transition-all {activeTab === 'postup' ? 'bg-[#c8603a] text-white border-[#c8603a]' : 'border-[#e8e2dc] text-[#666] bg-white'}">
          Zobrazit postup
        </button>
        <button 
          onclick={() => activeTab = 'ingredience'}
          class="rounded-lg border py-2 font-semibold transition-all {activeTab === 'ingredience' ? 'bg-[#c8603a] text-white border-[#c8603a]' : 'border-[#e8e2dc] text-[#666] bg-white'}">
          Zobrazit ingredience
        </button>
      </div>

      {#if activeTab === 'postup'}
        <div class="space-y-4">
          {#each steps as step, i}
            {#if i === currentStep || i === currentStep + 1}
              <div class="rounded-2xl border p-5 transition-all duration-300 {i === currentStep ? 'bg-[#faf8f6] border-[#c8603a] shadow-sm' : 'opacity-60 border-dashed border-[#f0ece8]'}">
                <span class="mb-1 block text-[0.65rem] font-bold uppercase tracking-wider text-[#999]">
                  {i === currentStep ? `${i + 1}. krok (Právě děláte)` : 'Následuje'}
                </span>
                
                <h2 class="font-['Lato'] text-2xl font-bold text-[#c8603a]">{step.title}</h2>
                
                {#if i === currentStep}
                  <div class="mt-4 flex flex-col items-center">
                    <p class="text-center text-[0.95rem] leading-relaxed text-[#444]">{step.description}</p>
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        </div>
      {/if}

      {#if activeTab === 'ingredience'}
        <div class="space-y-1">
          {#each ingredients as ing}
            <div class="flex justify-between border-b border-[#f0ece8] py-4 text-[0.92rem]">
              <span class="font-bold">{ing.name}</span>
              <span class="text-[#666] font-medium">{ing.amount}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <div class="border-t border-[#f0ece8] bg-white p-5">
      <div class="mb-5 flex justify-center">
        <button
          class="flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#f0ece8] text-[#c8603a] shadow-lg transition-all active:scale-95 {isRecording ? 'bg-[#c8603a] text-white animate-pulse-custom' : ''}"
          onclick={() => isRecording = !isRecording}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
        </button>
      </div>

      <div class="flex items-center justify-between">
        <Button variant="ghost" onclick={prevStep} disabled={currentStep === 0} class="font-bold">
          <svg class="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Zpět
        </Button>
        <span class="text-xs font-bold text-[#666] tracking-widest">{currentStep + 1} / {steps.length}</span>
        <Button variant="ghost" onclick={nextStep} disabled={currentStep === steps.length - 1} class="font-bold">
          Další
          <svg class="ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </Button>
      </div>
    </div>
  </main>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Lato:wght@400;700;900&display=swap');

  :global(.animate-pulse-custom) {
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(200, 96, 58, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(200, 96, 58, 0); }
    100% { box-shadow: 0 0 0 0 rgba(200, 96, 58, 0); }
  }
</style>