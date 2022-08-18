export async function onRequest({ env}) {
	const res = await env.pplan.list();
	
	return new Response(JSON.stringify(res.keys.map(k => k.name)));
}