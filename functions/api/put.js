export async function onRequest({ env, request }) {
  const searchParams = new URL(request.url).searchParams;
  const { key, value } = Object.fromEntries(searchParams.entries());

  if (!key || !value)
    return new Response(`400: key or value unspecified`, { status: 400 });

  if (value === "[]") {
    await env.pplan.delete(key);
    return new Response(`deleted ${key}`);
  }
  else {
    await env.pplan.put(key, value);
    return new Response(`${key} = ${value}`);
  }
}
