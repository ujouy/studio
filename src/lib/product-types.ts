
export type ProductId = 'tshirt' | 'hoodie' | 'hat';
export type ProductColor = 'Black' | 'White' | 'Gray';

export const productTypes = [
  { 
    id: 'tshirt' as ProductId, name: 'T-Shirt', price: 75,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: '/mockups/tshirt-black.png', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: '/mockups/tshirt-white.png', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: '/mockups/tshirt-gray.png', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
    ],
  },
  { 
    id: 'hoodie' as ProductId, name: 'Hoodie', price: 120,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: '/mockups/hoodie-black.png', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: '/mockups/hoodie-white.png', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: '/mockups/hoodie-gray.png', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
    ],
  },
  { 
    id: 'hat' as ProductId, name: 'Hat', price: 45,
    colors: [
        { name: 'Black' as ProductColor, color: '#000000', mockupUrl: '/mockups/hat-black.png', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
        { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: '/mockups/hat-white.png', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
    ],
  },
];
