import {
  T3nClient,
  createEthAuthInput,
  eth_get_address,
  fetchTrustedManifest,
  loadWasmComponent,
  metamask_sign,
  setEnvironment
} from "@terminal3/t3n-sdk";

const apiKey = process.env.T3N_API_KEY;

if (!apiKey) {
  throw new Error("T3N_API_KEY is required. Add it to .env.local or set it in the shell; do not place it in source files.");
}

setEnvironment("sandbox");
const address = eth_get_address(apiKey);
const client = new T3nClient({
  trustAnchor: await fetchTrustedManifest("sandbox"),
  wasmComponent: await loadWasmComponent(),
  handlers: {
    EthSign: metamask_sign(address, undefined, apiKey)
  }
});

await client.handshake();
const did = await client.authenticate(createEthAuthInput(address));
const usage = await client.getUsage();

console.log(
  JSON.stringify(
    {
      environment: "sandbox",
      tenantDid: did.value,
      creditsAvailable: usage.balance.available
    },
    null,
    2
  )
);

