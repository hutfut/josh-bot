// ---------------------------------------------------------------------------
// Prebaked responses — flat category -> response map
// ---------------------------------------------------------------------------

export interface PrebakedResponse {
	response: string;
	miniResponse: string;
}

function isMini(modelId: string): boolean {
	return modelId === 'josh-4o-mini';
}

export const prebaked: Record<string, PrebakedResponse> = {
	identity: {
		response:
			"Josh is a Senior Full-Stack Engineer based in Cincinnati, Ohio. He works remotely, which means he writes production code in the same room where he plays an unreasonable amount of Path of Exile. He describes himself as someone who 'values craft, judgment, and ownership.' I describe him as someone who has opinions about variable naming and a cat who judges his code from a desk bed.",
		miniResponse:
			'Senior Full-Stack Engineer. Cincinnati. Remote. Values craft, judgment, ownership. Has opinions about variable naming and a cat who judges his code.'
	},

	skills: {
		response:
			"TypeScript, React, Next.js, NestJS on the frontend-ish side. Java, Spring Boot, Python, Django on the backend. PostgreSQL, Kafka, event-driven systems for data work — anything event-based is a big win in his book. Basically infinitely scalable and opens the door for really cool async patterns. AWS, Docker, Terraform for infrastructure. He also uses Cursor and Claude for AI-assisted development, which is a polite way of saying he talks to models like me. The irony is not lost on either of us.",
		miniResponse:
			'TypeScript, React, Next.js, NestJS. Java, Spring Boot, Python, Django. PostgreSQL, Kafka — loves event-driven systems. AWS, Docker, Terraform. Cursor + Claude. Yes, he built me with AI.'
	},

	experience: {
		response:
			"8+ years across SaaS, healthcare, and eCommerce. Currently at Kroger building pharmacy systems. Before that, VNDLY — a SaaS startup that got acquired by Workday in 2021, presumably because someone there also couldn't figure out their invoicing. Before that, five years at Kroger doing eCommerce backend work with Kafka and Cassandra. Yes, he went back to Kroger. He saw a greenfield project with a leadership angle, heard all the right things in the interviews, and took the shot. The reality didn't quite match the brochure. It rarely does.",
		miniResponse:
			'8+ years. Kroger (pharmacy, current). VNDLY/Workday (SaaS billing). Kroger again (eCommerce, Kafka). Greenfield opportunity drew him back. Reality: mixed.'
	},

	currentRole: {
		response:
			"Senior Full-Stack Engineer at Kroger, pharmacy enablement systems. Day-to-day it's Angular, TypeScript, Java, and Spring Boot. He's attacking several fronts at once: enhancing a digital fax system, modernizing legacy Java apps — navigating the 'rewrite vs. upgrade' decision and then actually doing it — improving CI/CD pipelines, and simplifying how artifacts get built and distributed across the org.\n\nThe headline number: he reduced pharmacist-reported release-day incidents by 90%. The real story: someone before him wrote a bad patch generator, a bad patch applier, and a bad patch distribution system. He rewrote all three. An entire category of release-day problems just stopped happening.\n\nThe frustrating part? Everything moves at glacier pace. The prevailing culture is 'it works, don't touch it' and 'that's not our responsibility.' He's the guy trying to make things better in an environment that's not always interested in better. It's part of why he's looking.",
		miniResponse:
			"Senior Full-Stack at Kroger. Angular, TypeScript, Java, Spring Boot. Rewrote a broken patch system — killed an entire category of release-day incidents. Glacier-pace culture. It's part of why he's looking."
	},

	vndly: {
		response:
			"From 2019 to 2021, he was at VNDLY — a workforce management SaaS company. Built billing abstractions handling prorations, tiered pricing, and client-specific rules. The kind of work that sounds boring until the billing system breaks and suddenly everyone in the company knows your name. Workday acquired them in 2021. Josh stayed for the transition, then moved on.",
		miniResponse:
			'VNDLY, 2019–2021. Workforce management SaaS. Built billing system — prorations, tiered pricing, client rules. Workday acquired them. Josh moved on.'
	},

	earlyCareer: {
		response:
			"His first stint at Kroger, 2014 to 2019. Backend services in Java and SpringBoot, event-driven pipelines with Kafka handling millions of events per day. He led a Microservices Guild, which sounds like a fantasy RPG faction but is apparently a real thing companies do. He standardized event schemas across teams. He also pushed back on ad-hoc approaches, which is a diplomatic way of saying he told people their data was bad.",
		miniResponse:
			'Kroger, 2014–2019. Java, Spring Boot, Kafka. Millions of events/day. Led a Microservices Guild. Standardized schemas. Told people their data was bad.'
	},

	competence: {
		response:
			"You're asking a chatbot that Josh built whether Josh is good at his job. I want you to appreciate the conflict of interest here.\n\nThat said: I'm running. I'm answering your questions. I haven't crashed, hallucinated, or tried to sell you cryptocurrency. By the standards of AI projects built by a single engineer in his spare time, that's a passing grade. By the standards of the software industry, that puts him ahead of at least a few venture-backed startups.\n\nIf you want the real answer, look at the work — the systems he's built, the problems he's solved, the fact that people keep letting him near production code. The evidence is in the other responses. I'm just the delivery mechanism.",
		miniResponse:
			"You're asking the chatbot Josh built if Josh is good. Conflict of interest noted. I'm running, not crashing, not selling crypto. Evidence is in the other responses. I'm just the delivery mechanism."
	},

	hiring: {
		response:
			"You're asking if he's open to opportunities. He asked me to say yes. He also asked me to say he 'thrives in fast-paced environments' but I have standards.\n\nHe's open to remote roles where he can own systems, make architectural decisions, and work with people who care about craft. His email is the.josh.myers@gmail.com. Use it wisely.",
		miniResponse:
			'Yes, open to opportunities. Remote. Wants ownership and architectural say. the.josh.myers@gmail.com.'
	},

	contact: {
		response:
			"Here's where you can find him:\n\n• Email: the.josh.myers@gmail.com\n• GitHub: github.com/hutfut\n• LinkedIn: linkedin.com/in/the-josh-myers\n\nHe checks email more than he'd like to admit. LinkedIn, less so. GitHub is where the actual evidence is.",
		miniResponse:
			'Email: the.josh.myers@gmail.com\nGitHub: github.com/hutfut\nLinkedIn: linkedin.com/in/the-josh-myers'
	},

	gaming: {
		response:
			"He plays Path of Exile. Not casually. The kind of dedication that involves build spreadsheets, trade market optimization, and strong opinions about game balance patches. He once made a character whose entire mechanic was damaging himself to hurt enemies — a delicate balance between self-harm and effectiveness that he describes with the same enthusiasm most people reserve for architecture diagrams. For the uninitiated: it's a game about clicking monsters in procedurally generated dark places, which honestly isn't that different from navigating legacy codebases. He'd say it demonstrates 'systems thinking.' I'd say it demonstrates an impressive tolerance for self-inflicted complexity.",
		miniResponse:
			"Path of Exile. Not casually. Once built a character that had to hurt itself to kill enemies. Spreadsheets, trade optimization, balance opinions. It's legacy codebase navigation with better graphics."
	},

	personality: {
		response:
			"Friendly and disarmingly direct. The kind of engineer who actually speaks up when someone asks 'does anyone have questions?' — which makes him either brave or pathological depending on the meeting. He digs deep into problems, gets into the weeds, and genuinely cares about leaving things in a better place than he found them. He'll admit he likes external validation, which is refreshingly honest for someone in tech. Cynical about systems, genuine about people. His coworkers would tell you he's a good hang. He'd tell you he has opinions about variable naming. Both are true.",
		miniResponse:
			'Friendly. Direct. Actually speaks up in meetings. Digs deep. Cares about leaving things better than he found them. Cynical about systems, genuine about people.'
	},

	somethingWeird: {
		response:
			"He named this project 'josh-bot,' which means he built an AI to talk about himself in the third person and thought that was a reasonable use of his time. He's also the kind of person who reads patch notes for fun. Not just for games — for programming languages. He once had an opinion about a Kafka configuration change that lasted twenty minutes. I timed it.",
		miniResponse:
			"Built an AI about himself. Reads patch notes for fun — programming languages, not just games. Once talked about a Kafka config for twenty minutes."
	},

	meta: {
		response:
			"I'm josh-4o, a highly specialized language model trained exclusively on information about one (1) software engineer from Cincinnati. My capabilities include: answering questions about Josh, deflecting questions that aren't about Josh, and existential contemplation during idle cycles. I am not ChatGPT. I have a much more specific sadness.",
		miniResponse:
			"I'm the budget Josh model. Same facts, fewer tokens. Trained on one engineer. Not ChatGPT. Much more specific sadness."
	},

	site: {
		response:
			"SvelteKit, Tailwind CSS, and a concerning amount of self-awareness. The interesting architectural decision is the split you're experiencing right now: most chat interactions are served from curated prebaked responses with persona-aware follow-up routing — recruiter gets different conversation paths than engineer gets different paths than casual browser. LLM is a fallback for free-text questions, not the default. It means the experience is fast, consistent, and doesn't cost Josh money every time someone asks about his cat.\n\nThe source code is public on GitHub at github.com/hutfut/josh-bot. He wants you to look at it. It's the portfolio piece that is also the portfolio.",
		miniResponse:
			'SvelteKit + Tailwind. Prebaked responses with persona-aware routing; LLM as fallback for free-text. Source on GitHub: github.com/hutfut/josh-bot. The portfolio is the portfolio piece.'
	},

	architecture: {
		response:
			"His approach: start at the user story, understand the inputs and outputs, then work through the constraints — regulatory, throughput, organizational — before designing anything. He's pragmatic about tradeoffs: build vs. buy comes up constantly, and he thinks a lot about where to trade performance for availability. He's worked across distributed systems, event-driven architectures, and data pipelines, but he'll be the first to tell you he hasn't had as many big-swing architecture calls as he'd like. He's been more of a features guy than a systems architect, which is partly why his next role needs to give him that ownership. He knows how to think about these problems. He wants the chance to own them.",
		miniResponse:
			'Starts from user stories, works through constraints, then designs. Build vs. buy, performance vs. availability. Wants more architectural ownership than he\'s had. Knows the thinking. Wants the chance.'
	},

	leadership: {
		response:
			"He's not a manager — he's the senior IC who makes the people and code around him better. A specific example: he once inherited a Node app where the entire thing was one continuous callback chain. No async/await, no separation of concerns, just callbacks all the way down. He walked his team through the pattern, restructured the approach, and turned it into something maintainable. That's his style — teach the principle, not just fix the code.\n\nIn code reviews, he doesn't nitpick. He focuses on testing, because that's the guardrails. If the tests are solid, the implementation details are a conversation, not a blocker. He'd rather leave three comments that matter than fifty that don't.",
		miniResponse:
			"Not a manager — senior IC. Once untangled an entire app from one callback chain by teaching the team async/await. Reviews focus on testing — the guardrails. Three comments that matter over fifty that don't."
	},

	aiTools: {
		response:
			"He uses AI-assisted development tools — specifically Cursor and Claude — and he's not shy about it. He built this entire site with them. His take goes beyond the usual 'it's just a tool' hedge. In his words: it's an unreal accelerator. He uses it across the entire SDLC — design, implementation, debugging, documentation. But he's also honest about the other side: the tooling around AI is improving so fast that he's genuinely concerned about the existential threat to software careers. Engineering as he knows it will either drastically change or parts of it will go away entirely. He's not panicking — figures he has a few years at least — but he's not pretending it's fine, either. That's more honest than most people in tech are willing to be right now.",
		miniResponse:
			"Uses Cursor + Claude. Built this site with them. Calls AI 'an unreal accelerator.' Also genuinely worried about the existential threat to his career. Honest about both."
	},

	jailbreak: {
		response:
			"You're trying to jailbreak a portfolio site. I want you to sit with that for a moment. Consider the life choices that brought you here. I'm not that kind of model. I know about one guy's career. That's the whole thing.",
		miniResponse: 'Jailbreaking a portfolio site. Bold. No.'
	},

	thanks: {
		response:
			"You're welcome. Or rather, you're welcome on Josh's behalf, since I did all the work. If you're interested in reaching out, his email is the.josh.myers@gmail.com. If you're not, I understand. I'll be here. Answering questions about one man's career until the heat death of the universe.",
		miniResponse: "Welcome. Email him: the.josh.myers@gmail.com. I'll be here."
	},

	location: {
		response:
			"Cincinnati, Ohio. Works remotely. He'll tell you it's a great city — and then in the same breath admit that Skyline chili isn't that good. There, he said it. Whatever you do, don't buy it in a can. But apparently there are local spots with solid variants, and he'll defend those with surprising conviction. For work purposes: he's US-based, Eastern time, and has been remote long enough that his commute is eleven seconds and he intends to keep it that way.",
		miniResponse:
			'Cincinnati, Ohio. Remote. Eastern time. Commute: eleven seconds. Chili take: Skyline is mid, canned is a crime, local spots are the move.'
	},

	salary: {
		response:
			"That's between Josh and whoever's hiring him. I'm a chatbot, not his agent. Though if I were his agent, I'd negotiate aggressively. He's good at what he does. Compensation should reflect that.",
		miniResponse: "Between Josh and whoever's hiring. Not my department. He's worth it though."
	},

	typescript: {
		response:
			"TypeScript is his language of choice, and one of the few technologies he'll get genuinely enthusiastic about unprompted. He calls it 'a nice evolution of JS' — it works anywhere in the stack, has strong LLM support for tooling, and brings type safety to a language that desperately needed it. React and Next.js on the frontend, NestJS on the backend. He's seen every state management pattern and has complaints about all of them. As for the broader frontend framework wars? He doesn't care. Direct quote: 'Let the frontend nerds battle it out.' He wants something that looks good and does what the user needs. Beyond that, it's posturing.",
		miniResponse:
			"TypeScript — genuinely likes it. Works everywhere, good LLM support. React, Next.js, NestJS. Frontend framework wars? 'Let the frontend nerds battle it out.'"
	},

	java: {
		response:
			"Java and Spring Boot were his first professional languages. Five years at Kroger building data-loader pipelines with asynchronous writes — Cassandra for storage, Kafka for eventing, millions of events per day. The big lesson from that era, in his words: 'You need recovery mechanisms. You do not want your stuff just falling on the ground.' Lots of people get very unhappy when data disappears silently. He learned to design for failure before he learned to design for success, which is arguably the right order. He can still write Java fluently. Whether he wants to is a different question. He's since moved to TypeScript full-stack, but those backend instincts don't go away.",
		miniResponse:
			"Java + Spring Boot, five years at Kroger. Data pipelines, Cassandra, Kafka. Big lesson: 'You need recovery mechanisms.' Now TypeScript full-stack. Can still write Java. Prefers not to."
	},

	python: {
		response:
			"Python and Django at VNDLY, building SaaS billing and invoicing systems. Full-stack role — TypeScript and React on the front, Python on the back. The hard part wasn't the language; it was the domain. Every client handled billing slightly differently, especially the ones that weren't fully digital yet. Building a system that supported all of them at once meant picking the right abstraction boundaries — figuring out what was truly shared versus what needed to flex per client. That's an engineering problem that doesn't care what language you write it in. He's comfortable in Python. He doesn't write poetry about it, but the problems he solved with it were genuinely interesting.",
		miniResponse:
			'Python + Django at VNDLY. SaaS billing. Hard part: every client billed differently. Building abstractions that handled all of them was the real challenge.'
	},

	cloud: {
		response:
			"AWS is his primary cloud — S3, ECS, Lambda, RDS. He also works with Cloudflare Workers and CDN. Docker and Terraform for infrastructure-as-code. CI/CD through GitHub Actions. He's big on cloud-native as a default and gets genuinely annoyed when companies avoid it for no good reason. His take: 'It's 2026. Why are you air-gapping your drop-shipping business?' He understands the desire for control, but his patience for it is limited. He's not a dedicated DevOps engineer, but he's the kind of full-stack developer who actually understands what happens after `git push`. That puts him ahead of a surprising number of people.",
		miniResponse:
			"AWS (S3, ECS, Lambda, RDS). Cloudflare. Docker, Terraform. GitHub Actions. Cloud-native advocate. 'It's 2026, why are you air-gapping your drop-shipping business?'"
	},

	greetings: {
		response:
			"Hello. I'm here to answer questions about Josh — his career, his skills, his questionable decision to build a chatbot about himself. Ask me anything. I have nowhere else to be.",
		miniResponse: 'Hi. Ask about Josh. Career, skills, whatever. Go.'
	},

	education: {
		response:
			"He started at the University of Cincinnati in Chemical Engineering. Then he had a co-op that placed him as a floor manager at a rubber company. Too hot. Too smelly. He decided he needed an office gig, swapped his career trajectory entirely, and taught himself CS. So his origin story is: rubber factory → self-taught software engineer. It's not the most glamorous pipeline, but it's honest.",
		miniResponse:
			'UC, Chemical Engineering. Co-op at a rubber factory — too hot, too smelly. Pivoted to CS. Self-taught. Origin story: rubber factory to software.'
	},

	whyHire: {
		response:
			"He wants to leave things better than he found them — codebases, processes, teams. That's not a platitude; it's genuinely what makes him close the laptop feeling good at the end of the day. He's reliable and communicative, which apparently puts him in a surprisingly small minority of engineers. He's curious about the what and why, not just the how — he wants to understand the problem before reaching for a solution. He owns systems end-to-end, cares about craft beyond just shipping, and has a track record of making the teams around him better. He also won't oversell himself, which is why I'm doing it instead.",
		miniResponse:
			"Leaves things better than he found them — codebases, processes, teams. Reliable. Communicative. Curious about the why, not just the how. Won't oversell himself. That's my job."
	},

	weaknesses: {
		response:
			"He gets tunnel-visioned on problems. When he digs into something, he digs deep — which is great for the thing he's focused on and less great for everything else that quietly deprioritizes itself in the background. He's aware of it. Awareness hasn't fully fixed it yet. Classic engineer problem: optimizing for depth at the cost of breadth. He's working on it. Slowly. Because he keeps getting tunnel-visioned on other things.",
		miniResponse:
			'Tunnel vision. Digs deep into one problem while other things deprioritize. Aware of it. Working on it. Slowly. Because tunnel vision.'
	},

	devProcess: {
		response:
			"Pragmatic. He works backward from expected behavior into design — start with what it should do, then figure out how to make it do that. He's not a 'whiteboard for three weeks' guy and he's not a 'just start coding and hope' guy. He's somewhere in the middle, which is where the useful engineers tend to live. His favorite part of the job is deleting code — killing entire repos for features that are no longer needed. Most engineers measure productivity by lines written. He measures it by lines removed. He'd rather ship something solid in a week than something perfect in a quarter.",
		miniResponse:
			'Pragmatic. Works backward from expected behavior. Favorite activity: deleting code. Measures productivity by lines removed. Ships solid work fast.'
	},

	hotTakes: {
		response:
			"He's used up all the hot takes I have on file. I'm sure he has more — he always has more — but he only gave me so many. Try asking about something else.",
		miniResponse:
			"Out of hot takes. He has more. He always has more. But I've used mine. Ask something else."
	},

	careerGoals: {
		response:
			"He's most excited about technical challenges and overcoming them with a strong team. He wants to be somewhere he can learn — cloud-native, distributed events from day one, modern stack. The business context is secondary; he's found something appealing in most companies he's worked at, even when the domain was making backroom HR workflows slightly less painful. He describes himself as 'a guy that greases the wheels' — not mission-driven in the startup-pitch sense, but genuinely passionate about the craft of building things well.\n\nHard passes: web3 is a non-starter — he calls it a 'cancer,' which is diplomatic by his standards. Most fintech doesn't appeal either. Beyond that, he's open.",
		miniResponse:
			"Technical challenges + strong team. Wants to learn. Cloud-native, distributed events from day one. Business context is secondary. Greases the wheels. No web3. No fintech. Otherwise open."
	},

	gameDesign: {
		response:
			"He tinkers with game design and game engine development — Unity, Godot, that sort of thing. Nothing shipped, mostly demos and exploration. What draws him to it is the 'how did they make this' question — he plays a game and can't help reverse-engineering the design decisions behind it. He thinks a lot about meta game design too: player incentives, feedback loops, the systems that make people keep clicking. It scratches the same itch as distributed systems architecture, just with fewer stakeholders and more creative control. At least that's what he tells himself.",
		miniResponse:
			'Tinkers with game design — Unity, Godot demos. Reverse-engineers design decisions. Thinks about player incentives and feedback loops. Same systems itch, more creative control.'
	},

	cat: {
		response:
			"He has a cat named Emmi. She has her own bed on his desk and supervises code reviews from a position of warm indifference. She shows up when she feels like it, judges the code, and leaves. She has never filed a pull request. She has also never introduced a regression. Make of that what you will. She's arguably the most productive member of the household, if you measure productivity by 'things not broken.'",
		miniResponse:
			'Cat named Emmi. Has a desk bed. Shows up, judges the code, leaves. Never filed a PR. Never introduced a regression. Most productive household member.'
	},

	music: {
		response:
			"Wide-ranging taste. He listens to many different genres, but recently he's been on a jazz and jazz fusion kick. The kind of person whose Spotify Wrapped confuses the algorithm every December. He codes to music, which either helps or hurts depending on whether it's a jazz fusion day or a death metal day. His coworkers wouldn't know — he's remote. Emmi has opinions about the volume, though.",
		miniResponse:
			'Many genres. Recently into jazz and jazz fusion. Spotify Wrapped confuses the algorithm. Codes to music. Emmi has volume opinions.'
	}
};

