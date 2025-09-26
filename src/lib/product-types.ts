// src/lib/product-types.ts

// This is the definitive data structure using reliable local paths.
export const products = {
  tshirt: {
    name: 'Premium Tee',
    price: 75.00,
    variants: {
      black: {
        name: 'Black',
        color: '#000000',
        mockupUrl: '/mockups/tshirt-black.jpg', // Correct local path
        printArea: { top: '25%', left: '30%', width: '40%', height: '50%' },
      },
      white: {
        name: 'White',
        color: '#FFFFFF',
        mockupUrl: '/mockups/tshirt-white.jpg', // Correct local path
        printArea: { top: '25%', left: '30%', width: '40%', height: '50%' },
      },
    },
  },
  hoodie: {
    name: 'Heavyweight Hoodie',
    price: 120.00,
    variants: {
      black: {
        name: 'Black',
        color: '#000000',
        mockupUrl: '/mockups/hoodie-black.jpg', // Correct local path
        printArea: { top: '25%', left: '30%', width: '40%', height: '45%' },
      },
      white: {
        name: 'White',
        color: '#FFFFFF',
        mockupUrl: '/mockups/hoodie-white.jpg', // Correct local path
        printArea: { top: '25%', left: '30%', width: '40%', height: '45%' },
      },
    },
  },
  hat: {
    name: 'Classic Hat',
    price: 45.00,
    variants: {
      black: {
        name: 'Black',
        color: '#000000',
        mockupUrl: '/mockups/hat-black.jpg', // Correct local path
        printArea: { top: '30%', left: '30%', width: '40%', height: '30%' },
      },
      white: {
        name: 'White',
        color: '#FFFFFF',
        mockupUrl: '/mockups/hat-white.jpg', // Correct local path
        printArea: { top: '30%', left: '30%', width: '40%', height: '30%' },
      },
    },
  },
};

export type ProductId = keyof typeof products;
export type AnyColor = typeof products[ProductId]['variants'][keyof typeof products[ProductId]['variants']];
export type ProductColor = AnyColor['name'];
