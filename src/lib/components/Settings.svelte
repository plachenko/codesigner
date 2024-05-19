<script lang="ts">
  import DLInput from "./DLInput.svelte";
  const programmingLanguages = [
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "Go",
    "PHP",
    "Swift",
    "TypeScript",
    "Kotlin",
    "Rust",
    "Scala",
    "Perl",
    "R",
    "Objective-C",
    "Haskell",
    "Lua",
    "Elixir",
    "Clojure"
];

const javascriptFrameworks = [
  "React",
  "Angular",
  "Vue.js",
  "Ember.js",
  "Svelte",
  "Backbone.js",
  "Next.js",
  "Nuxt.js",
  "Meteor",
  "Express.js"
];

</script>
<button popovertarget="settingsPopover">settings</button>

<div
  id="settingsPopover"
  popover
  class="w-[90%] h-[90%] rounded-md border-2 border-slate-300 shadow-md p-3"
>

<div class="flex gap-2 flex-col">

  <DLInput input={ programmingLanguages } />
  <DLInput input={ programmingLanguages } />
</div>
</div>

<style>
  	button {
		padding: 10px 20px;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		font-size: 16px;
		cursor: pointer;
	}

	button:hover {
		background-color: #0056b3;
	}

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
