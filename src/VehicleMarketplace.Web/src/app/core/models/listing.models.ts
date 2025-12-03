export interface VehicleListing {
    id: string;
    title: string;
    description: string;
    price: number;
    year: number;
    mileage: number;
    make: string;
    model: string;
    transmission: string;
    fuelType: string;
    city: string;
    province: string;
    categoryId: string;
    categoryName?: string;
    userId: string;
    userName?: string;
    imageUrl?: string;
    createdAt: Date;
}

export interface CreateListingRequest {
    title: string;
    description: string;
    price: number;
    year: number;
    mileage: number;
    make: string;
    model: string;
    transmission: string;
    fuelType: string;
    city: string;
    province: string;
    categoryId: string;
}

export interface Category {
    id: string;
    name: string;
}
