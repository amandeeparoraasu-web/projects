// The first entries remain the quick picks. Category assignments are estimates.
export const featuredMerchants = [
  ['Restaurants', 'dining', 'dining', 'food cafes coffee takeout'],
  ['Whole Foods', 'grocery', 'basket', 'whole foods market supermarket groceries'],
  ['Shell', 'gas', 'gas', 'shell gas station fuel'],
  ['Costco', 'wholesale', 'store', 'costco warehouse club'],
  ['Delta Air Lines', 'travel', 'plane', 'delta airlines airfare flights'],
  ['Walmart', 'walmart', 'bag', 'walmart supercenter superstore walmart.com walmart neighborhood market'],
];

const directory = {
  dining: [
    'Starbucks|coffee cafe', 'Dunkin’|dunkin donuts coffee', 'Dutch Bros', 'Peet’s Coffee',
    'Caribou Coffee', 'Tim Hortons', 'The Coffee Bean & Tea Leaf', 'Scooter’s Coffee',
    'McDonald’s|mcdonalds', 'Burger King', 'Wendy’s', 'Taco Bell', 'Chipotle', 'Chick-fil-A|chickfila',
    'Subway', 'Jersey Mike’s', 'Jimmy John’s', 'Firehouse Subs', 'Potbelly', 'Panera Bread',
    'Five Guys', 'Shake Shack', 'In-N-Out Burger', 'Whataburger', 'Culver’s', 'Sonic Drive-In',
    'Jack in the Box', 'Carl’s Jr.', 'Hardee’s', 'White Castle', 'Checkers', 'Arby’s',
    'KFC|kentucky fried chicken', 'Popeyes', 'Raising Cane’s', 'Church’s Texas Chicken',
    'Zaxby’s', 'Bojangles', 'Wingstop', 'Buffalo Wild Wings', 'Dave’s Hot Chicken',
    'Domino’s|dominos', 'Pizza Hut', 'Papa Johns', 'Little Caesars', 'Marco’s Pizza', 'MOD Pizza',
    'Blaze Pizza', 'California Pizza Kitchen', 'Panda Express', 'P.F. Chang’s', 'Noodles & Company',
    'CAVA', 'Sweetgreen', 'Salad and Go', 'Chopt', 'Just Salad', 'QDOBA', 'Moe’s Southwest Grill',
    'Del Taco', 'El Pollo Loco', 'Waba Grill', 'Tropical Smoothie Cafe', 'Smoothie King', 'Jamba',
    'Applebee’s', 'Chili’s', 'Olive Garden', 'Texas Roadhouse', 'LongHorn Steakhouse',
    'Outback Steakhouse', 'Red Lobster', 'The Cheesecake Factory', 'Red Robin', 'BJ’s Restaurant',
    'Yard House', 'First Watch', 'IHOP', 'Denny’s', 'Waffle House', 'Cracker Barrel',
    'Dairy Queen', 'Baskin-Robbins', 'Cold Stone Creamery', 'Krispy Kreme', 'Crumbl',
    'Nothing Bundt Cakes', 'DoorDash', 'Uber Eats', 'Grubhub', 'Postmates',
  ],
  grocery: [
    'Trader Joe’s|trader joes', 'Aldi', 'Lidl', 'Kroger', 'Fry’s Food Stores|frys',
    'Safeway', 'Albertsons', 'Vons', 'Pavilions', 'Ralphs', 'King Soopers', 'City Market',
    'Smith’s Food and Drug', 'Fred Meyer', 'QFC', 'Harris Teeter', 'Mariano’s', 'Pick ’n Save',
    'Publix', 'H-E-B|heb', 'Central Market', 'Wegmans', 'Food Lion', 'Giant Food', 'The GIANT Company',
    'Stop & Shop', 'Hannaford', 'ShopRite', 'Price Chopper', 'Market Basket', 'Big Y', 'Weis Markets',
    'Meijer', 'Hy-Vee', 'WinCo Foods', 'Sprouts Farmers Market', 'Natural Grocers',
    'Fresh Thyme Market', 'The Fresh Market', 'Earth Fare', 'Raley’s', 'Bel Air Markets',
    'Nob Hill Foods', 'Save Mart', 'Lucky Supermarkets', 'FoodMaxx', 'Grocery Outlet',
    'Smart & Final', 'Stater Bros.', 'Giant Eagle', 'Winn-Dixie', 'Piggly Wiggly', 'Lowes Foods',
    'Ingles Markets', 'Food City', 'Brookshire’s', 'Brookshire Brothers', 'United Supermarkets',
    'Bashas’', 'AJ’s Fine Foods', 'H Mart', '99 Ranch Market', 'Mitsuwa Marketplace', 'Uwajimaya',
    'Patel Brothers', 'Seafood City', 'El Super', 'Cardenas Markets', 'Northgate Market',
    'Vallarta Supermarkets', 'Sedano’s', 'Bravo Supermarkets', 'Key Food', 'Fairway Market',
    'D’Agostino', 'Morton Williams', 'Gelson’s', 'Bristol Farms', 'Erewhon',
  ],
  gas: [
    'Chevron', 'Exxon', 'Mobil', 'BP', 'Amoco', 'Texaco', 'Sunoco', 'Citgo', 'Marathon',
    'ARCO', '76|unocal', 'Phillips 66', 'Conoco', 'Sinclair', 'Valero', 'Gulf', 'Speedway',
    'RaceTrac', 'RaceWay', 'QuikTrip|qt gas', 'Kwik Trip', 'Kwik Star', 'Sheetz', 'Wawa',
    'Royal Farms', 'Circle K', '7-Eleven|7 eleven 711', 'Buc-ee’s', 'Casey’s General Store',
    'Maverik', 'Murphy USA', 'Murphy Express', 'Pilot Travel Centers', 'Flying J',
    'Love’s Travel Stops', 'TravelCenters of America', 'Petro Stopping Centers', 'Cumberland Farms',
    'Turkey Hill Minit Markets', 'Stewart’s Shops', 'Thorntons', 'Holiday Stationstores',
  ],
  wholesale: ['Sam’s Club|sams club', 'BJ’s Wholesale Club|bjs wholesale'],
  costcoGas: ['Costco Gas|costco gasoline fuel'],
  drugstore: ['CVS|cvs pharmacy', 'Walgreens', 'Duane Reade', 'Kinney Drugs', 'Discount Drug Mart',
    'Health Mart', 'Good Neighbor Pharmacy', 'Walgreens Pharmacy', 'CVS inside Target'],
  travel: [
    'American Airlines|aa', 'United Airlines', 'Southwest Airlines', 'Alaska Airlines',
    'Hawaiian Airlines', 'JetBlue', 'Spirit Airlines', 'Frontier Airlines', 'Allegiant Air',
    'Sun Country Airlines', 'Breeze Airways', 'Avelo Airlines', 'Air Canada', 'British Airways',
    'Virgin Atlantic', 'Lufthansa', 'Air France', 'KLM', 'Emirates', 'Qatar Airways', 'Singapore Airlines',
    'Japan Airlines', 'ANA|all nippon airways', 'Iberia', 'Aer Lingus', 'Turkish Airlines',
    'Cathay Pacific', 'Qantas', 'Avianca', 'Copa Airlines', 'LATAM Airlines', 'Aeroméxico',
    'Marriott', 'Hilton', 'Hyatt', 'IHG', 'Holiday Inn', 'Hampton by Hilton', 'DoubleTree',
    'Courtyard by Marriott', 'Residence Inn', 'Sheraton', 'Westin', 'The Ritz-Carlton',
    'Wyndham', 'La Quinta', 'Choice Hotels', 'Comfort Inn', 'Quality Inn', 'Best Western',
    'Radisson', 'Motel 6', 'Red Roof Inn', 'Four Seasons', 'Omni Hotels', 'Loews Hotels',
    'Airbnb', 'Vrbo', 'Booking.com', 'Expedia', 'Hotels.com', 'Priceline', 'Travelocity', 'Orbitz',
    'Enterprise Rent-A-Car', 'Hertz', 'Avis', 'Budget Rent a Car', 'Alamo', 'National Car Rental',
    'Dollar Car Rental', 'Thrifty Car Rental', 'Sixt', 'Turo',
    'Carnival Cruise Line', 'Royal Caribbean', 'Norwegian Cruise Line', 'Disney Cruise Line',
    'Princess Cruises', 'Celebrity Cruises', 'Holland America Line', 'MSC Cruises',
  ],
  portal: ['Chase Travel|chase booking portal'],
  transit: ['Uber|rideshare', 'Lyft|rideshare', 'Amtrak', 'Greyhound', 'FlixBus', 'Megabus',
    'MTA|nyc subway metrocard omny', 'BART|bay area rapid transit', 'WMATA|dc metro smartrip',
    'CTA|chicago transit ventra', 'SEPTA', 'MBTA', 'NJ Transit', 'PATH', 'TriMet',
    'LA Metro', 'Valley Metro|phoenix light rail', 'SpotHero', 'ParkMobile', 'ParkWhiz', 'E-ZPass'],
  streaming: ['Netflix', 'Hulu', 'Disney+|disney plus', 'Max|hbo max', 'Peacock',
    'Paramount+|paramount plus', 'Apple TV+|apple tv plus', 'Spotify', 'YouTube Premium',
    'YouTube TV', 'Sling TV', 'Fubo', 'ESPN+', 'Discovery+', 'Pandora'],
  onlineGrocery: ['Instacart', 'FreshDirect', 'Amazon Fresh Online', 'Kroger Delivery'],
  online: [
    'Amazon|amazon.com online shopping retail', 'eBay', 'Etsy', 'Wayfair', 'Chewy', 'Zappos',
    'Newegg', 'Overstock', 'Temu', 'SHEIN', 'AliExpress', 'B&H Photo Online', 'Target.com',
    'BestBuy.com', 'HomeDepot.com', 'Lowes.com', 'Nike.com', 'Adidas.com', 'Sephora.com',
    'Ulta.com', 'Nordstrom.com', 'Macys.com', 'Walmart Marketplace|third-party walmart seller',
  ],
  entertainment: [
    'AMC Theatres', 'Regal Cinemas', 'Cinemark', 'Alamo Drafthouse', 'Harkins Theatres',
    'Marcus Theatres', 'IMAX', 'Ticketmaster', 'Live Nation', 'AXS', 'SeatGeek', 'StubHub',
    'Fandango', 'Disneyland', 'Walt Disney World', 'Universal Studios', 'Six Flags', 'SeaWorld',
    'Legoland', 'Dave & Buster’s', 'Topgolf', 'Bowlero', 'Main Event',
  ],
  other: [
    'Target', 'Dollar General', 'Dollar Tree', 'Family Dollar', 'Five Below', 'Big Lots',
    'Best Buy', 'Apple Store', 'Micro Center', 'GameStop', 'Staples', 'Office Depot', 'OfficeMax',
    'The Home Depot|home depot', 'Lowe’s', 'Ace Hardware', 'Menards', 'Harbor Freight',
    'Tractor Supply Co.', 'True Value', 'IKEA', 'Ashley Furniture', 'Rooms To Go',
    'Crate & Barrel', 'Pottery Barn', 'West Elm', 'Williams Sonoma', 'The Container Store',
    'Macy’s', 'Nordstrom', 'Nordstrom Rack', 'Kohl’s', 'JCPenney', 'Dillard’s', 'Bloomingdale’s',
    'Saks Fifth Avenue', 'Burlington', 'Ross Dress for Less', 'TJ Maxx', 'Marshalls', 'HomeGoods',
    'Gap', 'Old Navy', 'Banana Republic', 'J.Crew', 'American Eagle', 'Abercrombie & Fitch',
    'Hollister', 'H&M', 'Zara', 'Uniqlo', 'Urban Outfitters', 'Anthropologie', 'Lululemon',
    'Nike', 'Adidas', 'Foot Locker', 'Dick’s Sporting Goods', 'Academy Sports + Outdoors',
    'REI', 'Bass Pro Shops', 'Cabela’s', 'Scheels', 'Golf Galaxy', 'PetSmart', 'Petco',
    'Pet Supplies Plus', 'Sephora', 'Ulta Beauty', 'Bath & Body Works', 'Sally Beauty',
    'AutoZone', 'O’Reilly Auto Parts', 'Advance Auto Parts', 'NAPA Auto Parts', 'Discount Tire',
    'Les Schwab', 'Firestone Complete Auto Care', 'Jiffy Lube', 'Valvoline Instant Oil Change',
    'Barnes & Noble', 'Books-A-Million', 'Half Price Books', 'Michaels', 'Hobby Lobby',
    'FedEx Office', 'The UPS Store', 'USPS', 'AT&T', 'Verizon', 'T-Mobile', 'Comcast Xfinity',
    'Spectrum', 'Cox', 'Goodwill', 'Savers', 'The Salvation Army Thrift Store',
  ],
};

const icons = {
  dining: 'dining', grocery: 'basket', gas: 'gas', wholesale: 'store', costcoGas: 'gas',
  drugstore: 'store', travel: 'plane', portal: 'plane', transit: 'plane', onlineGrocery: 'basket',
};

export const merchantEntries = [
  ...featuredMerchants,
  ...Object.entries(directory).flatMap(([category, names]) => names.map(entry => {
    const [name, keywords = ''] = entry.split('|');
    return [name, category, icons[category] ?? 'bag', keywords];
  })),
];

export function normalizeMerchant(value) {
  return value.normalize('NFKD').replace(/\p{Diacritic}/gu, '').toLowerCase()
    .replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}
