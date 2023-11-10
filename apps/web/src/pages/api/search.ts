import { Client } from '@elastic/elasticsearch'
import { NextApiRequest, NextApiResponse } from 'next'

const client = new Client({
  node: process.env.ES_NODE_URL,
  auth: {
    apiKey: process.env.ES_API_KEY,
  },
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Invalid method')
  }

  try {
    return res.status(200).json(await client.search(req.body))
  } catch (err) {
    // eslint-disable-next-line no-console
    const error = (err as unknown as any)?.meta?.body?.error?.root_cause?.[0]?.reason
    // eslint-disable-next-line no-console
    console.log('Error searching ES', error)
    return res.status(error?.includes('no such index') ? 404 : 500).send('Error searching price data, please try again')
  }
}
