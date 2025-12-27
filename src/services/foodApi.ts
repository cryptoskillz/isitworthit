import axios from 'axios';

const BASE_URL = 'https://world.openfoodfacts.org';

export interface ProductData {
    code: string;
    product_name: string;
    image_url: string;
    nutriments: {
        "energy-kcal_100g"?: number;
        "energy-kcal_serving"?: number;
        "energy-kcal"?: number;
        "energy-kj_100g"?: number;
        "proteins_100g"?: number;
        "carbohydrates_100g"?: number;
        "sugars_100g"?: number;
        "fat_100g"?: number;
    };
    serving_size?: string;
    brands?: string;
    categories_tags?: string[];
    nutrition_grades?: string;
}

export const getProduct = async (barcode: string): Promise<ProductData | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/api/v0/product/${barcode}.json`);
        if (response.data.status === 1) {
            return response.data.product;
        }
        return null;
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
};

export const searchProduct = async (query: string): Promise<ProductData[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
            params: {
                search_terms: query,
                search_simple: 1,
                action: 'process',
                json: 1,
                page_size: 20,
                fields: 'code,product_name,image_url,nutriments,serving_size,brands,categories_tags,nutrition_grades'
            }
        });
        return response.data.products || [];
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
};

export const getHealthyAlternatives = async (product: ProductData): Promise<ProductData[]> => {
    try {
        if (!product.categories_tags || product.categories_tags.length === 0) return [];

        // Reverse categories to start with most specific
        const categories = [...product.categories_tags].reverse();

        // Try up to 3 levels of specificity
        // e.g. [en:colas, en:sodas, en:beverages]
        for (let i = 0; i < Math.min(categories.length, 3); i++) {
            const category = categories[i];
            console.log(`Searching alternatives for category: ${category} (Level ${i})`);

            const response = await axios.get(`${BASE_URL}/cgi/search.pl`, {
                params: {
                    action: 'process',
                    tagtype_0: 'categories',
                    tag_contains_0: 'contains',
                    tag_0: category,
                    tagtype_1: 'nutrition_grades',
                    tag_contains_1: 'contains',
                    tag_1: 'a',
                    sort_by: 'popularity',
                    page_size: 5,
                    json: 1,
                    fields: 'code,product_name,image_url,nutriments,categories_tags,nutrition_grades'
                }
            });

            if (response.data.products && response.data.products.length > 0) {
                console.log(`Found ${response.data.products.length} alternatives for ${category}`);
                return response.data.products;
            }
        }

        return [];
    } catch (error) {
        console.error("Error fetching alternatives:", error);
        return [];
    }
};

export const extractCalories = (product: ProductData): number | null => {
    // Try to get per serving first, then per 100g
    // This is valid but for now let's prioritize what's available

    // Check various fields Open Food Facts might return
    const kcal = product.nutriments["energy-kcal_serving"] ||
        product.nutriments["energy-kcal_100g"] ||
        product.nutriments["energy-kcal"];

    if (kcal) return kcal;

    // fallback to KJ if needed (1 kcal = 4.184 kJ)
    const kj = product.nutriments["energy-kj_100g"];
    if (kj) return parseFloat((kj / 4.184).toFixed(2));

    return null;
}
