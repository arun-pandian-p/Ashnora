import brandLogoImg from './brand/ashnora-glossy-icon.png';
import heroPlateImg from './brand/hero-food-plate.jpg';
import loginTeamImg from './brand/login-team.png';
import homeHeroBannerImg from './brand/home-hero-banner.png';
import kitchenLoginImg from './brand/kitchen-login.png';
import billingLoginImg from './brand/billing-login.png';
import waiterLoginImg from './brand/waiter-login.png';

// Food Images
import chickenBiryaniImg from './food/chicken-biryani.jpg';
import butterChickenImg from './food/butter-chicken.jpg';
import paneerButterMasalaImg from './food/paneer-butter-masala.jpg';
import chicken65Img from './food/chicken-65.jpg';
import paneerTikkaImg from './food/paneer-tikka.jpg';
import garlicBreadImg from './food/garlic-bread.jpg';
import limeSodaImg from './food/lime-soda.jpg';
import gulabJamunImg from './food/gulab-jamun.jpg';
import coldCoffeeImg from './food/cold-coffee.jpg';
import muttonBiryaniImg from './food/mutton-biryani.jpg';
import rasmalaiImg from './food/rasmalai.jpg';
import frenchFriesImg from './food/french-fries.jpg';
import chickenNoodlesImg from './food/chicken-noodles.jpg';
import vegFriedRiceImg from './food/veg-fried-rice.jpg';
import chocolateCakeImg from './food/chocolate-cake.jpg';
import brownieImg from './food/brownie.jpg';
import iceCreamImg from './food/ice-cream.jpg';
import mangoJuiceImg from './food/mango-juice.jpg';
import masalaChaiImg from './food/masala-chai.jpg';
import springRollsImg from './food/spring-rolls.jpg';

export const BRAND_LOGO = brandLogoImg;
export const HERO_FOOD_PLATE = heroPlateImg;
export const LOGIN_TEAM_IMAGE = loginTeamImg;
export const HOME_HERO_BANNER = homeHeroBannerImg;
export const KITCHEN_LOGIN_IMAGE = kitchenLoginImg;
export const BILLING_LOGIN_IMAGE = billingLoginImg;
export const WAITER_LOGIN_IMAGE = waiterLoginImg;

export const FOOD_IMAGES_MAP: Record<string, string> = {
  'chicken-biryani': chickenBiryaniImg,
  'butter-chicken': butterChickenImg,
  'paneer-butter-masala': paneerButterMasalaImg,
  'chicken-65': chicken65Img,
  'paneer-tikka': paneerTikkaImg,
  'garlic-bread': garlicBreadImg,
  'garlic-naan': garlicBreadImg,
  'lime-soda': limeSodaImg,
  'gulab-jamun': gulabJamunImg,
  'cold-coffee': coldCoffeeImg,
  'mutton-biryani': muttonBiryaniImg,
  'rasmalai': rasmalaiImg,
  'french-fries': frenchFriesImg,
  'chicken-noodles': chickenNoodlesImg,
  'veg-fried-rice': vegFriedRiceImg,
  'chocolate-cake': chocolateCakeImg,
  'brownie': brownieImg,
  'ice-cream': iceCreamImg,
  'mango-juice': mangoJuiceImg,
  'masala-chai': masalaChaiImg,
  'spring-rolls': springRollsImg
};

export const AVAILABLE_FOOD_PRESETS = [
  { name: 'Chicken Biryani', image: chickenBiryaniImg, category: 'Main Course' },
  { name: 'Butter Chicken', image: butterChickenImg, category: 'Main Course' },
  { name: 'Paneer Butter Masala', image: paneerButterMasalaImg, category: 'Main Course' },
  { name: 'Chicken 65', image: chicken65Img, category: 'Starters' },
  { name: 'Paneer Tikka', image: paneerTikkaImg, category: 'Starters' },
  { name: 'Garlic Naan / Bread', image: garlicBreadImg, category: 'Breads' },
  { name: 'Cold Coffee', image: coldCoffeeImg, category: 'Drinks' },
  { name: 'Fresh Lime Soda', image: limeSodaImg, category: 'Drinks' },
  { name: 'Gulab Jamun', image: gulabJamunImg, category: 'Desserts' },
  { name: 'Mutton Dum Biryani', image: muttonBiryaniImg, category: 'Main Course' },
  { name: 'Saffron Rasmalai', image: rasmalaiImg, category: 'Desserts' },
  { name: 'Crispy French Fries', image: frenchFriesImg, category: 'Starters' },
  { name: 'Veg Fried Rice', image: vegFriedRiceImg, category: 'Main Course' },
  { name: 'Chicken Hakka Noodles', image: chickenNoodlesImg, category: 'Main Course' },
  { name: 'Chocolate Fudge Cake', image: chocolateCakeImg, category: 'Desserts' },
  { name: 'Warm Walnut Brownie', image: brownieImg, category: 'Desserts' },
  { name: 'Mango Smoothie Juice', image: mangoJuiceImg, category: 'Drinks' },
  { name: 'Special Masala Chai', image: masalaChaiImg, category: 'Drinks' },
  { name: 'Vegetable Spring Rolls', image: springRollsImg, category: 'Starters' }
];

export function getDishImage(dishNameOrPath: string): string {
  if (!dishNameOrPath) return chickenBiryaniImg;

  // If already a bundled asset URL (base64, data:, blob:, or hashed Vite asset path starting with ./assets or http)
  if (dishNameOrPath.startsWith('data:') || dishNameOrPath.startsWith('blob:') || dishNameOrPath.includes('assets/') || dishNameOrPath.startsWith('http')) {
    return dishNameOrPath;
  }

  const normalized = dishNameOrPath.toLowerCase();

  if (normalized.includes('biryani') || normalized.includes('mutton')) {
    return normalized.includes('mutton') ? muttonBiryaniImg : chickenBiryaniImg;
  }
  if (normalized.includes('butter chicken')) return butterChickenImg;
  if (normalized.includes('paneer butter') || normalized.includes('paneer masala')) return paneerButterMasalaImg;
  if (normalized.includes('chicken 65') || (normalized.includes('chicken') && normalized.includes('65'))) return chicken65Img;
  if (normalized.includes('tikka') || normalized.includes('paneer')) return paneerTikkaImg;
  if (normalized.includes('naan') || normalized.includes('bread') || normalized.includes('roti')) return garlicBreadImg;
  if (normalized.includes('soda') || normalized.includes('lime') || normalized.includes('lemon')) return limeSodaImg;
  if (normalized.includes('jamun')) return gulabJamunImg;
  if (normalized.includes('coffee')) return coldCoffeeImg;
  if (normalized.includes('rasmalai')) return rasmalaiImg;
  if (normalized.includes('fries')) return frenchFriesImg;
  if (normalized.includes('noodles')) return chickenNoodlesImg;
  if (normalized.includes('rice')) return vegFriedRiceImg;
  if (normalized.includes('cake')) return chocolateCakeImg;
  if (normalized.includes('brownie')) return brownieImg;
  if (normalized.includes('cream')) return iceCreamImg;
  if (normalized.includes('mango') || normalized.includes('juice')) return mangoJuiceImg;
  if (normalized.includes('chai') || normalized.includes('tea')) return masalaChaiImg;
  if (normalized.includes('roll')) return springRollsImg;

  // Check key mappings
  for (const [key, img] of Object.entries(FOOD_IMAGES_MAP)) {
    if (normalized.includes(key)) return img;
  }

  return chickenBiryaniImg;
}
