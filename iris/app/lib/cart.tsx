'use client';

import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { Product } from './products';

export type CartItem = {
	productId: string;
	title: string;
	price: number;
	image?: string;
	size?: number;
	quantity: number;
	slug: string;
};

export type CartState = {
	items: CartItem[];
};

type AddPayload = { product: Product; quantity?: number; size?: number };

type CartAction =
	| { type: 'ADD_ITEM'; payload: AddPayload }
	| { type: 'REMOVE_ITEM'; payload: { productId: string; size?: number } }
	| { type: 'SET_QUANTITY'; payload: { productId: string; size?: number; quantity: number } }
	| { type: 'CLEAR' }
	| { type: 'LOAD'; payload: CartState };

const CartContext = createContext<{
	state: CartState;
	addItem: (payload: AddPayload) => void;
	removeItem: (productId: string, size?: number) => void;
	setQuantity: (productId: string, quantity: number, size?: number) => void;
	clear: () => void;
	totalItems: number;
	totalPrice: number;
} | null>(null);

const STORAGE_KEY = 'iris_cart_v1';

function cartReducer(state: CartState, action: CartAction): CartState {
	switch (action.type) {
		case 'LOAD':
			return action.payload;
		case 'ADD_ITEM': {
			const { product, quantity = 1, size } = action.payload;
			// Utiliser l'ID Airtable comme productId pour les liaisons
			const existingIndex = state.items.findIndex(
				(i) => i.productId === product.id && i.size === size,
			);
			if (existingIndex >= 0) {
				const items = state.items.slice();
				items[existingIndex] = {
					...items[existingIndex],
					quantity: items[existingIndex].quantity + quantity,
				};
				return { items };
			}
			return {
				items: [
					...state.items,
					{
						productId: product.id, // ID Airtable pour les liaisons
						title: product.title, // Titre pour l'affichage
						price: product.price,
						image: product.images[0],
						size,
						quantity,
						slug: product.slug,
					},
				],
			};
		}
		case 'REMOVE_ITEM': {
			const { productId, size } = action.payload;
			return {
				items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
			};
		}
		case 'SET_QUANTITY': {
			const { productId, size, quantity } = action.payload;
			if (quantity <= 0) {
				return {
					items: state.items.filter((i) => !(i.productId === productId && i.size === size)),
				};
			}
			return {
				items: state.items.map((i) =>
					i.productId === productId && i.size === size ? { ...i, quantity } : i,
				),
			};
		}
		case 'CLEAR':
			return { items: [] };
		default:
			return state;
	}
}

export function CartProvider({ children }: { children: React.ReactNode }) {
	const [state, dispatch] = useReducer(cartReducer, { items: [] });

	useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw) as CartState;
				dispatch({ type: 'LOAD', payload: parsed });
			}
		} catch {}
	}, []);

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {}
	}, [state]);

	const addItem = (payload: AddPayload) => dispatch({ type: 'ADD_ITEM', payload });
	const removeItem = (productId: string, size?: number) =>
		dispatch({ type: 'REMOVE_ITEM', payload: { productId, size } });
	const setQuantity = (productId: string, quantity: number, size?: number) =>
		dispatch({ type: 'SET_QUANTITY', payload: { productId, size, quantity } });
	const clear = () => dispatch({ type: 'CLEAR' });

	const totalItems = useMemo(
		() => state.items.reduce((sum, i) => sum + i.quantity, 0),
		[state],
	);
	const totalPrice = useMemo(
		() => state.items.reduce((sum, i) => sum + i.quantity * i.price, 0),
		[state],
	);

	return (
		<CartContext.Provider
			value={{ state, addItem, removeItem, setQuantity, clear, totalItems, totalPrice }}
		>
			{children}
		</CartContext.Provider>
	);
}

export function useCart() {
	const ctx = useContext(CartContext);
	if (!ctx) throw new Error('useCart must be used within CartProvider');
	return ctx;
} 