export type BlockCategory =
    | 'motion'
    | 'looks'
    | 'sound'
    | 'events'
    | 'control'
    | 'sensing'
    | 'operators'
    | 'variables'
    | 'myblocks';

export interface BlockCategoryInfo {
    id: BlockCategory;
    name: string;
    color: string;
    secondaryColor: string;
    icon?: string;
}

export const BLOCK_CATEGORIES: BlockCategoryInfo[] = [
    { id: 'motion', name: 'Движение', color: '#4C97FF', secondaryColor: '#3373CC' },
    { id: 'looks', name: 'Внешний вид', color: '#9966FF', secondaryColor: '#774DCB' },
    { id: 'sound', name: 'Звук', color: '#CF63CF', secondaryColor: '#BD42BD' },
    { id: 'events', name: 'События', color: '#FFBF00', secondaryColor: '#CC9900' },
    { id: 'control', name: 'Управление', color: '#FFAB19', secondaryColor: '#CF8B17' },
    { id: 'sensing', name: 'Сенсоры', color: '#5CB1D6', secondaryColor: '#2E8EB8' },
    { id: 'operators', name: 'Операторы', color: '#59C059', secondaryColor: '#389438' },
    { id: 'variables', name: 'Переменные', color: '#FF8C1A', secondaryColor: '#DB6E00' },
    { id: 'myblocks', name: 'Другие блоки', color: '#FF6680', secondaryColor: '#FF3355' },
];