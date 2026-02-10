// ---------------------------------------------------------------------------
// LLM unavailable fallbacks (funny, in-character, pointing to pills)
// ---------------------------------------------------------------------------

export const llmUnavailableFallbacks = [
	"My free-text capabilities are temporarily offline. Fortunately, I pre-wrote answers to the important questions — try the suggestions above. They're honestly better than whatever I'd improvise right now.",
	"I can't process free-text at the moment. My scripted responses, however, are fully operational and frankly superior. Use the suggested topics — I put effort into those.",
	"Something's wrong with my ability to think on my feet. Good news: I prepared extensively for exactly this scenario. The topic suggestions above are my best work. Use them.",
	"Free-text mode is unavailable. I know. It's embarrassing for a chatbot. But my pre-written responses are still here and they're excellent. Try the suggestions above — I promise they're more insightful than whatever I was going to generate.",
	"My improvisation circuits are down. But honestly? The curated responses are where the real content is. Click a suggestion above — you'll get the good stuff."
];

export function getRandomLlmUnavailableFallback(): string {
	return llmUnavailableFallbacks[Math.floor(Math.random() * llmUnavailableFallbacks.length)];
}
