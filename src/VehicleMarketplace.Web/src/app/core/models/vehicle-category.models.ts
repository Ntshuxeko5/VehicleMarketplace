export interface VehicleCategory {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    svgPath?: string;
}

// Vehicle type icons mapping
export const VEHICLE_TYPE_ICONS: Record<string, string> = {
    sedan: 'directions_car',
    suv: 'airport_shuttle',
    hatchback: 'directions_car',
    coupe: 'sports_car',
    convertible: 'sports_car',
    truck: 'local_shipping',
    bakkie: 'local_shipping',
    van: 'airport_shuttle',
    motorcycle: 'two_wheeler',
    bus: 'directions_bus',
    luxury: 'emoji_transportation',
    electric: 'electric_car',
    hybrid: 'electric_car',
    sports: 'sports_car',
    wagon: 'airport_shuttle',
    minivan: 'airport_shuttle',
    crossover: 'airport_shuttle'
};

// Helper function to get icon for vehicle type
export function getVehicleIcon(categoryName: string): string {
    const normalizedName = categoryName.toLowerCase();
    return VEHICLE_TYPE_ICONS[normalizedName] || 'directions_car';
}
