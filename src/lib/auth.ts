import type { RequestEvent } from "@sveltejs/kit";
import axios from 'axios'

export const checkAuthExternally = async ({request}: RequestEvent) => {
  const authHeader = request.headers.get('authorization')
  console.log(request.headers)

}

