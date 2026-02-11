// ---------------------------------------------------------------------------
// Barrel re-export — split into focused modules for easier navigation
// ---------------------------------------------------------------------------

export { getGreeting, personaLabels } from './greetings';
export {
	topicPills,
	personaTopicOrder,
	personaInitialFollowUps,
	defaultFollowUps,
	emailPillAfter,
	aboutPillAfter,
	type FollowUp
} from './followups';
export { llmUnavailableFallbacks, getRandomLlmUnavailableFallback } from './fallbacks';
