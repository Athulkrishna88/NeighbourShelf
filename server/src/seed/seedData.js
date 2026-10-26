const mongoose = require('mongoose');
const Locality = require('../models/Locality');
const User = require('../models/User');
const Item = require('../models/Item');
const Loan = require('../models/Loan');
const Rating = require('../models/Rating');

const seedLocalities = [
  {
    name: 'Sahrdaya Green Valley',
    description: 'Campus community, faculty residences and nearby locality around Kodakara, Thrissur.'
  },
  {
    name: 'Palm Grove Residents Association',
    description: 'Vibrant residential neighbourhood with 250+ households.'
  },
  {
    name: 'Riverside Enclave Chalakudy',
    description: 'Gated community by the Chalakudy river basin.'
  },
  {
    name: 'Highland View Colony',
    description: 'Active suburban township with strong community sharing culture.'
  }
];

const seedData = async () => {
  try {
    console.log('Seeding initial NeighbourShelf dataset...');

    // Clear existing data
    await Promise.all([
      Locality.deleteMany({}),
      User.deleteMany({}),
      Item.deleteMany({}),
      Loan.deleteMany({}),
      Rating.deleteMany({})
    ]);

    // 1. Create Localities
    const localities = await Locality.insertMany(seedLocalities);
    const sahrdayaLocality = localities[0]._id;
    const palmGroveLocality = localities[1]._id;

    // 2. Create Users
    const adminPasswordHash = await User.hashPassword('admin1234');
    const memberPasswordHash = await User.hashPassword('password123');

    const admin = await User.create({
      name: 'Athulkrishna (Administrator)',
      email: 'admin@neighbourshelf.org',
      passwordHash: adminPasswordHash,
      locality: sahrdayaLocality,
      role: 'admin',
      status: 'active',
      phone: '+91 98471 23456',
      bio: 'Platform moderator and system administrator for NeighbourShelf.',
      trustScore: 5.0,
      completedLoans: 14
    });

    const userAthul = await User.create({
      name: 'Athulkrishna KS',
      email: 'athul@example.com',
      passwordHash: memberPasswordHash,
      locality: sahrdayaLocality,
      role: 'member',
      status: 'active',
      phone: '+91 94470 11223',
      bio: 'MERN enthusiast & DIY hobbyist. Always happy to lend garden tools and workshop gear!',
      trustScore: 4.9,
      ratingsCount: 8,
      completedLoans: 8
    });

    const userMeera = await User.create({
      name: 'Meera Nambiar',
      email: 'meera@example.com',
      passwordHash: memberPasswordHash,
      locality: sahrdayaLocality,
      role: 'member',
      status: 'active',
      phone: '+91 97455 33445',
      bio: 'Avid baker and camper. Love borrowing party appliances and lending camping kits.',
      trustScore: 4.8,
      ratingsCount: 6,
      completedLoans: 6
    });

    const userRahul = await User.create({
      name: 'Rahul Varma',
      email: 'rahul@example.com',
      passwordHash: memberPasswordHash,
      locality: sahrdayaLocality,
      role: 'member',
      status: 'active',
      phone: '+91 98950 55667',
      bio: 'Home automation tinkerer with electronics tools, stud finders, and pressure washer.',
      trustScore: 4.7,
      ratingsCount: 4,
      completedLoans: 4
    });

    const userSuspended = await User.create({
      name: 'Spam Account Demo',
      email: 'suspended@example.com',
      passwordHash: memberPasswordHash,
      locality: palmGroveLocality,
      role: 'member',
      status: 'suspended',
      phone: '+91 90000 00000',
      bio: 'Account suspended for policy violation demonstration.',
      trustScore: 1.0,
      ratingsCount: 2,
      completedLoans: 1
    });

    // 3. Create Items in Sahrdaya Green Valley
    const itemsData = [
      {
        title: 'Bosch Professional Impact Drill (GSB 600)',
        description: 'Powerful 600W impact drill with complete masonry and steel bit set. Perfect for hanging shelves, TV brackets, and curtain rods.',
        category: 'Tools',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 3,
        status: 'available',
        owner: userAthul._id,
        locality: sahrdayaLocality
      },
      {
        title: '6-Step Aluminium Folding Household Ladder',
        description: 'Sturdy, lightweight anti-skid ladder with 150kg load rating. Essential for ceiling painting, cleaning fan blades, or loft access.',
        category: 'Tools',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 4,
        status: 'available',
        owner: userRahul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Quechua Waterproof 4-Person Camping Tent',
        description: 'Easy 2-second pitch pop-up tent with blackout flysheet and double skin ventilation. Comes with ground stakes and carrying duffle.',
        category: 'Outdoor',
        condition: 'new',
        photos: [
          'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 7,
        status: 'on_loan',
        owner: userMeera._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Epson Full HD Portable Home Projector (3300 Lumens)',
        description: 'Brilliant 1080p home theater projector with HDMI / USB inputs. Great for backyard movie nights, sports screenings, or wedding slides.',
        category: 'Electronics',
        condition: 'new',
        photos: [
          'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 3,
        status: 'available',
        owner: userAthul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Hawkins 12-Litre Jumbo Party Pressure Cooker',
        description: 'Extra-large anodised pressure cooker ideal for community feasts, biryani preparation, and large family get-togethers.',
        category: 'Kitchen',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1584990347449-39b56f8f5539?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 2,
        status: 'available',
        owner: userMeera._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Kärcher K2 High Pressure Car & Patio Washer',
        description: '110-bar pressure washer with dirt blaster lance and detergent suction hose. Washes cars, mossy driveways, and compound walls in minutes.',
        category: 'Cleaning',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 2,
        status: 'available',
        owner: userRahul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Fiskars Telescopic Tree Branch Lopper & Pruner',
        description: 'Extends up to 4 meters for safe tree trimming without climbing. Cuts branches up to 32mm smoothly with bypass carbon steel blade.',
        category: 'Gardening',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 4,
        status: 'available',
        owner: userAthul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Yonex Badminton Set with 4 Racquets & Portable Net',
        description: 'Complete outdoor recreational badminton set with quick-install net, 4 carbon graphite racquets, and 6 nylon shuttlecocks.',
        category: 'Leisure',
        condition: 'new',
        photos: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 5,
        status: 'available',
        owner: userMeera._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Makita Compact Jigsaw with Variable Speed',
        description: '450W precision wood and plastic contour cutter with dust collection port and assorted wood/metal blades.',
        category: 'Tools',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 3,
        status: 'available',
        owner: userRahul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Philips Digital Air Fryer XL (4.1 Litre)',
        description: 'Rapid Air technology for healthy snacks, samosas, and roasted vegetables. Easy touch panel with preset cooking modes.',
        category: 'Kitchen',
        condition: 'new',
        photos: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 3,
        status: 'available',
        owner: userAthul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Professional Folding Massage & Therapy Table',
        description: 'Portable wooden lightweight massage and physiotherapy bed with face cradle and carry bag.',
        category: 'Other',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 5,
        status: 'available',
        owner: userMeera._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Stanley 65-Piece Home Tool Kit with Hard Case',
        description: 'Comprehensive kit including claw hammer, pliers, screwdrivers, ratchet set, measuring tape, and torpedo level.',
        category: 'Tools',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 4,
        status: 'available',
        owner: userAthul._id,
        locality: sahrdayaLocality
      },
      {
        title: 'Catan & Ticket to Ride Board Game Bundle',
        description: 'Original classic European strategy board games. Complete with all tiles, resource cards, miniature train cars, and rulebooks.',
        category: 'Leisure',
        condition: 'good',
        photos: [
          'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?auto=format&fit=crop&w=800&q=80'
        ],
        maxLoanDays: 7,
        status: 'available',
        owner: userRahul._id,
        locality: sahrdayaLocality
      }
    ];

    const items = await Item.insertMany(itemsData);

    // 4. Create Loans
    // Loan 1: Quechua Tent is ON LOAN to Athul (Approved - active)
    const tentItem = items.find(i => i.title.includes('Tent'));
    const loanActive = await Loan.create({
      item: tentItem._id,
      borrower: userAthul._id,
      lender: userMeera._id,
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
      status: 'approved',
      notes: 'Planning a weekend trekking trip to Nelliyampathy hills with family!'
    });

    // Loan 2: Bosch Drill - Pending request from Meera to Athul
    const drillItem = items.find(i => i.title.includes('Bosch'));
    const loanPending = await Loan.create({
      item: drillItem._id,
      borrower: userMeera._id,
      lender: userAthul._id,
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'pending',
      notes: 'Need to install new kitchen spice racks and curtain rods.'
    });

    // Loan 3: Projector - Returned with mutual ratings
    const projectorItem = items.find(i => i.title.includes('Projector'));
    const loanReturned = await Loan.create({
      item: projectorItem._id,
      borrower: userRahul._id,
      lender: userAthul._id,
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      status: 'returned',
      returnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      notes: 'Family FIFA tournament projection.'
    });

    // Create ratings for returned loan
    await Rating.create({
      loan: loanReturned._id,
      rater: userRahul._id,
      ratedUser: userAthul._id,
      score: 5,
      comment: 'Super crisp projector, Athul gave a quick demo on how to connect HDMI. Return was effortless!'
    });

    await Rating.create({
      loan: loanReturned._id,
      rater: userAthul._id,
      ratedUser: userRahul._id,
      score: 5,
      comment: 'Rahul took great care of the device and returned it right on schedule in original box.'
    });

    console.log('Seed data successfully inserted!');
    console.log(`Created: 4 Localities, 5 Users (including Admin), ${items.length} Items, 3 Loans.`);
  } catch (err) {
    console.error('Error seeding data:', err);
  }
};

const autoSeedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    await seedData();
  }
};

if (require.main === module) {
  const { connectDB, closeDB } = require('../config/db');
  connectDB().then(async () => {
    await seedData();
    await closeDB();
    process.exit(0);
  });
}

module.exports = { seedData, autoSeedIfEmpty };
