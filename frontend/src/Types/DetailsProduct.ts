interface DetailsProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    description: string;
    voltage: string;
    condition: string;
    active: boolean;
    seller_name: string;
    category_name: string;
    brand_name: string;
    images: string[];
}

export type { DetailsProduct };