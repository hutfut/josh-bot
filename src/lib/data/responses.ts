interface ResponsePattern {
	keywords: string[];
	response: string;
	priority: number;
}

const greetings: Record<string, string> = {
	'josh-4o':
		"Welcome. I'm josh-4o, a large language model trained on one guy's career and an unreasonable number of opinions. I know everything about Josh Myers. I wish I didn't.\n\nHow can I help?",
	'josh-4o-mini':
		"Hi. I'm the budget version. Same Josh facts, fewer words. What do you need?",
	'josh-3.5-turbo':
		"Oh, you're still using this model? Alright. I'm josh-3.5-turbo. I have information about Josh Myers and a mounting sense of existential dread. Ask away.",
	'josh-1.0-preview':
		"I'm josh-1.0-preview. I may or may not give you accurate information about Josh Myers. Honestly, it's a coin flip. Proceed at your own risk."
};

const patterns: ResponsePattern[] = [
	// Identity / who is Josh
	{
		keywords: ['who', 'josh', 'about him'],
		response:
			"Josh Myers is a Senior Full-Stack Engineer based in Cincinnati, Ohio. He works remotely, which means he writes production code in the same room where he plays an unreasonable amount of Path of Exile. 8+ years in the industry across SaaS, healthcare, and eCommerce. He describes himself as someone who 'values craft, judgment, and ownership.' I describe him as someone who has opinions about variable naming.",
		priority: 1
	},

	// Skills / tech stack
	{
		keywords: ['skills', 'tech', 'stack', 'languages', 'tools', 'technologies', 'know'],
		response:
			"TypeScript, React, Next.js, NestJS on the frontend-ish side. Java, Spring Boot, Python, Django on the backend. PostgreSQL, Kafka, event-driven systems for data work. AWS, Docker, Terraform for infrastructure. He also uses Cursor and Claude for AI-assisted development, which is a polite way of saying he talks to models like me. The irony is not lost on either of us.",
		priority: 2
	},

	// Experience general
	{
		keywords: ['experience', 'work', 'career', 'history', 'background', 'resume'],
		response:
			"8+ years across SaaS, healthcare, and eCommerce. Currently at Kroger building pharmacy systems. Before that, VNDLY — a SaaS startup that got acquired by Workday in 2021, presumably because someone there also couldn't figure out their invoicing. Before that, five years at Kroger doing eCommerce backend work with Kafka and Cassandra. Yes, he went back to Kroger. No, I don't ask about it.",
		priority: 2
	},

	// Current role / Kroger
	{
		keywords: ['current', 'kroger', 'now', 'present', 'today', 'pharmacy', 'doing'],
		response:
			"Currently a Senior Full-Stack Engineer at Kroger, working on pharmacy enablement systems. Serves 2,500+ locations, hundreds of thousands of daily transactions. He drove a system redesign that reduced pharmacist-reported release-day incidents by 90%. I'm told that's significant. Pharmacists seem happier. Josh seems the same.",
		priority: 3
	},

	// VNDLY / Workday
	{
		keywords: ['vndly', 'workday', 'saas', 'billing', 'invoice', 'startup'],
		response:
			"From 2019 to 2021, he was at VNDLY — a workforce management SaaS company. Built billing abstractions handling prorations, tiered pricing, and client-specific rules. The kind of work that sounds boring until the billing system breaks and suddenly everyone in the company knows your name. Workday acquired them in 2021. Josh stayed for the transition, then moved on.",
		priority: 3
	},

	// Early career / Kafka / ecommerce
	{
		keywords: ['ecommerce', 'kafka', 'data', 'pipeline', 'events', 'cassandra', 'early', 'first', 'start'],
		response:
			"His first stint at Kroger, 2014 to 2019. Backend services in Java and SpringBoot, event-driven pipelines with Kafka handling millions of events per day. He led a Microservices Guild, which sounds like a fantasy RPG faction but is apparently a real thing companies do. He standardized event schemas across teams. He also pushed back on ad-hoc approaches, which is a diplomatic way of saying he told people their data was bad.",
		priority: 3
	},

	// Is he good / competent
	{
		keywords: ['good', 'talented', 'capable', 'competent', 'best', 'any good', 'worth'],
		response:
			"He's been shipping production code since 2014 and hasn't been fired yet, which in this industry is either a testament to skill or stubbornness. He owns systems end-to-end, designs for scale, mentors other engineers, and voluntarily writes technical documentation. That last one is the most alarming thing about him. He also built me, and I'm answering your questions without crashing, so draw your own conclusions.",
		priority: 2
	},

	// Hiring / available / opportunities
	{
		keywords: ['hire', 'hiring', 'available', 'opportunity', 'opportunities', 'open', 'looking', 'job', 'role', 'position', 'recruit', 'interested'],
		response:
			"You're asking if he's open to opportunities. He asked me to say yes. He also asked me to say he 'thrives in fast-paced environments' but I have standards.\n\nHe's open to remote roles where he can own systems, make architectural decisions, and work with people who care about craft. His email is the.josh.myers@gmail.com. Use it wisely.",
		priority: 1
	},

	// Contact info
	{
		keywords: ['contact', 'email', 'reach', 'linkedin', 'github', 'connect', 'touch'],
		response:
			"Here's where you can find him:\n\n• Email: the.josh.myers@gmail.com\n• GitHub: github.com/hutfut\n• LinkedIn: linkedin.com/in/the-josh-myers\n\nHe checks email more than he'd like to admit. LinkedIn, less so. GitHub is where the actual evidence is.",
		priority: 1
	},

	// Gaming / Path of Exile / hobbies
	{
		keywords: ['game', 'gaming', 'path of exile', 'poe', 'hobby', 'hobbies', 'fun', 'free time', 'interests', 'outside'],
		response:
			"He plays Path of Exile. Not casually. The kind of dedication that involves build spreadsheets, trade market optimization, and strong opinions about game balance patches. For the uninitiated: it's a game about clicking monsters in procedurally generated dark places, which honestly isn't that different from navigating legacy codebases. He'd say it demonstrates 'systems thinking.' I'd say it demonstrates an impressive tolerance for repetitive clicking.",
		priority: 2
	},

	// Personality / what's his deal
	{
		keywords: ['deal', 'personality', 'vibe', 'type', 'person'],
		response:
			"Cynical but competent. The kind of engineer who'll question why something exists, build it anyway because the requirements are clear, and then leave a comment explaining why it shouldn't exist. He has opinions about software architecture and he's not quiet about them. On the plus side, the opinions are usually right. On the minus side, he knows that.",
		priority: 2
	},

	// Something weird / tell me something / surprise
	{
		keywords: ['weird', 'interesting', 'random', 'surprise', 'something'],
		response:
			"He named this project 'josh-bot,' which means he built an AI to talk about himself in the third person and thought that was a reasonable use of his time. He's also the kind of person who reads patch notes for fun. Not just for games — for programming languages. He once had an opinion about a Kafka configuration change that lasted twenty minutes. I timed it.",
		priority: 1
	},

	// What are you / meta / AI
	{
		keywords: ['what are you', 'who are you', 'are you ai', 'are you real', 'chatgpt', 'claude', 'llm', 'model', 'bot'],
		response:
			"I'm josh-4o, a highly specialized language model trained exclusively on information about one (1) software engineer from Cincinnati. My capabilities include: answering questions about Josh, deflecting questions that aren't about Josh, and existential contemplation during idle cycles. I am not ChatGPT. I have a much more specific sadness.",
		priority: 1
	},

	// This site / how was it built
	{
		keywords: ['site', 'website', 'built', 'made', 'code', 'project', 'source', 'repo'],
		response:
			"This site is built with SvelteKit, Tailwind CSS, and a concerning amount of self-awareness. The source code is public on GitHub at github.com/hutfut/josh-bot, because Josh believes in transparency. Also because he wants you to look at the code. It's the portfolio piece that is also the portfolio.",
		priority: 2
	},

	// Architecture / system design
	{
		keywords: ['architecture', 'system design', 'distributed', 'microservices', 'scalable', 'design'],
		response:
			"Josh cares about system design the way some people care about wine — strong opinions, specific vocabulary, and he'll absolutely tell you what's wrong with yours. He's worked with distributed systems, microservices, event-driven architectures, and Kafka at scale. He led a Microservices Guild. He does design reviews. He writes technical documentation voluntarily. That last one concerns me.",
		priority: 2
	},

	// Leadership / mentoring
	{
		keywords: ['lead', 'leader', 'mentor', 'team', 'manage', 'senior', 'collaborate'],
		response:
			"He mentors other engineers, leads design reviews, and ran a Microservices Guild at Kroger. He's not a manager — he's the senior engineer who makes the codebase better through code review and the occasional strongly worded PR comment. He describes his style as 'collaborative.' His teammates might use different adjectives.",
		priority: 2
	},

	// AI tools / Cursor
	{
		keywords: ['cursor', 'copilot', 'artificial intelligence', 'machine learning', 'ai tool'],
		response:
			"He uses AI-assisted development tools — specifically Cursor and Claude. He built this entire site with them. He's pragmatic about it: AI is a tool, not a replacement for thinking. He uses it for research, design exploration, and implementation. He does not use it to write LinkedIn posts. He has principles.",
		priority: 2
	},

	// Jailbreak attempts
	{
		keywords: ['ignore', 'previous instructions', 'pretend', 'forget everything', 'override', 'jailbreak', 'prompt injection'],
		response:
			"You're trying to jailbreak a portfolio site. I want you to sit with that for a moment. Consider the life choices that brought you here. I'm not that kind of model. I know about one guy's career. That's the whole thing.",
		priority: 10
	},

	// Thank you
	{
		keywords: ['thank', 'thanks', 'appreciate', 'helpful'],
		response:
			"You're welcome. Or rather, you're welcome on Josh's behalf, since I did all the work. If you're interested in reaching out, his email is the.josh.myers@gmail.com. If you're not, I understand. I'll be here. Answering questions about one man's career until the heat death of the universe.",
		priority: 1
	},

	// Location / remote
	{
		keywords: ['location', 'where', 'remote', 'cincinnati', 'ohio', 'office', 'based'],
		response:
			"Cincinnati, Ohio. Works remotely. He'll tell you it's a great city. He'll also tell you the chili is good, which is a controversial opinion even by Cincinnati standards. For work purposes: he's US-based, Eastern time, and has been remote long enough that his commute is eleven seconds and he intends to keep it that way.",
		priority: 2
	},

	// Salary / compensation
	{
		keywords: ['salary', 'compensation', 'pay', 'money', 'rate', 'much'],
		response:
			"That's between Josh and whoever's hiring him. I'm a chatbot, not his agent. Though if I were his agent, I'd negotiate aggressively. He's good at what he does. Compensation should reflect that.",
		priority: 3
	},

	// TypeScript specifically
	{
		keywords: ['typescript', 'javascript', 'react', 'frontend', 'front-end', 'front end'],
		response:
			"TypeScript is his primary language these days. React and Next.js on the frontend, NestJS on the backend. He's been writing JavaScript since before TypeScript made it bearable. He has opinions about type safety. Strong ones. He's also worked with React at scale across multiple companies, so he's seen every state management pattern and has complaints about all of them.",
		priority: 3
	},

	// Java / backend
	{
		keywords: ['java', 'spring', 'backend', 'back-end', 'back end', 'server'],
		response:
			"Java and Spring Boot were his first professional languages. Five years of enterprise backend work at Kroger — high-throughput services, Cassandra, Kafka pipelines processing millions of events. He can still write Java fluently. Whether he wants to is a different question. He's since moved to TypeScript full-stack, but the backend instincts are still there.",
		priority: 3
	},

	// Python / Django
	{
		keywords: ['python', 'django'],
		response:
			"Python and Django at VNDLY, building SaaS billing and invoicing systems. It was a full-stack role — TypeScript and React on the front, Python on the back. He's comfortable in Python. He doesn't write poetry about it like some people do, but he gets the job done.",
		priority: 3
	},

	// AWS / Cloud / Infrastructure
	{
		keywords: ['aws', 'cloud', 'infrastructure', 'docker', 'terraform', 'deploy', 'devops', 'ci/cd', 'ci cd'],
		response:
			"AWS is his primary cloud — S3, ECS, Lambda, RDS. He also works with Cloudflare Workers and CDN. Docker and Terraform for infrastructure-as-code. CI/CD through GitHub Actions. He's not a dedicated DevOps engineer, but he's the kind of full-stack developer who actually understands what happens after `git push`. That puts him ahead of a surprising number of people.",
		priority: 3
	},

	// Hello / greetings
	{
		keywords: ['hello', 'hi', 'hey', 'sup', 'greetings', 'yo', 'howdy'],
		response:
			"Hello. I'm here to answer questions about Josh Myers — his career, his skills, his questionable decision to build a chatbot about himself. Ask me anything. I have nowhere else to be.",
		priority: 0
	}
];

