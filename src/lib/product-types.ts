export type ProductId = 'tshirt' | 'hoodie' | 'hat';
export type ProductColor = 'Black' | 'White' | 'Gray';

export const productTypes = [
  { 
    id: 'tshirt' as ProductId, name: 'T-Shirt', price: 75,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxtb2RlbCUyMHRzaGlydHxlbnwwfHx8fDE3NTg5MzY0MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://images.unsplash.com/photo-1598032895397-b9472444bf20?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', printArea: { top: '25%', left: '32.5%', width: '35%', height: '40%' } },
    ],
  },
  { 
    id: 'hoodie' as ProductId, name: 'Hoodie', price: 120,
    colors: [
      { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://images.unsplash.com/photo-1556108924-d2e33f0f7ade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxob29kaWUlMjBtb2RlbHxlbnwwfHx8fDE3NTg5MzY1MTN8MA&ixlib=rb-4.1.0&q=80&w=1080', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://images.unsplash.com/photo-1620799140408-edc6d5f93504?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
      { name: 'Gray' as ProductColor, color: '#808080', mockupUrl: 'https://images.unsplash.com/photo-1556434417-a46f043944a9?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', printArea: { top: '28%', left: '35%', width: '30%', height: '35%' } },
    ],
  },
  { 
    id: 'hat' as ProductId, name: 'Hat', price: 45,
    colors: [
        { name: 'Black' as ProductColor, color: '#000000', mockupUrl: 'https://images.unsplash.com/photo-1534215754734-18e3d14e10e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxiYXNlYmFsbCUyMGNhcCUyMGZsYXQlMjBsYXl8ZW58MHx8fHwxNzU4OTM2NTgwfDA&ixlib=rb-4.1.0&q=80&w=1080', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
        { name: 'White' as ProductColor, color: '#FFFFFF', mockupUrl: 'https://images.unsplash.com/photo-1588850563403-34b7f8fac67b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', printArea: { top: '35%', left: '30%', width: '40%', height: '25%' } },
    ],
  },
];
