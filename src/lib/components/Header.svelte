<script lang="ts">
	import { page } from '$app/stores';

	let scrolled = $state(false);
	let mobileOpen = $state(false);

	const navItems = [
		{ label: 'Chat', href: '/chat' },
		{ label: 'Docs', href: '/docs' },
		{ label: 'Pricing', href: '/pricing' },
		{ label: 'About', href: '/about' },
		{ label: 'Changelog', href: '/changelog' },
		{ label: 'Analytics', href: '/analytics' }
	];

	function getHref(item: { href: string }): string {
		return item.href;
	}

	function isActive(item: { href: string }): boolean {
		return $page.url.pathname === item.href;
	}

	function handleNav() {
		mobileOpen = false;
	}

	function handleScroll() {
		scrolled = window.scrollY > 20;
	}
</script>

<svelte:window onscroll={handleScroll} />

<header
	class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 {scrolled
		? 'bg-surface/80 border-b border-white/[0.08] shadow-lg shadow-black/10 header-blur'
		: 'border-b border-transparent'}"
>
	<nav class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between" aria-label="Main navigation">
		<!-- Brand -->
		<a
			href="/"
			class="text-sm font-semibold text-white tracking-tight hover:text-violet-300 transition-colors duration-200"
		>
			josh-bot
		</a>

		<!-- Desktop nav -->
		<div class="hidden sm:flex items-center gap-1">
			{#each navItems as item}
				<a
					href={getHref(item)}
					class="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 {isActive(item) ? 'text-white bg-white/[0.06]' : ''}"
				>
					{item.label}
				</a>
			{/each}
		</div>

		<!-- Mobile hamburger -->
		<button
			class="sm:hidden relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
			onclick={() => (mobileOpen = !mobileOpen)}
			aria-expanded={mobileOpen}
			aria-controls="mobile-nav"
			aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
		>
			<svg
				class="w-5 h-5 transition-transform duration-200 {mobileOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'} absolute"
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
			<svg
				class="w-5 h-5 transition-transform duration-200 {mobileOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'} absolute"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<path d="M18 6 6 18" />
				<path d="m6 6 12 12" />
			</svg>
		</button>
	</nav>

	<!-- Mobile dropdown -->
	{#if mobileOpen}
		<div
			id="mobile-nav"
			class="sm:hidden border-t border-white/[0.06] bg-surface/95 header-blur animate-slide-up"
		>
			<div class="px-6 py-4 flex flex-col gap-1">
				{#each navItems as item}
					<a
						href={getHref(item)}
						onclick={handleNav}
						class="px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200 {isActive(item) ? 'text-white bg-white/[0.06]' : ''}"
					>
						{item.label}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</header>

<!-- Skip to content (accessibility) -->
<a
	href="/chat"
	class="sr-only focus:not-sr-only focus:fixed focus:top-20 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-violet-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
>
	Skip to chat
</a>

<style>
	.header-blur {
		-webkit-backdrop-filter: blur(24px);
		backdrop-filter: blur(24px);
	}
</style>