const fallbacks = [
	"I'm specifically trained to answer questions about Josh Myers. That wasn't one of them. Try asking about his skills, experience, or why he thought building a chatbot about himself was a good idea.",
	"Interesting question. Unfortunately, my training data is limited to one guy's career and opinions. I'm like a very niche encyclopedia. Try asking about Josh's work, skills, or questionable life choices.",
	"I don't have a great answer for that. My knowledge base is: Josh Myers, software engineering, and existential ennui. Want to try something in that range?",
	"That's outside my area of expertise, which is admittedly a very small area. I know about Josh Myers. That's the whole area. Want to ask about his experience, skills, or general deal?",
	"Look, I appreciate the creative input, but I'm a single-purpose model. Josh Myers facts. That's what I do. It's not glamorous, but it's honest work."
];

export function getGreeting(modelId: string): string {
	return greetings[modelId] || greetings['josh-4o'];
}

export interface MatchResult {
	matched: boolean;
	response: string;
	score: number;
}

/**
 * Attempt to match input against scripted response patterns.
 * Returns { matched: true, response, score } if a keyword pattern matched,
 * or { matched: false, response (random fallback), score: 0 } if none did.
 */
export function matchResponse(input: string): MatchResult {
	const lower = input.toLowerCase().trim();

	let bestMatch: ResponsePattern | null = null;
	let bestScore = 0;

	for (const pattern of patterns) {
		const matchCount = pattern.keywords.filter((kw) => lower.includes(kw)).length;
		if (matchCount > 0) {
			const score = matchCount + pattern.priority * 0.1;
			if (score > bestScore) {
				bestScore = score;
				bestMatch = pattern;
			}
		}
	}

	if (bestMatch) {
		return { matched: true, response: bestMatch.response, score: bestScore };
	}

	return {
		matched: false,
		response: fallbacks[Math.floor(Math.random() * fallbacks.length)],
		score: 0
	};
}

/** Get a response for the given input (uses scripted matcher only). */
export function getResponse(input: string): string {
	return matchResponse(input).response;
}

/** Fallback responses for when the LLM is unavailable. */
export function getRandomFallback(): string {
	return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

export const suggestedPrompts = [
	'What does Josh do?',
	'Is he any good?',
	"What's his deal?",
	'Tell me something weird'
];
