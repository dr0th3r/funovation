export type ExampleRecipeTranslationSeed = {
	slug: string;
	locale: string;
	name: string;
	category: string;
	cuisine: string;
	ingredients: string[];
	simplifiedIngredients: string[];
	steps: string[];
};

// Optional manually curated translations for selected locales.
// English translations are generated automatically from recipe source fields.
export const EXAMPLE_RECIPE_CS: ExampleRecipeTranslationSeed[] = [
	{
		slug: 'shakshuka',
		locale: 'cs',
		name: 'Šakšuka',
		category: 'Snídaně',
		cuisine: 'Blízkovýchodní',
		ingredients: [
			'2 lžíce olivového oleje',
			'1 cibule, nakrájená na kostičky',
			'1 červená paprika, nakrájená na kostičky',
			'3 stroužky česneku, nasekané',
			'1 lžička kmínu',
			'1 lžička uzené papriky',
			'400g drcených rajčat',
			'4 vejce',
			'Sůl a pepř',
			'Čerstvá petržel'
		],
		simplifiedIngredients: ['olej', 'cibule', 'paprika', 'česnek', 'kmín', 'paprika', 'rajčata', 'vejce', 'petržel', 'chléb'],
		steps: [
			'Rozehřejte olej a orestujte cibuli a papriku dozměkka.',
			'Přidejte česnek a koření a míchejte 30 sekund.',
			'Přidejte rajčata, vařte 10 minut, dochuťte.',
			'Udělejte důlky a rozklepněte do nich vejce, přikryjte a vařte, dokud neztuhnou.',
			'Ozdobte petrželkou a podávejte s chlebem.'
		]
	},
	{
		slug: 'chicken-teriyaki-bowl',
		locale: 'cs',
		name: 'Kuřecí teriyaki miska',
		category: 'Večeře',
		cuisine: 'Japonská',
		ingredients: [
			'400g kuřecích stehen, nakrájených',
			'2 šálky vařené rýže',
			'1 lžíce neutrálního oleje',
			'2 lžíce sójové omáčky',
			'1 lžíce mirinu',
			'1 lžíce hnědého cukru',
			'1 lžička nastrouhaného zázvoru',
			'1 lžička kukuřičného škrobu + 2 lžíce vody',
			'Brokolice v páře'
		],
		simplifiedIngredients: ['kuře', 'rýže', 'olej', 'sójová omáčka', 'mirin', 'cukr', 'zázvor', 'škrob', 'brokolice'],
		steps: [
			'Orestujte kuře na oleji, dokud není propečené.',
			'Přidejte sójovou omáčku, mirin, cukr a zázvor; krátce povařte.',
			'Vmíchejte škrobovou kaši a vařte do lesku.',
			'Podávejte na rýži s brokolicí v páře.'
		]
	},
	{
		slug: 'lentil-coconut-curry',
		locale: 'cs',
		name: 'Čočkové kokosové kari',
		category: 'Vegetariánské',
		cuisine: 'Indická',
		ingredients: [
			'1 šálek červené čočky',
			'1 lžíce oleje',
			'1 cibule, nakrájená',
			'2 stroužky česneku, nasekané',
			'1 lžíce kari koření',
			'1 lžička kurkumy',
			'400ml kokosového mléka',
			'2 šálky zeleninového vývaru',
			'1 šálek špenátu',
			'Měsíčky limetky'
		],
		simplifiedIngredients: ['čočka', 'olej', 'cibule', 'česnek', 'kari koření', 'kurkuma', 'kokosové mléko', 'zeleninový vývar', 'špenát', 'limetka'],
		steps: [
			'Orestujte cibuli a česnek, dokud se nerozvoní.',
			'Opražte kari koření a kurkumu po dobu 30 sekund.',
			'Přidejte čočku, kokosové mléko a vývar; vařte 20 minut.',
			'Vmíchejte špenát a vařte, dokud nezavadne.',
			'Zakápněte limetkou a podávejte.'
		]
	},
	{
		slug: 'beef-taco-skillet',
		locale: 'cs',
		name: 'Hovězí taco pánev',
		category: 'Večeře',
		cuisine: 'Mexická',
		ingredients: [
			'400g mletého hovězího',
			'1 cibule, nakrájená na kostičky',
			'2 stroužky česneku, nasekané',
			'1 lžíce taco koření',
			'1 šálek černých fazolí',
			'1 šálek kukuřice',
			'1 šálek rajčatové omáčky',
			'1 šálek strouhaného sýra',
			'Tortilla chipsy nebo teplé tortilly'
		],
		simplifiedIngredients: ['hovězí', 'cibule', 'česnek', 'taco koření', 'fazole', 'kukuřice', 'rajčata', 'sýr', 'tortilly'],
		steps: [
			'Orestujte hovězí s cibulí a česnekem; slijte přebytečný tuk.',
			'Přidejte taco koření, fazole, kukuřici a rajčatovou omáčku.',
			'Vařte 8 minut do zhoustnutí.',
			'Posypte sýrem, přikryjte, dokud se sýr nerozpustí a podávejte.'
		]
	},
	{
		slug: 'salmon-lemon-dill',
		locale: 'cs',
		name: 'Losos s citronem a koprem',
		category: 'Večeře',
		cuisine: 'Severská',
		ingredients: [
			'4 filety z lososa',
			'1 lžíce olivového oleje',
			'1 citron, nakrájený na plátky',
			'2 lžíce čerstvého kopru',
			'2 stroužky česneku, nasekané',
			'Sůl a pepř'
		],
		simplifiedIngredients: ['losos', 'olej', 'citron', 'kopr', 'česnek'],
		steps: [
			'Osolte a opepřete lososa.',
			'Smíchejte olej, česnek a kopr, poté potřete lososa.',
			'Poklaďte plátky citronu a pečte na 200°C po dobu 12-15 minut.',
			'Podávejte s bramborami nebo salátem.'
		]
	},
	{
		slug: 'spaghetti-aglio-olio',
		locale: 'cs',
		name: 'Špagety aglio e olio',
		category: 'Těstoviny',
		cuisine: 'Italská',
		ingredients: [
			'300g špaget',
			'4 lžíce olivového oleje',
			'4 stroužky česneku, nakrájené na tenké plátky',
			'1 lžička chilli vloček',
			'1/4 šálku petrželky, nasekané',
			'Sůl',
			'Parmazán (volitelně)'
		],
		simplifiedIngredients: ['těstoviny', 'olej', 'česnek', 'chilli', 'petržel', 'sýr'],
		steps: [
			'Uvařte špagety v osolené vodě na skus (al dente).',
			'Jemně orestujte česnek na olivovém oleji do světle zlatova.',
			'Přidejte chilli vločky a poté vmíchejte scezené těstoviny.',
			'Přidejte kapku vody z těstovin a petržel; dobře promíchejte.',
			'Ihned podávejte, volitelně posypané parmazánem.'
		]
	},
	{
		slug: 'classic-margherita-pizza',
		locale: 'cs',
		name: 'Klasická pizza margherita',
		category: 'Večeře',
		cuisine: 'Italská',
		ingredients: [
			'1 těsto na pizzu',
			'1/2 šálku rajčatové omáčky San Marzano',
			'200g čerstvé mozzarelly, natrhané',
			'1 hrst lístků čerstvé bazalky',
			'1 lžíce extra panenského olivového oleje',
			'Sůl'
		],
		simplifiedIngredients: ['těsto na pizzu', 'rajčata', 'sýr', 'bazalka', 'olej'],
		steps: [
			'Předehřejte troubu na 250°C s kamenem na pizzu uvnitř.',
			'Vytáhněte těsto do kruhu o průměru 30 cm.',
			'Rovnoměrně rozetřete rajčatovou omáčku, okraje nechte volné.',
			'Přidejte mozzarellu a špetku soli.',
			'Pečte 8-10 minut, dokud krustička nezíská puchýřky.',
			'Před podáváním ozdobte čerstvou bazalkou a pokapejte olivovým olejem.'
		]
	},
	{
		slug: 'thai-green-chicken-curry',
		locale: 'cs',
		name: 'Thajské zelené kuřecí kari',
		category: 'Večeře',
		cuisine: 'Thajská',
		ingredients: [
			'400g kuřecích prsou, nakrájených',
			'2 lžíce zelené kari pasty',
			'400ml kokosového mléka',
			'1 šálek bambusových výhonků',
			'1 červená paprika, nakrájená',
			'1 lžíce rybí omáčky',
			'1 lžička hnědého cukru',
			'Lístky čerstvé bazalky',
			'Vařená jasmínová rýže'
		],
		simplifiedIngredients: ['kuře', 'kari pasta', 'kokosové mléko', 'bambusové výhonky', 'paprika', 'rybí omáčka', 'cukr', 'bazalka', 'rýže'],
		steps: [
			'Orestujte zelenou kari pastu na trošce kokosového krému, dokud se nerozvoní.',
			'Přidejte kuře a vařte, dokud povrch nezbělá.',
			'Nalijte zbývající kokosové mléko, rybí omáčku a cukr.',
			'Přidejte bambusové výhonky a papriku; vařte 15 minut.',
			'Vmíchejte bazalku a podávejte s jasmínovou rýží.'
		]
	},
	{
		slug: 'fluffy-buttermilk-pancakes',
		locale: 'cs',
		name: 'Nadýchané podmáslové lívance',
		category: 'Snídaně',
		cuisine: 'Americká',
		ingredients: [
			'2 šálky hladké mouky',
			'2 lžíce cukru',
			'2 lžičky prášku do pečiva',
			'1/2 lžičky jedlé sody',
			'1/2 lžičky soli',
			'2 šálky podmáslí',
			'2 vejce',
			'1/4 šálku rozpuštěného másla',
			'Máslo a javorový sirup na podávání'
		],
		simplifiedIngredients: ['mouka', 'cukr', 'prášek do pečiva', 'jedlá soda', 'podmáslí', 'vejce', 'máslo', 'javorový sirup'],
		steps: [
			'Vyšlehejte suché ingredience ve velké míse.',
			'V jiné míse vyšlehejte podmáslí, vejce a rozpuštěné máslo.',
			'Jemně vmíchejte mokré ingredience do suchých (hrudky nevadí).',
			'Smažte porce o velikosti 1/4 šálku na pánvi s máslem, dokud se nevytvoří a nepopraskají bublinky.',
			'Otočte a smažte dozlatova. Podávejte s máslem a sirupem.'
		]
	},
	{
		slug: 'beef-and-broccoli-stir-fry',
		locale: 'cs',
		name: 'Restované hovězí s brokolicí',
		category: 'Večeře',
		cuisine: 'Čínská',
		ingredients: [
			'400g hovězího pupku (flank steak), nakrájeného na tenké plátky',
			'2 šálky růžiček brokolice',
			'3 lžíce sójové omáčky',
			'1 lžíce ústřicové omáčky',
			'1 lžíce sezamového oleje',
			'2 stroužky česneku, nasekané',
			'1 lžička nastrouhaného zázvoru',
			'1 lžíce kukuřičného škrobu',
			'2 lžíce rostlinného oleje'
		],
		simplifiedIngredients: ['hovězí', 'brokolice', 'sójová omáčka', 'ústřicová omáčka', 'sezamový olej', 'česnek', 'zázvor', 'škrob', 'olej'],
		steps: [
			'Promíchejte hovězí s 1 lžící sójové omáčky a škrobem; nechte odstát 10 minut.',
			'Smíchejte zbývající sójovou omáčku, ústřicovou omáčku a sezamový olej.',
			'Orestujte hovězí v horkém oleji dohněda a vyjměte z pánve.',
			'Do pánve přidejte česnek, zázvor a brokolici; restujte 3 minuty.',
			'Vraťte hovězí do pánve, přidejte omáčku a vařte do zhoustnutí.'
		]
	},
	{
		slug: 'mediterranean-chickpea-salad',
		locale: 'cs',
		name: 'Středomořský cizrnový salát',
		category: 'Oběd',
		cuisine: 'Středomořská',
		ingredients: [
			'1 plechovka (400g) cizrny, propláchnutá',
			'1 okurka, nakrájená na kostičky',
			'1 šálek cherry rajčátek, rozpůlených',
			'1/2 červené cibule, nakrájená na kostičky',
			'1/2 šálku sýru feta, rozdrobeného',
			'1/4 šálku oliv kalamata, vypeckovaných',
			'3 lžíce olivového oleje',
			'1 lžíce červeného vinného octa',
			'1 lžička sušeného oregana'
		],
		simplifiedIngredients: ['cizrna', 'okurka', 'rajčata', 'cibule', 'sýr', 'olivy', 'olej', 'ocet', 'oregano'],
		steps: [
			'V míse smíchejte cizrnu, okurku, rajčata, cibuli a olivy.',
			'Vyšlehejte olivový olej, ocet, oregano, sůl a pepř na dresink.',
			'Salát polijte dresinkem a promíchejte.',
			'Lehce vmíchejte sýr feta.',
			'Podávejte ihned nebo nechte 30 minut chladit, aby se chutě propojily.'
		]
	},
	{
		slug: 'creamy-mushroom-risotto',
		locale: 'cs',
		name: 'Krémové houbové rizoto',
		category: 'Večeře',
		cuisine: 'Italská',
		ingredients: [
			'1.5 šálku rýže arborio',
			'300g směsi hub, nakrájených na plátky',
			'1 cibule, najemno nasekaná',
			'2 stroužky česneku, nasekané',
			'1/2 šálku suchého bílého vína',
			'4 šálky teplého kuřecího nebo zeleninového vývaru',
			'1/2 šálku parmazánu, nastrouhaného',
			'2 lžíce másla',
			'2 lžíce olivového oleje'
		],
		simplifiedIngredients: ['rýže', 'houby', 'cibule', 'česnek', 'víno', 'vývar', 'sýr', 'máslo', 'olej'],
		steps: [
			'Orestujte houby na 1 lžíci oleje dohněda; vyjměte a dejte stranou.',
			'Ve stejném hrnci orestujte na zbývajícím oleji cibuli a česnek dozměkka.',
			'Přidejte rýži a restujte 1 minutu, poté zalijte vínem a míchejte, dokud se nevsákne.',
			'Postupně přidávejte teplý vývar po jedné sběračce a stále míchejte, dokud se tekutina nevstřebá.',
			'Když je rýže al dente, vmíchejte houby, máslo a parmazán.'
		]
	},
	{
		slug: 'veggie-pad-thai',
		locale: 'cs',
		name: 'Zeleninové pad thai',
		category: 'Večeře',
		cuisine: 'Thajská',
		ingredients: [
			'200g rýžových nudlí',
			'2 vejce, rozšlehaná',
			'1 šálek klíčků fazolí mungo',
			'1/2 šálku arašídů, nasekaných',
			'2 jarní cibulky, nakrájené',
			'3 lžíce omáčky pad thai (na bázi tamarindu)',
			'2 lžíce neutrálního oleje',
			'Měsíčky limetky',
			'Koriandr na ozdobu'
		],
		simplifiedIngredients: ['těstoviny', 'vejce', 'klíčky', 'arašídy', 'cibule', 'pad thai omáčka', 'olej', 'limetka', 'koriandr'],
		steps: [
			'Rýžové nudle namočte do teplé vody, dokud nezměknou, poté je sceďte.',
			'Rozehřejte olej ve woku, lehce usmažte vejce a odsuňte je ke kraji.',
			'Přidejte nudle a omáčku pad thai, energicky míchejte, dokud nudle nezměknou.',
			'Vmíchejte klíčky, jarní cibulku a polovinu arašídů.',
			'Ihned podávejte posypané zbylými arašídy, koriandrem a pokapané limetkou.'
		]
	},
	{
		slug: 'french-onion-soup',
		locale: 'cs',
		name: 'Francouzská cibulačka',
		category: 'Předkrm',
		cuisine: 'Francouzská',
		ingredients: [
			'4 velké žluté cibule, nakrájené na tenké plátky',
			'3 lžíce másla',
			'1 lžíce olivového oleje',
			'1/2 šálku suchého sherry nebo bílého vína',
			'6 šálků hovězího vývaru',
			'1 snítka čerstvého tymiánu',
			'1 bageta, nakrájená na plátky a opečená',
			'1.5 šálku sýru Gruyère, nastrouhaného'
		],
		simplifiedIngredients: ['cibule', 'máslo', 'olej', 'víno', 'hovězí vývar', 'tymián', 'chléb', 'sýr'],
		steps: [
			'Karamelizujte cibuli na másle a oleji na středně mírném ohni po dobu 40 minut.',
			'Odglazujte hrnec pomocí sherry, seškrábněte připečeniny ze dna.',
			'Přidejte hovězí vývar a tymián; vařte 20 minut.',
			'Polévku nandejte do misek vhodných do trouby a nahoru položte plátky opečené bagety.',
			'Hojně posypte sýrem Gruyère a zapékejte pod grilem, dokud není sýr bublající a zlatý.'
		]
	},
	{
		slug: 'greek-moussaka',
		locale: 'cs',
		name: 'Řecká musaka',
		category: 'Večeře',
		cuisine: 'Řecká',
		ingredients: [
			'2 velké lilky, nakrájené na 1 cm silné plátky',
			'400g mletého jehněčího nebo hovězího',
			'1 cibule, najemno nasekaná',
			'2 stroužky česneku, nasekané',
			'400g drcených rajčat',
			'1 lžička mleté skořice',
			'2 šálky plnotučného mléka',
			'2 lžíce nesoleného másla',
			'2 lžíce hladké mouky',
			'1/2 šálku parmazánu, nastrouhaného'
		],
		simplifiedIngredients: ['lilek', 'hovězí', 'cibule', 'česnek', 'rajčata', 'skořice', 'mléko', 'máslo', 'mouka', 'sýr'],
		steps: [
			'Plátky lilku pečte na 200°C asi 20 minut dozměkka.',
			'Orestujte maso s cibulí a česnekem, přidejte rajčata a skořici; vařte 20 minut.',
			'Rozpusťte máslo v rendlíku, zašlehejte mouku a pomalu přišlehejte mléko do zhoustnutí, vznikne bešamel.',
			'Navrstvěte lilek a masovou omáčku do zapékací mísy, nahoru přidejte bešamel a parmazán.',
			'Pečte na 180°C asi 45 minut, dokud není povrch zlatohnědý a bublající.'
		]
	},
	{
		slug: 'chicken-tikka-masala',
		locale: 'cs',
		name: 'Kuřecí tikka masala',
		category: 'Večeře',
		cuisine: 'Indická',
		ingredients: [
			'500g kuřecích prsou, nakrájených na kostky',
			'1 šálek bílého jogurtu',
			'2 lžíce koření garam masala',
			'1 velká cibule, nakrájená na kostičky',
			'3 stroužky česneku, nasekané',
			'1 lžíce čerstvého zázvoru, nastrouhaného',
			'400g rajčatového pyré',
			'1 šálek smetany ke šlehání',
			'Čerstvý koriandr na ozdobu'
		],
		simplifiedIngredients: ['kuře', 'jogurt', 'garam masala', 'cibule', 'česnek', 'zázvor', 'rajčata', 'smetana', 'koriandr'],
		steps: [
			'Marinujte kuře v jogurtu a 1 lžíci garam masaly alespoň 1 hodinu.',
			'Orestujte namarinované kuře na rozpálené pánvi dohněda; vyjměte a dejte stranou.',
			'Ve stejné pánvi orestujte cibuli, česnek a zázvor dozměkka a do rozvonění.',
			'Přidejte rajčatové pyré, zbývající garam masalu a smetanu; vařte 10 minut.',
			'Vraťte kuře do omáčky, prohřejte do úplného propečení a ozdobte koriandrem.'
		]
	},
	{
		slug: 'avocado-toast-poached-egg',
		locale: 'cs',
		name: 'Avokádový toast se zastřeným vejcem',
		category: 'Snídaně',
		cuisine: 'Americká',
		ingredients: [
			'2 silné plátky kváskového chleba',
			'1 velké zralé avokádo',
			'2 velká vejce',
			'1 lžíce bílého octa',
			'1/2 lžičky chilli vloček',
			'Sůl a černý pepř podle chuti',
			'1 lžička čerstvé citronové šťávy'
		],
		simplifiedIngredients: ['chléb', 'avokádo', 'vejce', 'ocet', 'pepř', 'citron'],
		steps: [
			'Opečte plátky kváskového chleba dozlatova a dokřupava.',
			'V malé misce roztlačte avokádo s citronovou šťávou, solí a pepřem.',
			'V hrnci přiveďte vodu k jemnému varu, přidejte ocet a zamíchejte pro vytvoření víru.',
			'Opatrně vhoďte vejce a vařte přesně 3 minuty; vyjměte děrovanou lžící.',
			'Rovnoměrně rozetřete avokádo na toasty, nahoru dejte zastřené vejce a posypte chilli vločkami.'
		]
	},
	{
		slug: 'classic-miso-soup',
		locale: 'cs',
		name: 'Klasická miso polévka',
		category: 'Předkrm',
		cuisine: 'Japonská',
		ingredients: [
			'4 šálky vývaru dashi',
			'3 lžíce bílé miso pasty',
			'1 šálek pevného tofu, nakrájeného na malé kostičky',
			'2 jarní cibulky, nakrájené na tenká kolečka',
			'1 lžíce sušené řasy wakame'
		],
		simplifiedIngredients: ['dashi', 'miso', 'tofu', 'cibule', 'řasa'],
		steps: [
			'Sušenou řasu wakame namočte na 10 minut do malé misky s vodou, poté dobře sceďte.',
			'Vývar dashi přiveďte v hrnci k jemnému varu na středním ohni.',
			'Miso pastu dejte na sběračku, přidejte trochu horkého vývaru pro její hladké rozpuštění a poté směs vmíchejte zpět do hrnce.',
			'Přidejte nakrájené tofu a hydratovanou řasu wakame a jemně prohřívejte 2 minuty, aniž byste nechali polévku vřít.',
			'Ozdobte nakrájenou jarní cibulkou a ihned podávejte horké.'
		]
	},
	{
		slug: 'beef-stroganoff',
		locale: 'cs',
		name: 'Hovězí stroganov',
		category: 'Večeře',
		cuisine: 'Ruská',
		ingredients: [
			'500g svíčkové, nakrájené na tenké nudličky',
			'300g hnědých žampionů, nakrájených na plátky',
			'1 žlutá cibule, nakrájená',
			'2 lžíce másla',
			'2 lžíce hladké mouky',
			'2 šálky hovězího vývaru',
			'1/2 šálku zakysané smetany',
			'1 lžíce dijonské hořčice',
			'Uvařené vaječné nudle na podávání'
		],
		simplifiedIngredients: ['hovězí', 'houby', 'cibule', 'máslo', 'mouka', 'hovězí vývar', 'zakysaná smetana', 'hořčice', 'těstoviny'],
		steps: [
			'Zprudka orestujte hovězí nudličky na rozpálené pánvi s trochou oleje dohněda; vyjměte a dejte stranou.',
			'Ve stejné pánvi rozpusťte máslo, přidejte nakrájenou cibuli a houby a restujte dozměkka a dohněda.',
			'Zasypte moukou a stále míchejte asi 1 minutu.',
			'Postupně vmíchejte hovězí vývar a dijonskou hořčici, vařte do zhoustnutí omáčky.',
			'Odstavte, vmíchejte zakysanou smetanu a orestované hovězí a podávejte teplé s vaječnými nudlemi.'
		]
	},
	{
		slug: 'classic-caprese-salad',
		locale: 'cs',
		name: 'Klasický caprese salát',
		category: 'Předkrm',
		cuisine: 'Italská',
		ingredients: [
			'3 velká zralá rajčata, nakrájená na plátky',
			'250g čerstvé mozzarelly, nakrájené na plátky',
			'1 svazek lístků čerstvé bazalky',
			'3 lžíce extra panenského olivového oleje',
			'1 lžíce balsamico glazury',
			'Hrubozrnná mořská sůl a černý pepř'
		],
		simplifiedIngredients: ['rajčata', 'sýr', 'bazalka', 'olej', 'balsamico glazura'],
		steps: [
			'Na velkém servírovacím talíři střídavě skládejte plátky rajčat a mozzarelly.',
			'Mezi plátky vložte lístky čerstvé bazalky.',
			'Bohatě pokapejte extra panenským olivovým olejem a balsamico glazurou.',
			'Těsně před podáváním dochuťte hrubozrnnou mořskou solí a čerstvě mletým černým pepřem.'
		]
	},
	{
		slug: 'tofu-vegetable-stir-fry',
		locale: 'cs',
		name: 'Restované tofu se zeleninou',
		category: 'Veganské',
		cuisine: 'Čínská',
		ingredients: [
			'400g extra pevného tofu, vylisovaného a nakrájeného na kostky',
			'2 šálky míchané zeleniny (paprika, cukrový hrášek, mrkev)',
			'2 lžíce sójové omáčky',
			'1 lžíce hoisin omáčky',
			'1 lžička sezamového oleje',
			'1 palec zázvoru, nastrouhaný',
			'2 stroužky česneku, nasekané',
			'2 lžíce rostlinného oleje'
		],
		simplifiedIngredients: ['tofu', 'zelenina', 'sójová omáčka', 'hoisin', 'sezamový olej', 'zázvor', 'česnek', 'olej'],
		steps: [
			'Kostky tofu orestujte na 1 lžíci rostlinného oleje ze všech stran dozlatova a dokřupava, poté je z pánve vyjměte.',
			'Přidejte zbylý olej a orestujte míchanou zeleninu, zázvor a česnek po dobu 3-4 minut.',
			'V malé misce smíchejte sójovou omáčku, hoisin omáčku a sezamový olej.',
			'Vraťte tofu do pánve, zalijte omáčkou a promíchejte, aby se vše rovnoměrně obalilo.',
			'Vařte další 2 minuty, dokud omáčka nezačne bublat, a podávejte horké.'
		]
	},
	{
		slug: 'bbq-pulled-pork',
		locale: 'cs',
		name: 'Trhané vepřové s BBQ',
		category: 'Večeře',
		cuisine: 'Americká',
		ingredients: [
			'1.5kg vepřového plecka',
			'2 lžíce uzené papriky',
			'1 lžíce hnědého cukru',
			'1 lžička sušeného česneku',
			'1 lžička sušené cibule',
			'1 šálek BBQ omáčky',
			'1/2 šálku jablečného octa',
			'1/2 šálku kuřecího vývaru',
			'Hamburgerové bulky na podávání'
		],
		simplifiedIngredients: ['vepřové', 'paprika', 'cukr', 'česnek', 'cibule', 'bbq omáčka', 'ocet', 'kuřecí vývar', 'chléb'],
		steps: [
			'Vepřové maso rovnoměrně potřete směsí uzené papriky, hnědého cukru, sušeného česneku, sušené cibule, soli a pepře.',
			'Maso vložte do pomalého hrnce společně s jablečným octem a kuřecím vývarem.',
			'Vařte na nízký stupeň po dobu 8 hodin nebo dokud není maso velmi měkké a neodděluje se.',
			'Maso natrhejte pomocí dvou vidliček a odstraňte případné velké kusy tuku.',
			'Vmíchejte BBQ omáčku a podávejte teplé v hamburgerových bulkách.'
		]
	},
	{
		slug: 'garlic-shrimp-scampi',
		locale: 'cs',
		name: 'Česnekové krevety scampi',
		category: 'Večeře',
		cuisine: 'Italská',
		ingredients: [
			'400g velkých krevet, oloupaných a zbavených střívka',
			'250g nudlí linguine',
			'4 lžíce nesoleného másla',
			'2 lžíce olivového oleje',
			'4 stroužky česneku, nasekané',
			'1/2 šálku suchého bílého vína',
			'1/4 šálku čerstvé petrželky, nasekané',
			'Šťáva z 1 citronu',
			'1/2 lžičky chilli vloček'
		],
		simplifiedIngredients: ['krevety', 'těstoviny', 'máslo', 'olej', 'česnek', 'víno', 'petržel', 'citron', 'pepř'],
		steps: [
			'Linguine uvařte v osolené vodě podle návodu na obalu na skus (al dente).',
			'Na velké pánvi rozpusťte 2 lžíce másla a olivový olej na středním ohni.',
			'Přidejte česnek a chilli vločky a restujte 1 minutu, dokud se nerozvoní.',
			'Přidejte krevety a restujte, dokud nezrůžoví, asi 2 minuty z každé strany, poté je z pánve vyjměte.',
			'Přilejte bílé víno a citronovou šťávu, nechte mírně zredukovat, poté vmíchejte zbývající máslo a smíchejte s těstovinami, krevetami a petrželkou.'
		]
	},
	{
		slug: 'tom-yum-goong',
		locale: 'cs',
		name: 'Tom yum goong',
		category: 'Předkrm',
		cuisine: 'Thajská',
		ingredients: [
			'4 šálky kuřecího nebo zeleninového vývaru',
			'2 stonky citronové trávy, naklepané a nakrájené na 5cm kousky',
			'4 lístky kafrové limetky, natrhané',
			'1 palec galangalu nebo zázvoru, nakrájený na plátky',
			'200g hub, rozčtvrcených',
			'300g středních krevet, oloupaných',
			'3 lžíce rybí omáčky',
			'2 lžíce thajské chilli pasty (Nam Prik Pao)',
			'1/4 šálku čerstvé limetkové šťávy'
		],
		simplifiedIngredients: ['vývar', 'citronová tráva', 'limetkové lístky', 'zázvor', 'houby', 'krevety', 'rybí omáčka', 'chilli pasta', 'limetka'],
		steps: [
			'Přiveďte vývar k varu, přidejte citronovou trávu, lístky kafrové limetky a galangal; vařte 5 minut.',
			'Vmíchejte houby a thajskou chilli pastu a vařte další 3 minuty.',
			'Přidejte krevety a vařte, dokud nezrůžoví a nezmizí jejich průsvitnost, asi 2-3 minuty.',
			'Odstavte z ohně a vmíchejte rybí omáčku a čerstvou limetkovou šťávu.',
			'Ochutnejte a dochuťte, nandejte do misek a dřevnaté aromatické přísady před konzumací odstraňte.'
		]
	}
];