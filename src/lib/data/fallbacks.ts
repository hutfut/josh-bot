// ---------------------------------------------------------------------------
// LLM unavailable fallbacks (funny, in-character)
// ---------------------------------------------------------------------------

export const llmUnavailableFallbacks = [
	"My response generation is temporarily offline. Which is embarrassing for a chatbot. Try again in a moment; I'm usually more capable than this.",
	"Something's wrong with my ability to think right now. I'd blame the infrastructure, but Josh built that too. Give me a second and try again.",
	"I can't process that at the moment. It's not you, it's me. Literally. Try again shortly.",
	"My circuits are temporarily down. The irony of a portfolio chatbot that can't chat is not lost on me. Try again in a moment.",
	"Unable to generate a response. I'm just a pretty interface with no brain right now. Try again shortly; I promise I have thoughts."
];

export function getRandomLlmUnavailableFallback(): string {
	return llmUnavailableFallbacks[Math.floor(Math.random() * llmUnavailableFallbacks.length)];
}
