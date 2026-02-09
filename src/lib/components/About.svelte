<script lang="ts">
	const skills = [
		'TypeScript',
		'JavaScript',
		'React',
		'Next.js',
		'NestJS',
		'Java',
		'Spring Boot',
		'Python',
		'Django',
		'PostgreSQL',
		'SQL',
		'Kafka',
		'Event-Driven Systems',
		'API Design',
		'AWS',
		'Docker',
		'Terraform',
		'Cloudflare',
		'Vercel',
		'CI/CD',
		'GitHub Actions',
		'OpenTelemetry',
		'Grafana',
		'System Design',
		'Microservices'
	];

	const experience = [
		{
			title: 'Senior Full-Stack Engineer',
			company: 'Kroger',
			period: '2024 – Present',
			description:
				'Pharmacy enablement systems serving 2,500+ locations. Drove a system redesign reducing release-day incidents by 90%. Cloud-based document management, compliance, on-call operations. Mentoring across TypeScript, Node.js, and Java.'
		},
		{
			title: 'Full-Stack Software Developer',
			company: 'VNDLY (acquired by Workday)',
			period: '2019 – 2021',
			description:
				'Core SaaS product features — invoicing, timesheets, billing workflows for 30+ enterprise customers. Owned billing abstractions handling prorations, tiered pricing, and client-specific rules. TypeScript, React, Python, Django, PostgreSQL.'
		},
		{
			title: 'Software Engineer',
			company: 'Kroger',
			period: '2014 – 2019',
			description:
				'High-throughput eCommerce backend services. Event-driven Kafka pipelines processing millions of events/day. Led Microservices Guild. Standardized event schemas and API contracts across teams. Java, Spring Boot, Cassandra.'
		}
	];

	const links = [
		{
			label: 'GitHub',
			href: 'https://github.com/hutfut',
			icon: 'github'
		},
		{
			label: 'LinkedIn',
			href: 'https://linkedin.com/in/the-josh-myers',
			icon: 'linkedin'
		},
		{
			label: 'Email',
			href: 'mailto:the.josh.myers@gmail.com',
			icon: 'email'
		}
	];
</script>

<section id="about" class="relative py-24 px-4 bg-surface-50" aria-label="About Josh Myers">
	<div class="max-w-3xl mx-auto">
		<!-- Header -->
		<div class="mb-16">
			<h2 class="text-3xl sm:text-4xl font-bold text-white mb-3">Josh Myers</h2>
			<p class="text-lg text-gray-400">
				Senior Full-Stack / Product Engineer &middot; Cincinnati, OH (Remote)
			</p>
			<p class="text-sm text-gray-400 mt-3 max-w-2xl leading-relaxed">
				Senior Product Engineer owning systems end to end, from problem framing through
				production operations. 8+ years across SaaS, healthcare, and eCommerce. Focused on
				craft, judgment, and ownership.
			</p>
		</div>

		<!-- Skills -->
		<div class="mb-16">
			<h3
				class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
			>
				<span>Technical Skills</span>
				<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
			</h3>
			<div class="flex flex-wrap gap-2" role="list" aria-label="Technical skills">
				{#each skills as skill}
					<span
						role="listitem"
						class="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300"
					>
						{skill}
					</span>
				{/each}
			</div>
		</div>

		<!-- Experience -->
		<div class="mb-16">
			<h3
				class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-8 flex items-center gap-3"
			>
				<span>Experience</span>
				<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
			</h3>
			<div class="space-y-10">
				{#each experience as job}
					<div class="relative pl-7 border-l border-white/[0.08]">
						<div
							class="absolute -left-[5px] top-[6px] w-[10px] h-[10px] rounded-full bg-violet-500 ring-4 ring-surface-50"
							aria-hidden="true"
						></div>
						<h4 class="text-lg font-semibold text-white">{job.title}</h4>
						<p class="text-sm text-violet-400 mt-0.5 mb-2.5 font-medium">
							{job.company} &middot; {job.period}
						</p>
						<p class="text-sm text-gray-400 leading-relaxed">{job.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Links -->
		<div>
			<h3
				class="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-5 flex items-center gap-3"
			>
				<span>Connect</span>
				<span class="flex-1 h-px bg-white/[0.06]" aria-hidden="true"></span>
			</h3>
			<nav class="flex flex-wrap gap-3" aria-label="Social links">
				{#each links as link}
					<a
						href={link.href}
						target={link.href.startsWith('mailto') ? undefined : '_blank'}
						rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
						class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-sm text-gray-300 hover:bg-white/[0.08] hover:border-white/[0.15] hover:text-white transition-all duration-200"
					>
						{#if link.icon === 'github'}
							<svg
								class="w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
								/>
							</svg>
						{:else if link.icon === 'linkedin'}
							<svg
								class="w-4 h-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="currentColor"
								aria-hidden="true"
							>
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
						{:else if link.icon === 'email'}
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
								<rect width="20" height="16" x="2" y="4" rx="2" />
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
							</svg>
						{/if}
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		<!-- Footer -->
		<div class="mt-20 pt-8 border-t border-white/[0.06] text-center">
			<p class="text-xs text-gray-500">
				Built with SvelteKit, Tailwind CSS, and a concerning amount of self-awareness.
				<a
					href="https://github.com/hutfut/josh-bot"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:text-gray-400 transition-colors"
				>
					View source
				</a>
			</p>
		</div>
	</div>
</section>
