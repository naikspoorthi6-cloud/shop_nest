/* ==========================================================
   ShopNest - Sample product data (no backend / database)
   ========================================================== */

const CATEGORIES = [
  { name: "Electronics", image: "https://images.unsplash.com/photo-1553774661-0651f14b2da4?auto=format&fit=crop&w=400&h=400&q=80", tagline: "Audio, wearables and desk gear" },
  { name: "Fashion", image: "https://images.unsplash.com/photo-1575752229768-116115c80c8f?auto=format&fit=crop&w=400&h=400&q=80", tagline: "Everyday clothing and footwear" },
  { name: "Home", image: "https://images.unsplash.com/photo-1607273177147-e7304c4d5d6c?auto=format&fit=crop&w=400&h=400&q=80", tagline: "Small upgrades for every room" },
  { name: "Accessories", image: "https://images.unsplash.com/photo-1685715481110-19db0a76de2f?auto=format&fit=crop&w=400&h=400&q=80", tagline: "Bags, eyewear and more" },
  { name: "Fitness", image: "https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=400&h=400&q=80", tagline: "Gear for training at home" }
];

const PRODUCTS = [
  {
    id: 1, name: "Wireless Headphones", category: "Electronics",
    price: 2999, oldPrice: 3999, rating: 4.5, reviews: 128, featured: true,
    image: "https://images.unsplash.com/photo-1553774661-0651f14b2da4?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/btxp7v1WNCo/download?force=true&w=800",
    description: "Over-ear Bluetooth headphones with soft memory-foam cushions and deep bass. Up to 30 hours of playback on a single charge.",
    features: ["30-hour battery life", "Bluetooth 5.3 with built-in mic", "Foldable design with carry pouch"]
  },
  {
    id: 2, name: "Smart Watch", category: "Electronics",
    price: 4499, oldPrice: 5999, rating: 4.3, reviews: 96, featured: true,
    image: "https://images.unsplash.com/photo-1616353329454-4350ed03a0b2?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/p-bREWGefWg/download?force=true&w=800",
    description: "A lightweight smart watch that tracks steps, heart rate and sleep, and shows call and message alerts on its bright AMOLED screen.",
    features: ["1.4-inch AMOLED display", "Heart rate and sleep tracking", "Water resistant up to 50 m"]
  },
  {
    id: 3, name: "Bluetooth Speaker", category: "Electronics",
    price: 1799, oldPrice: 2299, rating: 4.4, reviews: 211, featured: true,
    image: "https://images.unsplash.com/photo-1549400854-b4300f444934?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/eeEsmrTVH7Q/download?force=true&w=800",
    description: "A pocket-sized speaker that fills a room with clear sound. Splash-proof, so it is happy by the pool or on a trek.",
    features: ["12 hours of playtime", "IPX6 splash resistance", "Pairs two speakers for stereo sound"]
  },
  {
    id: 4, name: "Laptop Backpack", category: "Accessories",
    price: 1299, oldPrice: 1799, rating: 4.2, reviews: 74, featured: true,
    image: "https://images.unsplash.com/photo-1614096602561-7394f4d5dc82?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/OYqSDS-CDjI/download?force=true&w=800",
    description: "A padded backpack that fits laptops up to 15.6 inches, with separate pockets for chargers, notebooks and a water bottle.",
    features: ["Fits 15.6-inch laptops", "Water-resistant fabric", "Breathable padded straps"]
  },
  {
    id: 5, name: "Running Shoes", category: "Fashion",
    price: 3299, oldPrice: 4199, rating: 4.6, reviews: 183, featured: true,
    image: "https://images.unsplash.com/photo-1597892657493-6847b9640bac?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/A4579vLezz8/download?force=true&w=800",
    description: "Cushioned running shoes with a breathable knit upper and a grippy sole, built for daily runs and long walks.",
    features: ["Breathable knit upper", "Shock-absorbing midsole", "Available in UK sizes 6 to 11"]
  },
  {
    id: 6, name: "Denim Jacket", category: "Fashion",
    price: 2199, oldPrice: 2899, rating: 4.1, reviews: 59, featured: false,
    image: "https://images.unsplash.com/photo-1575752229768-116115c80c8f?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/h6ajwqvCKsY/download?force=true&w=800",
    description: "A classic mid-wash denim jacket in a relaxed fit. Easy to layer over a tee in the evening.",
    features: ["100% cotton denim", "Relaxed unisex fit", "Machine washable"]
  },
  {
    id: 7, name: "Polarized Sunglasses", category: "Accessories",
    price: 999, oldPrice: 1499, rating: 4.0, reviews: 142, featured: true,
    image: "https://images.unsplash.com/photo-1685715481110-19db0a76de2f?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/eHk4scAyUzU/download?force=true&w=800",
    description: "Lightweight polarized sunglasses with UV400 lenses that cut glare on bright days and long drives.",
    features: ["UV400 polarized lenses", "Flexible lightweight frame", "Includes hard case"]
  },
  {
    id: 8, name: "Coffee Maker", category: "Home",
    price: 3799, oldPrice: 4799, rating: 4.4, reviews: 88, featured: true,
    image: "https://images.unsplash.com/photo-1607273177147-e7304c4d5d6c?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/ioVRpz0gX5w/download?force=true&w=800",
    description: "Brew up to six cups of filter coffee with one press of a button. The reusable filter means no paper waste.",
    features: ["Brews 6 cups at a time", "Keep-warm plate", "Reusable mesh filter"]
  },
  {
    id: 9, name: "LED Table Lamp", category: "Home",
    price: 899, oldPrice: 1199, rating: 4.3, reviews: 65, featured: false,
    image: "https://images.unsplash.com/photo-1605194004886-56d82f482d53?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/qdJfBhmmv3E/download?force=true&w=800",
    description: "A dimmable desk lamp with three colour temperatures, so it suits late-night study as well as relaxed reading.",
    features: ["3 colour modes, 5 brightness levels", "USB powered", "Flexible neck"]
  },
  {
    id: 10, name: "Yoga Mat", category: "Fitness",
    price: 749, oldPrice: 999, rating: 4.5, reviews: 207, featured: false,
    image: "https://images.unsplash.com/photo-1637157216470-d92cd2edb2e8?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/G9H5edUL0T8/download?force=true&w=800",
    description: "A 6 mm non-slip yoga mat that is gentle on knees and wrists. Rolls up easily and comes with a carry strap.",
    features: ["6 mm thick cushioning", "Non-slip textured surface", "Includes carry strap"]
  },
  {
    id: 11, name: "Adjustable Dumbbell Set", category: "Fitness",
    price: 2499, oldPrice: 3299, rating: 4.4, reviews: 77, featured: false,
    image: "https://images.unsplash.com/photo-1591291621164-2c6367723315?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/erUC4fTtCuo/download?force=true&w=800",
    description: "A pair of adjustable dumbbells that go from 2 kg to 10 kg each, so one set covers your whole home workout.",
    features: ["2 kg to 10 kg per dumbbell", "Anti-slip grip handles", "Compact storage"]
  },
  {
    id: 12, name: "Gaming Mouse", category: "Electronics",
    price: 1199, oldPrice: 1599, rating: 4.2, reviews: 154, featured: false,
    image: "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/j4PqlNVZ4Bc/download?force=true&w=800",
    description: "A precise wired gaming mouse with adjustable DPI up to 7200 and programmable buttons.",
    features: ["Up to 7200 DPI", "6 programmable buttons", "RGB lighting"]
  },
  {
    id: 13, name: "Cotton T-Shirt", category: "Fashion",
    price: 599, oldPrice: 799, rating: 4.1, reviews: 301, featured: false,
    image: "https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/JskqEILt-ds/download?force=true&w=800",
    description: "A soft, breathable crew-neck tee made from combed cotton. It holds its shape wash after wash.",
    features: ["100% combed cotton", "Regular fit", "Sizes S to XXL"]
  },
  {
    id: 14, name: "Insulated Water Bottle", category: "Fitness",
    price: 449, oldPrice: 649, rating: 4.6, reviews: 412, featured: false,
    image: "https://images.unsplash.com/photo-1544003484-3cd181d17917?auto=format&fit=crop&w=800&h=800&q=80",
    imageBackup: "https://unsplash.com/photos/dGIEMeN2MV8/download?force=true&w=800",
    description: "A stainless steel bottle that keeps drinks cold for 24 hours or hot for 12. Leak-proof lid, fits most bag pockets.",
    features: ["750 ml capacity", "Cold 24 h, hot 12 h", "BPA-free, leak-proof lid"]
  }
];

