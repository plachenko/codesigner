<script lang="ts">
    import LoadButton from "./LoadButton.svelte";
    import { connect } from '../OpenAI';

	let {
            connectHandler,
            key
        } : {
            connectHandler: (key: string) => void,
            key: string
        } = $props();

    let loading = $state(false);

    function sendHandler() {
        loading = true;
        connect(key).then((e) => {
            connectHandler(key);
        }).catch((err) => {
            key = '';
            console.log('no', err);
        }).finally(() => {
            setTimeout(() => {
                loading = false;
            }, 1000);
        })
    }
</script>

<div
    class='
    flex
    flex-1
    justify-center
    items-center
    '>
    <div
        class="
        flex
        w-[600px]
        bg-slate-400/30
        border-2
        border-slate-400
        p-4
        rounded-md
        justify-center"
        >
        <div
            class="
            w-full
            gap-2
            flex
            flex-col
            justify-center
            ">
            <div
                class="
                text-center
                bg-slate-200
                border-2
                rounded-md
                text-slate-500
                p-3
                border-slate-400
                ">
                <p>
                    This is a design tool to help you generate code given a prompt and a design using the OpenAI
                    Vision API as well as the ChatGPT-4o model.
                </p>
                <br />
                <p
                    class="
                    border-t-2
                    border-slate-300
                    border-dashed
                    pt-4
                    ">
                    Please make sure you have an
                    <a
                        class="underline underline-offset-2 font-bold"
                        href="https://platform.openai.com/account/api-keys"
                        target="_blank">
                        OpenAI API key
                    </a>
                </p>
            </div>
            <input
                type="password"
                placeholder="Enter an OpenAI API Key"
                bind:value={key}
            />
            <LoadButton
                btnDisabled={key == ''}
                loadText={ 'Connect' }
                { loading }
                { sendHandler }
            />
        </div>
    </div>

</div>
