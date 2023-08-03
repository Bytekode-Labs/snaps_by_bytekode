import { OnRpcRequestHandler } from '@metamask/snaps-types';
import { panel, text,  } from '@metamask/snaps-ui';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.origin - The origin of the request, e.g., the website that
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */

export const onRpcRequest: OnRpcRequestHandler = async ({ origin, request }) => {
  switch (request.method) {
    case 'hello':
      // @ts-ignore
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })
      let command = ``
      const result = await snap.request({
        method: 'snap_dialog',
        params: {
          type: 'prompt',
          content: panel([
            text(`Hello, **${origin}**! ${chainId}`),
            text(`What do you want to do?`)
          ]),
          placeholder:`Send 0.005 eth to shlok28.eth`
        },
      });
      if(result){
        const res = await fetch('https://intents-api.onrender.com/intents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            chainId: parseInt(chainId).toString(),
            command: result,
            recipient: `0x`
          })
        })
        const ans = await res.json()
        return ans.info.txObject
      }
    default:
      throw new Error('Method not found.');
  }
};
