/* =========================================================================
   BOKSWA — content data for the static page generator.
   All copy lives here; build/generate.js only assembles markup around it.
   Nothing in this file is referenced by the runtime site.
   ========================================================================= */

const NAV = [
  ["index.html", "Home"],
  ["products.html", "Products"],
  ["manufacturing.html", "Manufacturing"],
  ["projects.html", "Projects"],
  ["about.html", "About"],
  ["contact.html", "Contact"]
];

/* ---------------------------------------------------------------------------
   dims — the sizes we actually cast, printed as a "Dimensions" strip directly
   under each product description (and as a one-line summary on the products
   page and the product cards).

   Format:  ["Variant name", "L x W x H mm"]        e.g. ["6-inch", "400 x 150 x 200 mm"]
            ["Thickness",    "60 mm"]               single-figure entries are fine

   An empty array renders nothing at all — no placeholder, no "to confirm".
   Fill these in from the yard's own figures before the site goes live.
   --------------------------------------------------------------------------- */

const PRODUCTS = [
  {
    slug: "hollow-blocks",
    n: "01",
    name: "Hollow Blocks",
    quoteName: "Hollow Blocks",
    title: "Hollow Concrete Blocks in Kampala, Uganda",
    meta: "BOKSWA manufactures high-load bearing hollow concrete blocks for structural walling and partitions. Cast, cured and dispatched from our yard at Joggo, Bukerere Road, Kampala.",
    tagline: "High-load bearing blocks for resilient walling and partitions",
    hero: "products/hollow-block",
    heroAlt: "BOKSWA hollow concrete blocks laid out across the production yard with a finished unit in the foreground",
    lede: "The workhorse of Ugandan structural walling. Cores cut dead weight without giving up load capacity, and they leave a clear path for reinforcement and services once the wall is up.",
    body: [
      "A hollow block does two jobs at once. It carries load through its webs and shells, and its voids give you somewhere to run reinforcement, conduit and plumbing without chasing a finished wall to pieces afterwards.",
      "The part that decides whether it performs is density, and density comes from the mix and the compaction. We batch to a consistent proportion and compact under vibration on every run, because a block that looks right but crumbles at the arris costs you far more in laying time than it ever saved at purchase."
    ],
    specs: [
      ["Application", "Structural walling, partitions"],
      ["Configuration", "Three-core hollow"],
      ["Finish", "Fair-face grey"],
      ["Compressive strength", "TBD"],
      ["Nominal dimensions", "TBD"],
      ["Units per pallet", "TBD"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-building", "Structural walling", "Load-bearing walls for residential and commercial shells."],
      ["fa-th-large", "Partitions", "Internal division walls where weight and speed both matter."],
      ["fa-shield-alt", "Boundary walls", "Perimeter walling that stands up to weather and time."],
      ["fa-warehouse", "Commercial shells", "Warehouse and workshop envelopes at volume."]
    ],
    gallery: [
      ["products/hollow-block", "BOKSWA hollow concrete blocks curing across the production yard"],
      ["projects/wall-building", "Block wall under construction using BOKSWA hollow blocks"],
      ["projects/block-wall-a", "Stacked BOKSWA hollow blocks delivered to a construction site"],
      ["yard/curing-field", "Freshly cast BOKSWA blocks curing in the open yard"]
    ],
    faq: [
      ["How many blocks will I need?", "Tell us the wall length, height and thickness and we will work the quantity with you, including an allowance for cutting and breakage. Send the dimensions on WhatsApp and you will get a figure back rather than a form."],
      ["Do you deliver to my site?", "We dispatch across Kampala, Mukono and the neighbouring districts from our yard at Joggo, 3km off the Seeta–Jinja Highway. Delivery cost depends on distance and load size, so include your area when you ask."],
      ["Can I collect from the yard myself?", "Yes. Collection is welcome during working hours. Call ahead on 0758 381708 so we have your quantity stacked and ready when your truck arrives."],
      ["How long should blocks cure before laying?", "We cure before stacking and dispatch, so what leaves the yard is ready to work with. If you are storing on site, keep units off bare ground and stacked so air can move around them."]
    ]
  },
  {
    slug: "solid-blocks",
    n: "02",
    name: "Solid Blocks",
    quoteName: "Solid Blocks",
    title: "Solid Concrete Blocks in Kampala, Uganda",
    meta: "BOKSWA solid concrete blocks for foundations, retaining courses and high-load walling. Manufactured in Joggo, Bukerere Road, Kampala, Uganda.",
    tagline: "Maximum density where the load demands it",
    hero: "products/solid-block",
    heroAlt: "BOKSWA solid concrete block resting on crushed aggregate",
    lede: "No voids, no compromise. Specified where a hollow unit would quietly become the weakest element in the assembly.",
    body: [
      "Solid blocks are what you reach for when the drawing says the wall carries real load, or when the course sits below ground and has to resist both weight and water. There is no void to crush and no shell to spall, so the unit behaves predictably under concentrated load.",
      "They are heavier to handle, and that is the trade. You use them where they earn it — foundation courses, retaining sections, plinths, and walling that carries a slab above — and you use hollow units everywhere else."
    ],
    specs: [
      ["Application", "Foundations, high-load walling"],
      ["Configuration", "Solid"],
      ["Finish", "Uniform density"],
      ["Compressive strength", "TBD"],
      ["Nominal dimensions", "TBD"],
      ["Units per pallet", "TBD"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-layer-group", "Foundation courses", "Below-ground work that has to resist load and moisture."],
      ["fa-mountain", "Retaining courses", "Sections holding back earth or fill."],
      ["fa-weight-hanging", "High-load walling", "Walls carrying a slab or concentrated point loads."],
      ["fa-border-all", "Plinths & bases", "Solid bases for columns, tanks and equipment."]
    ],
    gallery: [
      ["products/solid-block", "BOKSWA solid concrete block on crushed aggregate"],
      ["products/block-stack-small", "Stack of BOKSWA concrete blocks in the yard"],
      ["yard/blocks-field", "Rows of BOKSWA blocks laid out across the curing field"],
      ["projects/wall-building", "Wall under construction using BOKSWA blocks"]
    ],
    faq: [
      ["When should I use solid instead of hollow?", "Wherever the load is concentrated or the course is below ground — foundations, retaining sections and walling that carries a slab. For general walling above ground, hollow blocks are usually the better value."],
      ["Are solid blocks worth the extra weight?", "In the right position, yes. In the wrong position you are paying for mass you do not need and slowing your masons down. If you are unsure, send us the drawing detail and we will tell you honestly which line fits."],
      ["Do you supply both lines on one delivery?", "Yes. Most orders mix lines — solid for the foundation courses, hollow above. Give us the split and we will load accordingly."]
    ]
  },
  {
    slug: "pavers-louvers",
    n: "03",
    name: "Pavers & Louvers",
    quoteName: "Pavers & Louvers",
    title: "Concrete Pavers & Louvers in Kampala, Uganda",
    meta: "Interlocking concrete pavers in bone, hexagon, trihex, rhombus and cabbage profiles, plus ventilation louver blocks. Manufactured by BOKSWA in Kampala, Uganda.",
    tagline: "Interlocking surfaces in multiple profiles, plus ventilation louvers",
    hero: "products/paver-yard",
    heroAlt: "Thousands of BOKSWA concrete pavers laid out to cure across the production yard",
    lede: "Interlock spreads vehicle load across the surface instead of driving it through a single slab — which is why a paved driveway outlasts a poured one under traffic.",
    body: [
      "A concrete slab under vehicle load cracks at its weakest line and then keeps cracking. An interlocking surface moves instead: each unit transfers load to its neighbours through the joint, the whole field flexes slightly, and nothing has to fail for the surface to cope.",
      "The practical benefit arrives later. When a service trench has to go through, you lift the units, dig, backfill and relay the same pavers. With a slab you break it out and pour again, and the repair is visible for the rest of the building's life.",
      "Louver blocks belong to the same family — cast ventilation units that let air and light move through a wall while keeping rain and direct sight out. They do a job in Ugandan buildings that a window cannot do as cheaply."
    ],
    specs: [
      ["Application", "Driveways, compounds, walkways"],
      ["Profiles", "Bone, hexagon, trihex, rhombus, cabbage"],
      ["Colours", "Grey and red"],
      ["Thickness", "TBD"],
      ["Units per square metre", "TBD"],
      ["Louver units", "Ventilation blocks"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-car", "Driveways", "Vehicle-rated surfaces that take load without cracking."],
      ["fa-home", "Compounds", "Hard standing that drains and stays level."],
      ["fa-walking", "Walkways", "Paths and edging around buildings and gardens."],
      ["fa-wind", "Louvers", "Cast ventilation units for walls and screens."]
    ],
    profiles: [
      ["products/paver-cabbage", "Cabbage"],
      ["products/paver-hex", "Hexagon"],
      ["products/paver-trihex", "Trihex"],
      ["products/paver-bone", "Bone"],
      ["products/paver-rhombus", "Rhombus"],
      ["products/paver-hex-red", "Hexagon, red"],
      ["products/paver-hex-trio", "Hexagon, laid"],
      ["products/louver", "Louver block"]
    ],
    gallery: [
      ["products/paver-yard", "BOKSWA concrete pavers curing in rows across the production yard"],
      ["products/paver-stack", "BOKSWA concrete pavers stacked and ready for dispatch"],
      ["products/paver-bone-ground", "BOKSWA bone-profile concrete paver on the ground"],
      ["texture/paver-walk-a", "Field of BOKSWA interlocking pavers stacked in the yard"],
      ["products/louver-stack", "Stacked BOKSWA concrete louver units"],
      ["texture/paver-walk-c", "Close view of BOKSWA pavers stacked for dispatch"]
    ],
    faq: [
      ["Which profile should I choose?", "Structurally the common profiles perform similarly — the choice is mostly appearance and laying speed. Bone and cabbage lay fast in running bond; hexagon reads more decorative. Come to the yard and look at them laid before you decide."],
      ["Do you supply the red colour in every profile?", "Colour availability varies by profile and production run. Ask for current stock when you request your quote rather than assuming, and we will tell you what is on the ground."],
      ["How many pavers per square metre?", "It depends on the profile and thickness you choose. Give us your area in square metres and the profile you want, and we will convert it to a unit count for the quote."],
      ["Can pavers take vehicle traffic?", "That is what interlock is for. Tell us whether the surface takes cars, light commercial or heavy vehicles, because that drives the thickness and the bedding detail you should be building to."]
    ]
  },
  {
    slug: "kerb-stones",
    n: "04",
    name: "Kerb Stones",
    quoteName: "Kerb Stones",
    title: "Precast Concrete Kerb Stones in Kampala, Uganda",
    meta: "Durable precast concrete kerb stones for roadsides, walkways and landscaping borders. Precast units manufactured by BOKSWA in Kampala, Uganda.",
    tagline: "Edge restraint for roads, walkways and landscaping",
    hero: "products/kerb-stack",
    heroAlt: "Cross-stacked BOKSWA precast concrete kerb stones in the yard",
    lede: "The edge that holds everything else in place. Without restraint, paving creeps outward and gravel migrates — and the surface stops looking finished long before it stops working.",
    body: [
      "Kerbs are the least glamorous thing in a paved scheme and the first thing that gives it away when they are missing. Every paved field pushes sideways under load. Something has to take that thrust, and if no kerb does it, the outer courses drift, the joints open and sand starts escaping from the bedding.",
      "A kerb has to be as consistent as the paving it restrains. Uniform units set to a true line and level, and that is the difference between an edge that reads as designed and one that reads as patched together."
    ],
    specs: [
      ["Application", "Roadsides, walkways, landscaping"],
      ["Form", "Precast kerb"],
      ["Finish", "Cast edge"],
      ["Nominal dimensions", "TBD"],
      ["Unit weight", "TBD"],
      ["Profiles", "TBD"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-road", "Roadsides", "Carriageway edges and verge restraint."],
      ["fa-shoe-prints", "Walkways", "Clean edges to paths and pedestrian routes."],
      ["fa-parking", "Parking bays", "Bay definition that survives being driven over."],
      ["fa-seedling", "Landscaping", "Borders between planting, gravel and hard surfaces."]
    ],
    gallery: [
      ["products/kerb-stack", "Cross-stacked BOKSWA precast concrete kerb stones"],
      ["products/kerb-stone", "BOKSWA precast concrete kerb stones stacked in the yard"],
      ["products/kerb-yard", "Pallets of BOKSWA kerb stones ready for dispatch"],
      ["texture/kerb-walk-a", "Stacked BOKSWA kerb units in the production yard"]
    ],
    faq: [
      ["Which kerb profiles do you make?", "Profiles vary by production run. Tell us where the kerb is going — roadside, walkway, parking bay or planting border — and we will confirm which units are available for your job."],
      ["How are kerbs bedded?", "Kerbs need a concrete bed and haunch to resist the sideways thrust they are there to take. Laying them on sand alone will fail. Ask us and we will talk through the detail for your situation."],
      ["Can I mix kerbs and pavers on one order?", "Yes, and most schemes should. Tell us the paved area and the running metres of edge, and we will quote both together."]
    ]
  },
  {
    slug: "maxpans",
    n: "05",
    name: "Maxpans",
    quoteName: "Maxpans",
    title: "Maxpan Concrete Panels for Floor Slabs | Kampala, Uganda",
    meta: "BOKSWA maxpans — precast concrete panels that streamline suspended floor slab and ceiling construction. Manufactured in Kampala, Uganda.",
    tagline: "Panels that simplify slab and ceiling construction",
    hero: "products/maxpan-panels",
    heroAlt: "Stacked BOKSWA maxpan concrete panels for slab construction",
    lede: "Precast panels that take formwork, propping and pouring time out of a suspended floor — and get you to a working surface above sooner.",
    body: [
      "A conventional in-situ slab needs shuttering built, propped, poured, cured and then stripped, and every one of those stages is labour and waiting. Maxpans replace most of that. The panels span between supporting beams and become the permanent soffit, so you are laying units instead of building and dismantling formwork.",
      "The knock-on effects are what actually save money: less timber consumed and re-consumed, fewer props tying up the floor below, and a soffit that is already flat and ready to finish. On a multi-storey residential job, that compounds floor by floor."
    ],
    specs: [
      ["Application", "Suspended floor slabs, ceilings"],
      ["Form", "Precast concrete panel"],
      ["Benefit", "Reduced formwork and propping"],
      ["Nominal dimensions", "TBD"],
      ["Span capability", "TBD"],
      ["Unit weight", "TBD"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-layer-group", "Floor slabs", "Suspended floors in residential and commercial builds."],
      ["fa-th", "Ceiling frameworks", "A flat, ready soffit for finishing below."],
      ["fa-clock", "Programme saving", "Less formwork cycling means faster floor-to-floor."],
      ["fa-tree", "Timber saving", "Far less shuttering consumed across a project."]
    ],
    gallery: [
      ["products/maxpan-panels", "Stacked BOKSWA maxpan concrete panels"],
      ["products/maxpan", "Single BOKSWA maxpan panel"],
      ["products/maxpan-stack", "BOKSWA maxpans and kerb units stacked in the yard"],
      ["yard/blocks-field", "The BOKSWA yard with cast units laid out"]
    ],
    faq: [
      ["What span can maxpans achieve?", "Span depends on the panel and the supporting structure, and it is not something to guess at from a website. Send us your beam spacing and loading and we will confirm what is appropriate before you order."],
      ["Do maxpans replace reinforcement?", "No. They change how the slab is formed, not the engineering behind it. Build to your engineer's design — we supply the panels to suit it."],
      ["How much programme time do they save?", "It varies with the job, but the saving comes from not building, propping, stripping and re-building formwork on every floor. On repetitive multi-storey work the gain is significant."]
    ]
  },
  {
    slug: "fence-poles",
    n: "06",
    name: "Fence Poles",
    quoteName: "Fence Poles",
    title: "Reinforced Concrete Fence Poles in Kampala, Uganda",
    meta: "Sturdy reinforced concrete fence posts for secure, long-lasting perimeter fencing. Manufactured by BOKSWA Investments in Kampala, Uganda.",
    tagline: "Reinforced posts for permanent perimeters",
    hero: "products/fence-poles",
    heroAlt: "Stack of BOKSWA reinforced concrete fence poles with angled tops and pre-cast wire holes",
    lede: "Concrete does not rot, warp, burn or need repainting. A concrete post outlasts the timber alternative several times over, and termites have no interest in it.",
    body: [
      "Perimeter fencing fails at the post, not the mesh. Timber rots at the ground line where it is wet and aerated at once, steel corrodes at the same point, and both need maintenance nobody ever schedules. A reinforced concrete post has none of those weaknesses.",
      "The reinforcement matters as much as the concrete. A post takes bending load every time the fence is leaned on, pushed or strained tight, and it is the steel inside that resists it. These are cast as reinforced units, not plain concrete sticks.",
      "Each post is cast with an angled top section to carry an outward overhang of barbed wire, and a line of pre-cast holes for threading the wire strands."
    ],
    specs: [
      ["Application", "Perimeter and security fencing"],
      ["Form", "Reinforced concrete post"],
      ["Top", "Angled, for a wire overhang"],
      ["Wire fixing", "Pre-cast holes"],
      ["Benefit", "Rot, termite and fire resistant"],
      ["Nominal dimensions", "TBD"],
      ["Reinforcement", "TBD"],
      ["Unit weight", "TBD"]
    ],
    dims: [],
    dimsNote: "",
    uses: [
      ["fa-shield-alt", "Security fencing", "Posts for chain-link and mesh perimeters."],
      ["fa-home", "Boundary walls", "Property demarcation that stays where you put it."],
      ["fa-industry", "Site perimeters", "Yards, plots and industrial boundaries."],
      ["fa-leaf", "Agricultural runs", "Long fence lines where maintenance access is poor."]
    ],
    gallery: [
      ["products/fence-poles", "BOKSWA reinforced concrete fence poles with angled tops for a wire overhang"],
      ["yard/yard-wide", "Wide view of the BOKSWA production yard"],
      ["yard/truck-loaded", "Loaded BOKSWA delivery truck at the yard"]
    ],
    faq: [
      ["What lengths are available?", "Post dimensions vary by production run. Tell us your fence height and the number of posts and we will confirm what is currently available."],
      ["How deep should posts be set?", "As a rule, a meaningful proportion of the post length goes below ground in a concrete footing, and corner and straining posts need more than intermediates. Tell us your fence line and we will talk it through."],
      ["Do you supply the mesh as well?", "Our line is the concrete components. We can advise on post spacing for the mesh you intend to use so your quantities work out correctly."]
    ]
  }
];

module.exports = { NAV, PRODUCTS };
