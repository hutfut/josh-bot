export interface ChangelogEntry {
	version: string;
	date: string;
	title: string;
	notes: ChangelogNote[];
}

export interface ChangelogNote {
	type: 'new' | 'improved' | 'fixed' | 'removed';
	text: string;
}

export const changelog: ChangelogEntry[] = [
	{
		version: '2.1.0',
		date: 'February 9, 2026',
		title: 'Improved sarcasm latency',
		notes: [
			{
				type: 'improved',
				text: 'Reduced hallucinations about work ethic by 40%.'
			},
			{
				type: 'fixed',
				text: 'Fixed bug where model claimed Josh had "excellent communication skills."'
			},
			{
				type: 'improved',
				text: 'Sarcasm engine is now context-aware. Previously fired indiscriminately.'
			},
			{
				type: 'new',
				text: 'Improved recruiter detection — model now adjusts tone from "unhinged" to "employable."'
			},
			{
				type: 'new',
				text: 'Added contextual follow-up prompts so users stop asking "what else can you do?"'
			}
		]
	},
	{
		version: '2.0.0',
		date: 'January 20, 2026',
		title: 'LLM fallback integration',
		notes: [
			{
				type: 'new',
				text: "Hybrid architecture: scripted responses for predictable questions, LLM for everything else."
			},
			{
				type: 'new',
				text: "Josh's opinions about microservices are now available 24/7. You're welcome."
			},
			{
				type: 'improved',
				text: 'System prompt includes factual career context. Model will no longer improvise employment history.'
			},
			{
				type: 'new',
				text: 'Rate limiting added — 20 req/min. Even fake products need fake infrastructure.'
			},
			{
				type: 'improved',
				text: 'Conversation history preserved across messages. The model remembers what you said. Unsettling but functional.'
			}
		]
	},
	{
		version: '1.2.0',
		date: 'January 6, 2026',
		title: 'josh-4o-mini initial release',
		notes: [
			{
				type: 'new',
				text: 'Introducing josh-4o-mini. Now 40% more concise. Removed unnecessary adjectives. Removed unnecessary.'
			},
			{
				type: 'new',
				text: 'Same knowledge base as josh-4o, fewer words. Like Josh after coffee.'
			},
			{
				type: 'improved',
				text: 'Model selector UI — choose between "capable" and "fast." Both are Josh.'
			},
			{
				type: 'fixed',
				text: 'Warning: mini model may still express opinions. This is a known issue with no planned fix.'
			}
		]
	},
	{
		version: '1.1.0',
		date: 'December 18, 2025',
		title: 'Content expansion',
		notes: [
			{
				type: 'new',
				text: 'Added 35+ response patterns covering career, education, hot takes, and cat.'
			},
			{
				type: 'new',
				text: 'Model now knows about Emmi (the cat). This was the most-requested feature.'
			},
			{
				type: 'improved',
				text: 'Hot takes module calibrated — model defends "monoliths over microservices" with appropriate conviction.'
			},
			{
				type: 'new',
				text: 'Path of Exile knowledge integrated. No one asked for this.'
			},
			{
				type: 'new',
				text: 'Suggested prompts guide users through a golden path. Like onboarding, but funny.'
			}
		]
	},
	{
		version: '1.0.0',
		date: 'December 2, 2025',
		title: 'Initial launch',
		notes: [
			{
				type: 'new',
				text: "First public release. The world's most advanced model for answering questions about one specific guy."
			},
			{
				type: 'new',
				text: 'Keyword matching engine handles common questions. Existential dread handles the rest.'
			},
			{
				type: 'new',
				text: 'Chat interface with typing indicators. Because authenticity matters even in parody.'
			},
			{
				type: 'new',
				text: 'Deployed to Vercel. Production-grade infrastructure for a joke. As intended.'
			}
		]
	},
	{
		version: '0.9.0-beta',
		date: 'November 14, 2025',
		title: 'Model consolidation',
		notes: [
			{
				type: 'removed',
				text: 'Retired josh-3.5-turbo. It was too honest. Nobody wants that.'
			},
			{
				type: 'removed',
				text: 'Retired josh-1.0-preview. Preview period ended. Nobody previewed.'
			},
			{
				type: 'improved',
				text: 'Consolidated to two models: josh-4o (flagship) and josh-4o-mini (diet).'
			},
			{
				type: 'fixed',
				text: "Internal testing revealed josh-3.5-turbo would occasionally compliment Josh's time management. Unacceptable."
			}
		]
	},
	{
		version: '0.1.0-alpha',
		date: 'October 28, 2025',
		title: 'Project inception',
		notes: [
			{
				type: 'new',
				text: 'Josh decided a normal portfolio was "too boring." This is the result.'
			},
			{
				type: 'new',
				text: 'Initial prototype: SvelteKit + Tailwind + questionable life choices.'
			},
			{
				type: 'new',
				text: 'The rubber factory origin story has been encoded into the training data. There is no escape.'
			},
			{
				type: 'fixed',
				text: 'First response was "Josh is a senior engineer at Kroger." Accurate but deeply uninspiring. Rewrote everything.'
			}
		]
	}
];
