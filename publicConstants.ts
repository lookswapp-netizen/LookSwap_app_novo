import type { Option } from './types';

export const PERSONA_OPTIONS: Option[] = [
  { id: 'p1', label: 'Loira (pele clara)' },
  { id: 'p2', label: 'Morena Clara' },
  { id: 'p3', label: 'Morena Média' },
  { id: 'p4', label: 'Morena Escura' },
  { id: 'p5', label: 'Negra' },
  { id: 'p6', label: 'Asiática/Oriental' },
];

export const HAIR_OPTIONS: Option[] = [
  { id: 'h1', label: 'Liso Longo' },
  { id: 'h2', label: 'Liso Curto' },
  { id: 'h3', label: 'Ondulado Médio' },
  { id: 'h4', label: 'Cacheado Volumoso' },
  { id: 'h5', label: 'Afro Black' },
  { id: 'h6', label: 'Coque Elegante' },
  { id: 'h7', label: 'Rabo de Cavalo' },
  { id: 'h8', label: 'Tranças Longas' },
  { id: 'h9', label: 'Ruivo' },
  { id: 'h10', label: 'Castanho Claro' },
  { id: 'h11', label: 'Castanho Escuro' },
  { id: 'h12', label: 'Loiro Dourado' },
];

export const ENVIRONMENT_OPTIONS: Option[] = [
  { id: 'e1', label: 'Quarto Luxuoso Moderno' },
  { id: 'e2', label: 'Quarto Tumblr Rosa' },
  { id: 'e3', label: 'Closet Minimalista' },
  { id: 'e4', label: 'Decoração Nórdica' },
  { id: 'e5', label: 'Estúdio Fotográfico Branco' },
  { id: 'e6', label: 'Estúdio Industrial Urbano' },
  { id: 'e7', label: 'Banheiro de Luxo' },
  { id: 'e8', label: 'Sala Moderna' },
  { id: 'e9', label: 'Jardim' },
  { id: 'e10', label: 'Varanda Externa' },
  { id: 'e11', label: 'Rua Urbana' },
  { id: 'e12', label: 'Cena Noturna com Luzes' },
  { id: 'e13', label: 'Quarto com LEDs' },
  { id: 'e14', label: 'Ambiente Noturno com Neon' },
];

export const LIGHTING_OPTIONS: Option[] = [
  { id: 'l1', label: 'Luz Natural' },
  { id: 'l2', label: 'Golden Hour' },
  { id: 'l3', label: 'Branca Fria' },
  { id: 'l4', label: 'Quente Aconchegante' },
  { id: 'l5', label: 'Softbox Editorial' },
  { id: 'l6', label: 'Cinematic Lighting' },
  { id: 'l7', label: 'Iluminação Noturna' },
  { id: 'l8', label: 'Neon Lighting' },
];

export const PHONE_MODE_OPTIONS: Option[] = [
    { id: 'pm1', label: 'Segurando smartphone' },
    { id: 'pm2', label: 'Sem telefone' },
    { id: 'pm3', label: 'Mãos livres, posando' },
    { id: 'pm4', label: 'Mão no bolso' },
];

export const ACCESSORY_OPTIONS: Option[] = [
    { id: 'a1', label: 'Nenhum (clean)' },
    { id: 'a2', label: 'Bolsa de ombro' },
    { id: 'a3', label: 'Bolsa de mão' },
    { id: 'a4', label: 'Pulseira' },
    { id: 'a5', label: 'Relógio' },
    { id: 'a6', label: 'Colar discreto' },
    { id: 'a7', label: 'Chapéu estiloso' },
    { id: 'a8', label: 'Boné' },
    { id: 'a9', label: 'Chapéu bucket' },
    { id: 'a10', label: 'Boina elegante' },
];

export const MIRROR_INTERACTION_OPTIONS: Option[] = [
    { id: 'mi1', label: 'Corpo inteiro no espelho' },
    { id: 'mi2', label: 'Meio corpo no espelho' },
    { id: 'mi3', label: 'Olhando para o espelho (sem celular)' },
    { id: 'mi4', label: 'De costas com reflexo' },
    { id: 'mi5', label: 'Ângulo lateral' },
    { id: 'mi6', label: 'Selfie com celular baixo' },
];

export const POSTURE_OPTIONS: Option[] = [
    { id: 'po1', label: 'Pose de influencer' },
    { id: 'po2', label: 'Confiante' },
    { id: 'po3', label: 'Casual/Relaxada' },
    { id: 'po4', label: 'Mãos no quadril' },
    { id: 'po5', label: 'Mão na cintura' },
    { id: 'po6', label: 'Perna à frente' },
];

export const ASPECT_RATIO_OPTIONS: Option[] = [
    { id: 'ar1', label: '9:16 (Vertical)' },
    { id: 'ar2', label: '16:9 (Horizontal)' },
];


export const ENVIRONMENT_LIGHTING_MAP: Record<string, string> = {
  e1: 'l4', e2: 'l4', e3: 'l3', e4: 'l1', e5: 'l5', e6: 'l6',
  e7: 'l4', e8: 'l1', e9: 'l1', e10: 'l2', e11: 'l1', e12: 'l7',
  e13: 'l8', e14: 'l8',
};