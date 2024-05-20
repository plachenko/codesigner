<script>
  import { onMount } from 'svelte';
  let midiAccess = null;
  let midiDevice = null;
  let selectedDevice = null;
  let midiFile = null;
  let midiData = null;

  onMount(async () => {
    try {
      midiAccess = await navigator.requestMIDIAccess();
    } catch (err) {
      console.error("Could not access MIDI devices", err);
    }
  });

  function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        midiFile = reader.result;
        parseMidi(midiFile);
      };
      reader.readAsArrayBuffer(file);
    }
  }

  function parseMidi(fileData) {
    const parsed = MidiConvert.parse(fileData);
    midiData = parsed.tracks.flatMap(track =>
      track.notes.map(note => ({
        message: [0x90, note.midi, note.velocity * 127],
        timestamp: note.time * 1000
      }))
    ).sort((a, b) => a.timestamp - b.timestamp);
  }

  function handleDeviceChange(event) {
    selectedDevice = event.target.value;
  }

  function playMidi() {
    if (selectedDevice && midiData) {
      const device = midiAccess.outputs.get(selectedDevice);
      if (device) {
        midiData.forEach(({ message, timestamp }) => {
          device.send(message, window.performance.now() + timestamp);
        });
        console.log("Playing MIDI on device:", device);
      }
    }
  }

  function stopMidi() {
    if (selectedDevice) {
      const device = midiAccess.outputs.get(selectedDevice);
      if (device) {
        device.send([0xFF, 0x2F, 0x00]);
        console.log("Stopped MIDI on device:", device);
      }
    }
  }
</script>
<style>
  button, select, input {
    display: block;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid black;
    font-size: 16px;
  }
</style>

<input type="file" accept=".mid" on:change="{handleFileInput}" placeholder="midi file input"/>
{#if midiAccess}
<select on:change="{handleDeviceChange}" placeholder="midi device dropdown">
  {#each midiAccess?.outputs?.values() as device}
    <option value={device.id}>{device.name}</option>
  {/each}
</select>
{/if}

<button on:click={playMidi}>playmidi</button>
<button on:click={stopMidi}>stop midi</button>
