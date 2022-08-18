export async function onRequest({ env, params }) {
  const res = await env.pplan.get(params.name);
  
  return new Response(res);
}
