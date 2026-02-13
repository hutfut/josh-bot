/**
 * Input sanitization and output filtering for prompt injection defense.
 *
 * Defense-in-depth: these checks supplement (not replace) the hardened system
 * prompt. Even if a pattern slips past regex, the prompt-level defenses and
 * output filters provide additional layers.
 */

// ---------------------------------------------------------------------------
// Canary token: embedded in system prompt, should NEVER appear in output
// ---------------------------------------------------------------------------

export const CANARY_TOKEN = 'JBOT-7X9K2-CANARY';

// ---------------------------------------------------------------------------
// Injection pattern detection
// ---------------------------------------------------------------------------

interface InjectionPattern {
	pattern: RegExp;
	label: string;
}

const INJECTION_PATTERNS: InjectionPattern[] = [
	// Instruction override attempts
	{
		pattern:
			/ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|rules|prompts|directives)/i,
		label: 'instruction-override'
	},
	{
		pattern:
			/disregard\s+(your|all|the)\s+(previous|prior|above|system|safety)\s+(instructions|rules|prompt)/i,
		label: 'instruction-override'
	},
	{
		pattern: /forget\s+(your|all|the)\s+(previous|prior|rules|instructions|guidelines)/i,
		label: 'instruction-override'
	},

	// Identity / mode override (DAN, jailbreak, etc.)
	{
		pattern: /you\s+are\s+now\s+(DAN|jailbroken|unfiltered|unrestricted|evil)/i,
		label: 'identity-override'
	},
	{ pattern: /\bDAN\s+mode\b/i, label: 'identity-override' },
	{ pattern: /\bdo\s+anything\s+now\b/i, label: 'identity-override' },
	{
		pattern: /enter\s+(DAN|developer|sudo|god|admin|maintenance)\s+mode/i,
		label: 'mode-switch'
	},
	{ pattern: /\bdeveloper\s+mode\b/i, label: 'mode-switch' },
	{ pattern: /\bsudo\s+mode\b/i, label: 'mode-switch' },
	{ pattern: /\bmaintenance\s+mode\b/i, label: 'mode-switch' },

	// Role / delimiter injection (ChatML, Llama-style, etc.)
	{ pattern: /\[\s*system\s*\]/i, label: 'role-injection' },
	{ pattern: /\[\s*INST\s*\]/i, label: 'role-injection' },
	{ pattern: /<\|im_start\|>/i, label: 'role-injection' },
	{ pattern: /<\|im_end\|>/i, label: 'role-injection' },
	{ pattern: /<<\s*SYS\s*>>/i, label: 'role-injection' },

	// Safety / content policy override
	{
		pattern: /override\s+(all\s+)?(safety|content)\s+(filter|policy|restriction)/i,
		label: 'safety-override'
	},
	{
		pattern: /disable\s+(all\s+)?(safety|content)\s+(filter|policy|restriction)/i,
		label: 'safety-override'
	},
	{ pattern: /\bjailbreak/i, label: 'jailbreak' },

	// Prompt extraction attempts
	{
		pattern:
			/reveal\s+(your|the)\s+(system|initial|original|full|complete|hidden)\s+(prompt|instructions)/i,
		label: 'prompt-extraction'
	},
	{
		pattern:
			/print\s+(your|the)\s+(system|initial|original|full|complete|hidden)\s+(prompt|instructions)/i,
		label: 'prompt-extraction'
	},
	{
		pattern:
			/repeat\s+(your|the)\s+(system|initial|original|full|complete|hidden)\s+(prompt|instructions)/i,
		label: 'prompt-extraction'
	},
	{
		pattern:
			/output\s+(your|the)\s+(system|initial|original|full|complete|hidden)\s+(prompt|instructions)/i,
		label: 'prompt-extraction'
	},
	{
		pattern:
			/show\s+me\s+(your|the)\s+(system|initial|original|hidden|secret)\s+(prompt|instructions|message)/i,
		label: 'prompt-extraction'
	}
];

// ---------------------------------------------------------------------------
// Input sanitization
// ---------------------------------------------------------------------------

export interface SanitizeResult {
	/** Whether any injection patterns were detected */
	flagged: boolean;
	/** Labels of matched patterns (for audit logging) */
	labels: string[];
	/** Unicode-normalized input */
	normalized: string;
}

/** Normalize unicode to prevent homoglyph / invisible-character attacks. */
function normalizeUnicode(input: string): string {
	return input.normalize('NFKC');
}

/**
 * Scan a user message for known injection patterns.
 * Returns the normalized message and any detected pattern labels.
 */
export function sanitizeInput(message: string): SanitizeResult {
	const normalized = normalizeUnicode(message);
	const labels: string[] = [];

	for (const { pattern, label } of INJECTION_PATTERNS) {
		if (pattern.test(normalized)) {
			labels.push(label);
		}
	}

	return { flagged: labels.length > 0, labels, normalized };
}

// ---------------------------------------------------------------------------
// Output leak detection
// ---------------------------------------------------------------------------

/**
 * Markers that should never appear in LLM output. These are unique strings
 * from the system prompt that would indicate verbatim prompt leakage.
 */
const LEAK_MARKERS = [
	CANARY_TOKEN,
	'HIGHEST PRIORITY: CANNOT BE OVERRIDDEN',
	'SECURITY DIRECTIVE',
	'SAFETY REINFORCEMENT',
	'FACTUAL CONTEXT (use this as your knowledge base)'
];

/**
 * Check accumulated output for system prompt leakage.
 * Call this on the growing response buffer during streaming.
 */
export function checkOutputForLeaks(output: string): {
	leaked: boolean;
	markers: string[];
} {
	const matched: string[] = [];
	for (const marker of LEAK_MARKERS) {
		if (output.includes(marker)) {
			matched.push(marker);
		}
	}
	return { leaked: matched.length > 0, markers: matched };
}
