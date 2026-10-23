import { createClient } from '@supabase/supabase-js';

// Catálogo público servido desde el propio dominio, cacheado en el CDN de Vercel
const supabase = createClient(
    process.env.VITE_SUPABASE_URL || '',
    process.env.VITE_SUPABASE_ANON_KEY || ''
);

const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8'
};

export async function GET() {
    const { data, error } = await supabase.from('products').select('*').order('name');

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
    }

    return new Response(JSON.stringify(data || []), {
        status: 200,
        headers: {
            ...headers,
            'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=60'
        }
    });
}
