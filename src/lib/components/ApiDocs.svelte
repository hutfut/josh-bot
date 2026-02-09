<script lang="ts">
	let activeSection = $state('overview');

	const sections = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'authentication', label: 'Authentication' },
		{ id: 'models', label: 'Models' },
		{ id: 'completions', label: 'POST /josh/completions' },
		{ id: 'opinions', label: 'GET /josh/opinions' },
		{ id: 'status', label: 'GET /josh/status' },
		{ id: 'models-list', label: 'GET /models' },
		{ id: 'rate-limits', label: 'Rate Limits' },
		{ id: 'errors', label: 'Errors' },
		{ id: 'sdks', label: 'SDKs' }
	];

	// Code examples stored as constants to avoid Svelte curly-brace parsing issues
	const code = {
		completionsRequest: `curl -X POST https://api.josh-bot.com/v1/josh/completions \\
  -H "Content-Type: application/json" \\
  -d '{
    "message": "What do you think about microservices?",
    "model": "josh-4o",
    "history": []
  }'`,

		completionsResponse: `{
  "id": "resp_abc123",
  "model": "josh-4o",
  "content": "Microservices are great if you actually need them. Most teams don't. They need a well-structured monolith and fewer meetings.",
  "source": "llm-stream",
  "metadata": {
    "confidence": 0.94,
    "tokens": 42,
    "latency": 847
  }
}`,

		opinionsRequest: `curl https://api.josh-bot.com/v1/josh/opinions`,

		opinionsResponse: `{
  "opinion": "Kubernetes is overkill for 90% of the apps running on it",
  "confidence": 0.97,
  "willArgueAboutThis": true,
  "category": "infrastructure",
  "relatedOpinions": [
    "Docker Compose is underrated",
    "Your startup does not need a service mesh"
  ]
}`,

		statusRequest: `curl https://api.josh-bot.com/v1/josh/status`,

		statusResponse: `{
  "employed": true,
  "available": true,
  "openTo": [
    "remote",
    "ownership",
    "modern-stack"
  ],
  "hardNo": [
    "web3",
    "fintech"
  ],
  "currentRole": "Senior Full-Stack Engineer",
  "lastUpdated": "2026-02-01T00:00:00Z"
}`,

		modelsRequest: `curl https://api.josh-bot.com/v1/models`,

		modelsResponse: `{
  "models": [
    {
      "id": "josh-4o",
      "name": "josh-4o",
      "description": "Our most capable Josh model",
      "badge": "Latest"
    },
    {
      "id": "josh-4o-mini",
      "name": "josh-4o-mini",
      "description": "Faster, lighter, same opinions",
      "badge": "Fast"
    },
    {
      "id": "josh-o3-mini",
      "name": "josh-o3-mini",
      "description": "Thinks before speaking. A first.",
      "badge": "Coming Soon",
      "comingSoon": true
    },
    {
      "id": "josh-4o-vision",
      "name": "josh-4o-vision",
      "description": "Judges your code by looking at it.",
      "badge": "Research",
      "comingSoon": true
    }
  ]
}`,

		errorResponse: `{
  "error": {
    "code": "invalid_request",
    "message": "The 'message' field is required. Josh can't respond to nothing. He's opinionated, not psychic.",
    "param": "message",
    "type": "validation_error"
  }
}`,

		tsExample: `const response = await fetch(
  "https://api.josh-bot.com/v1/josh/completions",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Tell me about your experience with Kafka",
      model: "josh-4o"
    })
  }
);

const data = await response.json();
console.log(data.content);
// "I've processed millions of events through Kafka
//  pipelines. The trick is..."`
	};

	function scrollToSection(id: string) {
		activeSection = id;
		const el = document.getElementById(id);
		if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	let sidebarOpen = $state(false);
</script>

<section class="relative py-24 px-4 bg-surface-50" aria-label="API Documentation">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="mb-16">
			<div class="flex items-center gap-3 mb-4">
				<span
					class="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
				>
					v1.0.0
				</span>
				<span
					class="px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium"
				>
					Stable-ish
				</span>
			</div>
			<h1 class="text-3xl sm:text-4xl font-bold text-white mb-3">API Reference</h1>
			<p class="text-lg text-gray-400 max-w-2xl">
				Everything you need to integrate Josh's opinions, status, and completions into your
				application. Whether you should is a different question entirely.
			</p>
			<div class="mt-4 flex items-center gap-2 text-sm text-gray-500">
				<span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
				Base URL:
				<code class="px-2 py-0.5 rounded bg-surface-200 text-gray-300 font-mono text-xs"
					>https://api.josh-bot.com/v1</code
				>
			</div>
		</div>

		<div class="flex gap-10">
			<!-- Mobile sidebar toggle -->
			<button
				class="lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-500/25 flex items-center justify-center hover:bg-violet-500 transition-colors"
				onclick={() => (sidebarOpen = !sidebarOpen)}
				aria-label="Toggle navigation"
			>
				<svg
					class="w-5 h-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M4 6h16" />
					<path d="M4 12h16" />
					<path d="M4 18h16" />
				</svg>
			</button>

			<!-- Mobile sidebar overlay -->
			{#if sidebarOpen}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="lg:hidden fixed inset-0 z-30 bg-black/60"
					onclick={() => (sidebarOpen = false)}
					onkeydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
				></div>
			{/if}

			<!-- Sidebar -->
			<nav
				class="
					lg:sticky lg:top-24 lg:self-start lg:w-56 lg:shrink-0 lg:block
					{sidebarOpen
					? 'fixed inset-y-0 left-0 z-40 w-64 bg-surface-50 border-r border-white/[0.08] p-6 pt-24 overflow-y-auto'
					: 'hidden'}
				"
				aria-label="API sections"
			>
				<div class="space-y-0.5">
					{#each sections as section}
						<button
							onclick={() => {
								scrollToSection(section.id);
								sidebarOpen = false;
							}}
							class="
								w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
								{activeSection === section.id
								? 'text-white bg-white/[0.06] font-medium'
								: 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.03]'}
							"
						>
							{section.label}
						</button>
					{/each}
				</div>
			</nav>

			<!-- Main content -->
			<div class="flex-1 min-w-0 space-y-20">
				<!-- Overview -->
				<div id="overview">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>Overview</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<div class="space-y-4 text-sm text-gray-400 leading-relaxed">
						<p>
							The josh-bot API provides programmatic access to Josh's thoughts, opinions, and
							employment status. It follows REST conventions wherever those conventions happen to
							agree with Josh's personal preferences.
						</p>
						<p>
							All responses are JSON. All opinions are strongly held. All latency numbers are
							real-ish. The API is versioned because Josh has learned from past mistakes (see:
							training data, 2014–2019).
						</p>
					</div>
				</div>

				<!-- Authentication -->
				<div id="authentication">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>Authentication</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<div class="rounded-xl bg-surface-100 border border-white/[0.08] p-5">
						<p class="text-sm text-gray-400 leading-relaxed">
							None. This is a free API about one guy. What would you even authenticate?
						</p>
						<p class="text-sm text-gray-500 mt-3 italic">
							If you're the kind of person who puts API keys in client-side JavaScript anyway,
							Josh would like a word with you about security practices.
						</p>
					</div>
				</div>

				<!-- Models -->
				<div id="models">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>Models</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						josh-bot offers several model variants. Each is fine-tuned on the same training data
						but optimized for different use cases and response times.
					</p>
					<div class="overflow-x-auto rounded-xl border border-white/[0.08]">
						<table class="w-full text-sm text-left">
							<thead>
								<tr class="border-b border-white/[0.08] bg-surface-200/50">
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Model</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Description</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Status</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-white/[0.06]">
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">josh-4o</td>
									<td class="px-4 py-3 text-gray-400">Our most capable Josh model</td>
									<td class="px-4 py-3">
										<span
											class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
											>Available</span
										>
									</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">josh-4o-mini</td>
									<td class="px-4 py-3 text-gray-400">Faster, lighter, same opinions</td>
									<td class="px-4 py-3">
										<span
											class="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs"
											>Available</span
										>
									</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">josh-o3-mini</td>
									<td class="px-4 py-3 text-gray-400">Thinks before speaking. A first.</td>
									<td class="px-4 py-3">
										<span
											class="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs"
											>Coming Soon</span
										>
									</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">josh-4o-vision</td>
									<td class="px-4 py-3 text-gray-400">Judges your code by looking at it.</td>
									<td class="px-4 py-3">
										<span
											class="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs"
											>Research</span
										>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<!-- POST /v1/josh/completions -->
				<div id="completions">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>POST /v1/josh/completions</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						The main endpoint. Send a message, get a Josh-flavored response. Think of it like
						texting a friend who happens to have strong opinions about API design and an
						unsettling amount of Kafka knowledge.
					</p>

					<div class="flex items-center gap-2 mb-6">
						<span
							class="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold"
							>POST</span
						>
						<code class="text-sm text-gray-300 font-mono">/v1/josh/completions</code>
					</div>

					<!-- Parameters -->
					<h3 class="text-sm font-semibold text-white mb-3">Parameters</h3>
					<div class="overflow-x-auto rounded-xl border border-white/[0.08] mb-6">
						<table class="w-full text-sm text-left">
							<thead>
								<tr class="border-b border-white/[0.08] bg-surface-200/50">
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Name</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Type</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Required</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Description</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-white/[0.06]">
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">message</td>
									<td class="px-4 py-3 text-gray-400 font-mono text-xs">string</td>
									<td class="px-4 py-3"
										><span class="text-amber-400 text-xs font-medium">Required</span></td
									>
									<td class="px-4 py-3 text-gray-400"
										>The message to send to Josh. Keep it professional-ish.</td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">model</td>
									<td class="px-4 py-3 text-gray-400 font-mono text-xs">string</td>
									<td class="px-4 py-3"
										><span class="text-gray-500 text-xs">Optional</span></td
									>
									<td class="px-4 py-3 text-gray-400"
										>Model ID. Defaults to
										<code
											class="px-1.5 py-0.5 rounded bg-surface-200 font-mono text-xs text-gray-300"
											>josh-4o</code
										></td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-violet-400">history</td>
									<td class="px-4 py-3 text-gray-400 font-mono text-xs">array</td>
									<td class="px-4 py-3"
										><span class="text-gray-500 text-xs">Optional</span></td
									>
									<td class="px-4 py-3 text-gray-400"
										>Previous messages for context. Josh remembers things, but only if you
										remind him.</td
									>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Request example -->
					<h3 class="text-sm font-semibold text-white mb-3">Request</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden mb-6">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">curl</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.completionsRequest}</code></pre>
					</div>

					<!-- Response example -->
					<h3 class="text-sm font-semibold text-white mb-3">Response</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden mb-6">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">200 OK</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.completionsResponse}</code></pre>
					</div>

					<!-- Try it button -->
					<a
						href="/chat"
						class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-medium hover:bg-violet-500 transition-colors duration-200 shadow-lg shadow-violet-500/20"
					>
						<svg
							class="w-4 h-4"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M5 12h14" />
							<path d="m12 5 7 7-7 7" />
						</svg>
						Try it in the chat
					</a>
				</div>

				<!-- GET /v1/josh/opinions -->
				<div id="opinions">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>GET /v1/josh/opinions</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						Returns a random strong opinion from Josh's collection. No parameters required —
						Josh always has an opinion ready.
					</p>

					<div class="flex items-center gap-2 mb-6">
						<span
							class="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold"
							>GET</span
						>
						<code class="text-sm text-gray-300 font-mono">/v1/josh/opinions</code>
					</div>

					<!-- Request -->
					<h3 class="text-sm font-semibold text-white mb-3">Request</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden mb-6">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">curl</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.opinionsRequest}</code></pre>
					</div>

					<!-- Response -->
					<h3 class="text-sm font-semibold text-white mb-3">Response</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">200 OK</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.opinionsResponse}</code></pre>
					</div>
				</div>

				<!-- GET /v1/josh/status -->
				<div id="status">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>GET /v1/josh/status</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						Returns Josh's current employment and availability status. Updated whenever Josh
						updates his LinkedIn, which is roughly the same frequency as solar eclipses.
					</p>

					<div class="flex items-center gap-2 mb-6">
						<span
							class="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold"
							>GET</span
						>
						<code class="text-sm text-gray-300 font-mono">/v1/josh/status</code>
					</div>

					<!-- Request -->
					<h3 class="text-sm font-semibold text-white mb-3">Request</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden mb-6">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">curl</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.statusRequest}</code></pre>
					</div>

					<!-- Response -->
					<h3 class="text-sm font-semibold text-white mb-3">Response</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">200 OK</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.statusResponse}</code></pre>
					</div>
				</div>

				<!-- GET /v1/models -->
				<div id="models-list">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>GET /v1/models</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						Lists all available models. Useful for building model selectors, or for confirming
						that yes, there really are multiple versions of this.
					</p>

					<div class="flex items-center gap-2 mb-6">
						<span
							class="px-2.5 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold"
							>GET</span
						>
						<code class="text-sm text-gray-300 font-mono">/v1/models</code>
					</div>

					<!-- Request -->
					<h3 class="text-sm font-semibold text-white mb-3">Request</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden mb-6">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">curl</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.modelsRequest}</code></pre>
					</div>

					<!-- Response -->
					<h3 class="text-sm font-semibold text-white mb-3">Response</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">200 OK</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.modelsResponse}</code></pre>
					</div>
				</div>

				<!-- Rate Limits -->
				<div id="rate-limits">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>Rate Limits</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						Even fake APIs need rate limits. Ours are real, though. Josh values his
						computational boundaries.
					</p>
					<div class="overflow-x-auto rounded-xl border border-white/[0.08] mb-6">
						<table class="w-full text-sm text-left">
							<thead>
								<tr class="border-b border-white/[0.08] bg-surface-200/50">
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Endpoint</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Limit</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Window</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-white/[0.06]">
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-gray-300 text-xs"
										>/v1/josh/completions</td
									>
									<td class="px-4 py-3 text-gray-400">20 requests</td>
									<td class="px-4 py-3 text-gray-400">per minute</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-gray-300 text-xs">/v1/josh/opinions</td
									>
									<td class="px-4 py-3 text-gray-400">60 requests</td>
									<td class="px-4 py-3 text-gray-400">per minute</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-gray-300 text-xs">/v1/josh/status</td>
									<td class="px-4 py-3 text-gray-400">120 requests</td>
									<td class="px-4 py-3 text-gray-400">per minute</td>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-gray-300 text-xs">/v1/models</td>
									<td class="px-4 py-3 text-gray-400">120 requests</td>
									<td class="px-4 py-3 text-gray-400">per minute</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="rounded-xl bg-surface-100 border border-white/[0.08] p-5">
						<p class="text-sm text-gray-400 leading-relaxed">
							Rate-limited responses return
							<code
								class="px-1.5 py-0.5 rounded bg-surface-200 font-mono text-xs text-gray-300"
								>429 Too Many Requests</code
							>
							with a
							<code
								class="px-1.5 py-0.5 rounded bg-surface-200 font-mono text-xs text-gray-300"
								>Retry-After</code
							> header. If you're hitting rate limits on an API about one person, you may want to
							re-evaluate your priorities.
						</p>
					</div>
				</div>

				<!-- Errors -->
				<div id="errors">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>Errors</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<p class="text-sm text-gray-400 leading-relaxed mb-5">
						The API uses standard HTTP status codes. When things go wrong, we try to be helpful
						about it — unlike most error messages Josh has encountered in production.
					</p>

					<div class="overflow-x-auto rounded-xl border border-white/[0.08] mb-6">
						<table class="w-full text-sm text-left">
							<thead>
								<tr class="border-b border-white/[0.08] bg-surface-200/50">
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Code</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>Meaning</th
									>
									<th
										class="px-4 py-3 text-xs font-semibold uppercase tracking-widest text-gray-500"
										>When</th
									>
								</tr>
							</thead>
							<tbody class="divide-y divide-white/[0.06]">
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-emerald-400">200</td>
									<td class="px-4 py-3 text-gray-400">OK</td>
									<td class="px-4 py-3 text-gray-400"
										>Everything worked. Josh is pleased.</td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-amber-400">400</td>
									<td class="px-4 py-3 text-gray-400">Bad Request</td>
									<td class="px-4 py-3 text-gray-400"
										>Your request was malformed. Josh is judging your JSON.</td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-amber-400">429</td>
									<td class="px-4 py-3 text-gray-400">Too Many Requests</td>
									<td class="px-4 py-3 text-gray-400"
										>Rate limited. Slow down. Josh needs a break too.</td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-red-400">500</td>
									<td class="px-4 py-3 text-gray-400">Internal Server Error</td>
									<td class="px-4 py-3 text-gray-400"
										>Something broke. Josh is already looking at the logs.</td
									>
								</tr>
								<tr class="bg-surface-100/50">
									<td class="px-4 py-3 font-mono text-red-400">503</td>
									<td class="px-4 py-3 text-gray-400">Service Unavailable</td>
									<td class="px-4 py-3 text-gray-400"
										>Josh is deploying. Or napping. Hard to tell.</td
									>
								</tr>
							</tbody>
						</table>
					</div>

					<!-- Error response example -->
					<h3 class="text-sm font-semibold text-white mb-3">Error Response Format</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">400 Bad Request</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.errorResponse}</code></pre>
					</div>
				</div>

				<!-- SDKs -->
				<div id="sdks">
					<h2
						class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
					>
						<span>SDKs &amp; Libraries</span>
						<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
					</h2>
					<div class="rounded-xl bg-surface-100 border border-white/[0.08] p-5 mb-6">
						<p class="text-sm text-gray-400 leading-relaxed">
							There are no SDKs. You're on your own. Just like Josh at his first co-op.
						</p>
						<p class="text-sm text-gray-500 mt-3">
							The API is simple enough that
							<code
								class="px-1.5 py-0.5 rounded bg-surface-200 font-mono text-xs text-gray-300"
								>fetch</code
							> and a positive attitude are all you need. Here's a starter:
						</p>
					</div>

					<!-- JavaScript example -->
					<h3 class="text-sm font-semibold text-white mb-3">JavaScript / TypeScript</h3>
					<div class="rounded-xl bg-surface border border-white/[0.08] overflow-hidden">
						<div
							class="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-surface-200/30"
						>
							<span class="text-xs text-gray-500 font-mono">typescript</span>
						</div>
						<pre
							class="p-4 text-sm text-gray-300 font-mono leading-relaxed overflow-x-auto"
						><code>{code.tsExample}</code></pre>
					</div>
				</div>

				<!-- Footer -->
				<div class="pt-8 border-t border-white/[0.06]">
					<p class="text-xs text-gray-500">
						This API documentation is entirely fictional. No actual API endpoints exist at these
						URLs. If you tried to curl them, that's on you. Josh appreciates the enthusiasm.
					</p>
					<p class="text-xs text-gray-500 mt-2">
						Last updated: February 2026 &middot; API version: v1 &middot; Opinions version: always
						latest
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
