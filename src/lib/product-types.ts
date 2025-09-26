
export type ProductId = 'tshirt' | 'hoodie' | 'hat';
export type ProductColor = 'Black' | 'White' | 'Gray';

export const productTypes = [
  { 
    id: 'tshirt' as ProductId, name: 'T-Shirt', price: 75,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://picsum.photos/seed/tshirt-black/800/800', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://picsum.photos/seed/tshirt-white/800/800', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: 'https://picsum.photos/seed/tshirt-gray/800/800', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
    ],
  },
  { 
    id: 'hoodie' as ProductId, name: 'Hoodie', price: 120,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://picsum.photos/seed/hoodie-black/800/800', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://picsum.photos/seed/hoodie-white/800/800', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: 'https://picsum.photos/seed/hoodie-gray/800/800', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
    ],
  },
  { 
    id: 'hat' as ProductId, name: 'Hat', price: 45,
    colors: [
        { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://picsum.photos/seed/hat-black/800/800', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
        { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://picsum.photos/seed/hat-white/800/800', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
    ],
  },
];