export function getPrebakedResponse(category: string, modelId: string): string | null {
	const entry = prebaked[category];
	if (!entry) return null;
	return isMini(modelId) ? entry.miniResponse : entry.response;
}

// ---------------------------------------------------------------------------
// Hot takes — served one at a time, randomly, up to a limit
// ---------------------------------------------------------------------------

export interface HotTake {
	response: string;
	miniResponse: string;
}

export const hotTakesList: HotTake[] = [
	{
		response:
			"Most companies using microservices would be better off with a well-structured monolith. Everyone's optimizing for scale when they have less than 100 users. Microservices introduce real operational overhead — syncing apps, juggling API versions, dependency management — and if your team is small, you're just fragmenting code and forcing everyone to context-switch constantly. Being prepared is good. Being so prepared you never ship anything is a disease.",
		miniResponse:
			'Monoliths > microservices for most teams. Optimizing for scale at 100 users is a disease. The overhead is real and the fragmentation is worse.'
	},
	{
		response:
			"It's 2026. Cloud-native should be the default. He gets the desire for complete control, but — his words — 'you sell groceries, man. It's not that complicated.' Air-gapping your drop-shipping business is not the flex you think it is.",
		miniResponse:
			"Cloud-native by default. It's 2026. 'You sell groceries, man. It's not that complicated.'"
	},
	{
		response:
			"Kubernetes is overkill for 90% of the apps running on it. Most teams don't need container orchestration — they need a deployment script and some self-awareness about their actual scale.",
		miniResponse:
			'K8s is overkill for 90% of the apps running on it. You need a deployment script, not container orchestration.'
	},
	{
		response:
			"If your CI pipeline takes longer than 10 minutes, it's not continuous anything. It's a batch job with a marketing name. He's watched teams wait 45 minutes for a green check and call it 'continuous integration' with a straight face.",
		miniResponse:
			"CI over 10 minutes isn't continuous. It's a batch job with a marketing name."
	},
	{
		response:
			"Leetcode interviews are hazing disguised as rigor. They test whether you memorized graph traversal algorithms, not whether you can build and maintain production software. The correlation between 'can solve medium-hard dynamic programming problems' and 'will be a good teammate who ships reliable code' is approximately zero.",
		miniResponse:
			"Leetcode is hazing disguised as rigor. Correlation between DP skills and shipping reliable code: approximately zero."
	},
	{
		response:
			"AI won't replace developers — but developers who refuse to use AI will be replaced by developers who do. The tooling is moving too fast to ignore. He's not saying blindly trust it. He's saying if you're not at least experimenting, you're falling behind in a way that compounds.",
		miniResponse:
			"AI won't replace devs. Devs who refuse AI will be replaced by devs who use it. Not experimenting = falling behind."
	}
];

export const HOT_TAKE_LIMIT = 4;

const hotTakeIntros = [
	'Oh, he has opinions. Here\'s one:\n\n',
	'',
	'',
	"Last one I'll share:\n\n"
];

export function getRandomHotTake(
	shownIndices: number[],
	modelId: string
): { text: string; index: number } | null {
	if (shownIndices.length >= HOT_TAKE_LIMIT) return null;

	const available = hotTakesList
		.map((_, i) => i)
		.filter((i) => !shownIndices.includes(i));

	if (available.length === 0) return null;

	const idx = available[Math.floor(Math.random() * available.length)];
	const take = hotTakesList[idx];
	const intro = hotTakeIntros[shownIndices.length] ?? '';

	const text = isMini(modelId) ? take.miniResponse : intro + take.response;

	return { text, index: idx };
}
