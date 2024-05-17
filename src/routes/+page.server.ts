import { OPENAI_KEY } from '$env/static/private';
import type { Actions, PageLoad } from '@sveltejs/kit';
import OpenAI from 'openai';

let openai: OpenAI | null;

/*
export const load: PageLoad = ({ params }) => {
  openai = new OpenAI({
    dangerouslyAllowBrowser: true,
    apiKey: OPENAI_KEY
  });
  return {openai: JSON.stringify(openai)};
}
*/


export const actions: Actions = {
  submit: async ({ request }) => {

  }
}
