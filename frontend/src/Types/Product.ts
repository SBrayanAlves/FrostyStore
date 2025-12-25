export interface ProductImage {
    id: string;
    product: string;
    image: string;
    created_at: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    condition: string;
    brand_name: string;
    images: ProductImage[];
}

export type { Product };