<script lang="ts">
	import DLInput from './DLInput.svelte';
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let {
        popoverOpenEvt
    } : {
        popoverOpenEvt: () => void
    } = $props();


    let settingsPopover: HTMLDivElement;
	const programmingLanguages = [
		'JavaScript',
		'Python',
		'Java',
		'C++',
		'C#',
		'Ruby',
		'Go',
		'PHP',
		'Swift',
		'TypeScript',
		'Kotlin',
		'Rust',
		'Scala',
		'Perl',
		'R',
		'Objective-C',
		'Haskell',
		'Lua',
		'Elixir',
		'Clojure'
	];

	const javascriptFrameworks = [
		'React',
		'Angular',
		'Vue.js',
		'Ember.js',
		'Svelte',
		'Backbone.js',
		'Next.js',
		'Nuxt.js',
		'Meteor',
		'Express.js'
	];

    function githubLoginHandler(): void {
        console.log('github login');
        goto('/auth/login');
    }

    onMount(() => {
        // settingsPopover.togglePopover('open');
        /*
        settingsPopover.addEventListener('beforetoggle', (e: ToggleEvent): void => {
            popoverOpenEvt(e.newState == 'open');
        });
        */
    });
</script>

<button popovertarget="settingsPopover">settings</button>
<!--

<div id="settingsPopover" popover>
    <DLInput input={programmingLanguages} />
</div>
-->
<div
    bind:this={settingsPopover}
    popover
	id="settingsPopover"
	class="
    w-[90%]
    h-[90%]
    rounded-md
    border-2
    border-slate-300
    shadow-md
    p-3
    flex
    flex-col
    gap-2
    ">
    <div
        class="
        border-b-2
        border-slate-500
        border-dashed
        pb-2
        ">
        <button
            onclick={githubLoginHandler}
            class="
            enabled:bg-slate-600
            enabled:hover:bg-slate-500
            btn
            variant-filled
            flex
            gap-2
            items-center
            w-full
            justify-center
            ">
            <img src="github-mark-white.svg" class="size-6" alt="github logo" />
            <span
                class="
                flex-1
                border-l-2
                ml-2
                ">
                Login with GitHub
            </span>
        </button>
    </div>
	<div
        class="
        flex
        gap-2
        flex-col
        ">
		<DLInput input={programmingLanguages} />
	</div>
</div>

<style>
	#settingsPopover::backdrop {
		@starting-style {
			opacity: 0;
		}
		background-color: #000;
		opacity: 0.6;
		transition:
			opacity 0.3s,
			display 0.3s allow-discrete;
	}

	#settingsPopover {
		&:popover-open {
			@starting-style {
				transform: translateY(10px);
				opacity: 0;
			}

			transform: translateY(0);
			opacity: 1;
		}

		transform: translateY(10px);
		opacity: 0;

		transition:
			transform 0.3s,
			opacity 0.3s,
			display 0.3s allow-discrete;
	}
</style>
