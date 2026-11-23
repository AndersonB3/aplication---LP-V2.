-- 
-- ISIBA Platform - Setup do Supabase
-- Execute este SQL no Supabase SQL Editor
-- ═══════════════════════════════

-- Tabela: configuracoes_site
CREATE TABLE IF NOT EXISTS configuracoes_site (
    id            TEXT PRIMARY KEY,
    valor         TEXT,
    descricao     TEXT,
    atualizado_em TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE configuracoes_site ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_config" ON configuracoes_site FOR SELECT USING (true);

INSERT INTO configuracoes_site (id, valor, descricao) VALUES
    ('stat_atendimentos',   '250000',                                         'Card: Atendimentos Realizados'),
    ('stat_unidades',       '12',                                             'Card: Unidades Geridas'),
    ('stat_profissionais',  '850',                                            'Card: Profissionais de Saude'),
    ('stat_satisfacao',     '98',                                             'Card: Satisfacao dos Usuarios (%)'),
    ('relatorio_subtitulo', 'Transparencia',                                  'Secao relatorio: subtitulo'),
    ('relatorio_titulo',    'Relatorio Anual de Atendimentos',                'Secao relatorio: titulo'),
    ('relatorio_descricao', 'Confira os numeros que refletem nosso compromisso com a saude publica.', 'Secao relatorio: descricao')
ON CONFLICT (id) DO NOTHING;

-- Tabela: unidades
CREATE TABLE IF NOT EXISTS unidades (
    id   TEXT PRIMARY KEY,
    nome TEXT NOT NULL
);

ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_unidades" ON unidades FOR SELECT USING (true);

INSERT INTO unidades (id, nome) VALUES
    ('gleba-a',            'UPA Gleba A'),
    ('lucas-evangelista',  'UPA Lucas Evangelista')
ON CONFLICT (id) DO NOTHING;

-- Tabela: relatorios_mensais
CREATE TABLE IF NOT EXISTS relatorios_mensais (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidade_id      TEXT REFERENCES unidades(id),
    ano             INTEGER NOT NULL,
    mes             INTEGER NOT NULL CHECK (mes BETWEEN 1 AND 12),
    atendimentos    INTEGER NOT NULL DEFAULT 0,
    satisfacao      NUMERIC(5,2) NOT NULL DEFAULT 0,
    faixa_0_12      INTEGER DEFAULT 0,
    faixa_13_17     INTEGER DEFAULT 0,
    faixa_18_29     INTEGER DEFAULT 0,
    faixa_30_44     INTEGER DEFAULT 0,
    faixa_45_59     INTEGER DEFAULT 0,
    faixa_60_mais   INTEGER DEFAULT 0,
    tempo_pouco_urg NUMERIC(5,1) DEFAULT 0,
    tempo_nao_urg   NUMERIC(5,1) DEFAULT 0,
    tempo_eletivo   NUMERIC(5,1) DEFAULT 0,
    criado_em       TIMESTAMPTZ DEFAULT now(),
    UNIQUE(unidade_id, ano, mes)
);

ALTER TABLE relatorios_mensais ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_relatorios" ON relatorios_mensais FOR SELECT USING (true);

-- Index para buscas por unidade e periodo
CREATE INDEX IF NOT EXISTS idx_relatorios_unidade_periodo
    ON relatorios_mensais(unidade_id, ano, mes);

-- Tabela: noticias
CREATE TABLE IF NOT EXISTS noticias (
    id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    titulo       TEXT NOT NULL,
    resumo       TEXT,
    conteudo     TEXT NOT NULL,
    imagem_url   TEXT,
    video_url    TEXT,
    categoria    TEXT,
    publicado_em TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE noticias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leitura_publica_noticias" ON noticias FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_noticias_publicado_em ON noticias(publicado_em DESC);

-- Exemplo de insercao de uma noticia (edite e rode no SQL Editor sempre que quiser publicar uma nova):
-- INSERT INTO noticias (titulo, resumo, conteudo, imagem_url, video_url, categoria) VALUES (
--     'Titulo da noticia',
--     'Resumo curto que aparece no card da listagem',
--     'Texto completo da noticia. Pode ter varios paragrafos, separados por uma linha em branco.',
--     'https://<seu-projeto>.supabase.co/storage/v1/object/public/noticias/capa.jpg',
--     NULL,
--     'Institucional'
-- );

-- Storage (OPCIONAL): bucket publico para hospedar as imagens das noticias.
-- Recomendado porque o CSP do site (next.config.ts) ja libera o dominio do
-- Supabase em img-src -- ou seja, subindo a imagem em Storage > noticias
-- (dashboard) e colando a URL publica em imagem_url, ela aparece sem
-- precisar mexer em nenhuma config. Se preferir hospedar em outro lugar,
-- pode colar qualquer URL de imagem em imagem_url, mas nesse caso avise o
-- desenvolvedor para liberar o dominio no CSP.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('noticias', 'noticias', true)
-- ON CONFLICT (id) DO NOTHING;
-- CREATE POLICY "leitura_publica_noticias_storage" ON storage.objects FOR SELECT USING (bucket_id = 'noticias');