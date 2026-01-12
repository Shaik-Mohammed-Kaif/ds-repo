import { Bike } from '@/types/bike';
import heroBike1 from '@/assets/hero-bike-1.jpg';
import heroBike2 from '@/assets/hero-bike-2.jpg';
import heroBike3 from '@/assets/hero-bike-3.jpg';
import bikeMountain1 from '@/assets/bike-mountain-1.jpg';
import bikeCity1 from '@/assets/bike-city-1.jpg';
import bikeRoad1 from '@/assets/bike-road-1.jpg';
import bikeFolding1 from '@/assets/bike-folding-1.jpg';

export const bikes: Bike[] = [
  {
    id: '1',
    name: 'EcoRide Mountain Pro',
    price: 2499,
    originalPrice: 2799,
    category: 'mountain',
    image: bikeMountain1,
    images: [bikeMountain1, heroBike1],
    specs: {
      battery: '48V 17.5Ah Samsung',
      range: 'Up to 80 miles',
      topSpeed: '28 mph',
      weight: '55 lbs',
      motor: '750W Brushless',
      charging: '4-6 hours'
    },
    features: [
      'Full suspension system',
      'Hydraulic disc brakes',
      'LED display with GPS',
      'Removable battery',
      'All-terrain tires',
      'IP65 water resistance'
    ],
    description: 'Conquer any trail with our most advanced mountain e-bike featuring premium suspension and powerful motor.',
    inStock: true,
    isNew: true,
    isFeatured: true
  },
  {
    id: '2',
    name: 'Urban Commuter Elite',
    price: 1899,
    category: 'city',
    image: bikeCity1,
    images: [bikeCity1, heroBike2],
    specs: {
      battery: '36V 14Ah Panasonic',
      range: 'Up to 60 miles',
      topSpeed: '20 mph',
      weight: '48 lbs',
      motor: '500W Mid-drive',
      charging: '3-5 hours'
    },
    features: [
      'Step-through frame',
      'Integrated lights',
      'Phone holder',
      'Rear cargo rack',
      'Puncture-resistant tires',
      'Anti-theft system'
    ],
    description: 'Perfect for daily commuting with comfort, style, and reliability in urban environments.',
    inStock: true,
    isFeatured: true
  },
  {
    id: '3',
    name: 'Speedster Road Carbon',
    price: 3299,
    originalPrice: 3599,
    category: 'road',
    image: bikeRoad1,
    images: [bikeRoad1, heroBike3],
    specs: {
      battery: '36V 10.5Ah LG',
      range: 'Up to 70 miles',
      topSpeed: '28 mph',
      weight: '38 lbs',
      motor: '250W Ultra-light',
      charging: '2-4 hours'
    },
    features: [
      'Carbon fiber frame',
      'Aerodynamic design',
      'Electronic shifting',
      'Power meter included',
      'Tubeless ready wheels',
      'Professional fit'
    ],
    description: 'Ultra-light road e-bike for serious cyclists who demand performance and speed.',
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'FoldMax Compact',
    price: 1299,
    category: 'folding',
    image: bikeFolding1,
    images: [bikeFolding1],
    specs: {
      battery: '36V 10Ah Lithium',
      range: 'Up to 40 miles',
      topSpeed: '20 mph',
      weight: '42 lbs',
      motor: '350W Rear hub',
      charging: '3-4 hours'
    },
    features: [
      'Quick fold mechanism',
      'Compact storage',
      'Carry handle',
      'Adjustable components',
      'City-friendly tires',
      'Integrated lock'
    ],
    description: 'Space-saving folding e-bike perfect for small apartments and mixed commuting.',
    inStock: true
  },
  {
    id: '5',
    name: 'TrailBlazer Extreme',
    price: 2899,
    category: 'mountain',
    image: bikeMountain1,
    images: [bikeMountain1, heroBike1],
    specs: {
      battery: '48V 20Ah High-capacity',
      range: 'Up to 100 miles',
      topSpeed: '28 mph',
      weight: '58 lbs',
      motor: '1000W Peak power',
      charging: '5-7 hours'
    },
    features: [
      'Premium air suspension',
      'SRAM Eagle drivetrain',
      'Rock Shox components',
      'Maxxis tires',
      'Dropper seat post',
      'Tool-free battery removal'
    ],
    description: 'Professional-grade mountain e-bike for extreme trail adventures.',
    inStock: false
  },
  {
    id: '6',
    name: 'City Cruiser Classic',
    price: 1599,
    category: 'city',
    image: bikeCity1,
    images: [bikeCity1],
    specs: {
      battery: '36V 12Ah Standard',
      range: 'Up to 50 miles',
      topSpeed: '20 mph',
      weight: '52 lbs',
      motor: '400W Hub motor',
      charging: '4-5 hours'
    },
    features: [
      'Comfortable upright position',
      'Spring saddle',
      'Chain guard',
      'Fenders included',
      'Bell and reflectors',
      'Easy step-through'
    ],
    description: 'Classic city e-bike with timeless design and modern electric assistance.',
    inStock: true
  }
];

export const heroSlides = [
  {
    id: 1,
    image: heroBike1,
    title: 'Ride Into The Future',
    subtitle: 'Experience the ultimate electric mountain bike',
    cta: 'Explore Mountains',
    bikeId: '1'
  },
  {
    id: 2,
    image: heroBike2,
    title: 'Urban Mobility Redefined',
    subtitle: 'Commute smarter with our premium city e-bikes',
    cta: 'Discover City',
    bikeId: '2'
  },
  {
    id: 3,
    image: heroBike3,
    title: 'Performance Unleashed',
    subtitle: 'Professional-grade e-bikes for serious riders',
    cta: 'View Performance',
    bikeId: '3'
  }
];