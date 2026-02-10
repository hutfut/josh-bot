// ---------------------------------------------------------------------------
// Barrel re-export — split into focused modules for easier navigation
// ---------------------------------------------------------------------------

export { getGreeting, getPersonaWelcome, personaLabels } from './greetings';
export {
	prebaked,
	getPrebakedResponse,
	getRandomHotTake,
	hotTakesList,
	HOT_TAKE_LIMIT,
	type PrebakedResponse,
	type HotTake
} from './prebaked';
export {
	personaInitialFollowUps,
	personaFollowUpPrompts,
	defaultFollowUps,
	emailPillAfter,
	aboutPillAfter,
	type FollowUp
} from './followups';
export { llmUnavailableFallbacks, getRandomLlmUnavailableFallback } from './fallbacks';
