import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import { defineConfig } from 'astro/config';

import AutoImport from 'astro-auto-import';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import remarkSmartypants from 'remark-smartypants';

import { asideAutoImport, astroAsides } from './integrations/astro-asides';
import { astroCodeSnippets, codeSnippetAutoImport } from './integrations/astro-code-snippets';
import { sitemap } from './integrations/sitemap';
import { autolinkConfig } from './plugins/rehype-autolink-config';
import { rehypei18nAutolinkHeadings } from './plugins/rehype-i18n-autolink-headings';
import { rehypeTasklistEnhancer } from './plugins/rehype-tasklist-enhancer';
import { remarkFallbackLang } from './plugins/remark-fallback-lang';
import { theme } from './syntax-highlighting-theme';

import image from '@astrojs/image';

// https://astro.build/config
export default defineConfig({
	site: 'https://docs.oxyprops.com/',
	integrations: [
		AutoImport({
			imports: [asideAutoImport, codeSnippetAutoImport],
		}),
		preact({ compat: true }),
		sitemap(),
		astroAsides(),
		astroCodeSnippets(),
		mdx(),
		image({
			serviceEntryPoint: '@astrojs/image/sharp',
		}),
	],
	markdown: {
		syntaxHighlight: 'shiki',
		shikiConfig: { theme },
		// Override with our own config
		smartypants: false,
		remarkPlugins: [
			[remarkSmartypants, { dashes: false }],
			// Add our custom plugin that marks links to fallback language pages
			remarkFallbackLang(),
		],
		rehypePlugins: [
			rehypeSlug,
			// This adds links to headings
			[rehypeAutolinkHeadings, autolinkConfig],
			// Tweak GFM task list syntax
			rehypeTasklistEnhancer(),
			// Translates the autolink headings anchors
			rehypei18nAutolinkHeadings(),
		],
	},
});
