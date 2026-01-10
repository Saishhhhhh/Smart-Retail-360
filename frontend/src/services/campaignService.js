// Mock Campaign Service
// This will be replaced with actual API calls later

export const getCampaigns = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock AI-generated campaigns
  return [
    {
      id: '1',
      stockCode: '10080',
      productName: 'WHITE METAL LANTERN',
      targetCluster: 'VIP',
      discount: 15,
      stockSurplus: 2,
      emailSubject: 'Exclusive VIP Offer: Premium Lanterns at 15% Off',
      emailBody: 'Dear Valued Customer,\n\nAs one of our most loyal VIP members, we\'re thrilled to offer you an exclusive 15% discount on our elegant White Metal Lantern collection. These premium pieces add sophistication to any space.\n\nLimited stock available. Shop now!',
      pushNotification: '✨ VIP Exclusive: 15% off White Metal Lanterns! Limited time offer.',
      generatedAt: '2021-12-05T10:30:00Z'
    },
    {
      id: '2',
      stockCode: '10120',
      productName: 'RED WOOLLY HOTTIE WHITE HEART',
      targetCluster: 'Regular',
      discount: 20,
      stockSurplus: 1,
      emailSubject: 'Cozy Up: 20% Off on Winter Essentials',
      emailBody: 'Hi there!\n\nWinter is here, and we\'ve got the perfect way to stay warm! Get 20% off on our cozy Red Woolly Hottie with White Heart design. It\'s the perfect companion for those chilly evenings.\n\nDon\'t miss out - limited stock available!',
      pushNotification: '🧣 Stay warm! 20% off Red Woolly Hottie - perfect for winter!',
      generatedAt: '2021-12-05T10:32:00Z'
    },
    {
      id: '3',
      stockCode: '10125',
      productName: 'MINI PAINT SET VINTAGE',
      targetCluster: 'At-Risk',
      discount: 25,
      stockSurplus: 2.37,
      emailSubject: 'We Miss You! 25% Off to Welcome You Back',
      emailBody: 'We\'ve noticed you haven\'t shopped with us lately, and we\'d love to welcome you back! As a special gesture, enjoy 25% off on our vintage Mini Paint Set - perfect for unleashing your creativity.\n\nThis offer won\'t last long. Come back to us today!',
      pushNotification: '🎨 We miss you! Come back and save 25% on Vintage Paint Sets.',
      generatedAt: '2021-12-05T10:35:00Z'
    },
    {
      id: '4',
      stockCode: '10133',
      productName: 'COFFEE MUG CAT + HAVEN DESIGN',
      targetCluster: 'New',
      discount: 10,
      stockSurplus: 8.72,
      emailSubject: 'Welcome! Start Your Journey with 10% Off',
      emailBody: 'Welcome to our family! 🎉\n\nWe\'re excited to have you here. Start your shopping journey with a special 10% discount on our adorable Coffee Mug with Cat + Haven Design. It\'s the perfect addition to your morning routine!\n\nDiscover more amazing products!',
      pushNotification: '👋 Welcome! Enjoy 10% off your first purchase - Cat Coffee Mug!',
      generatedAt: '2021-12-05T10:40:00Z'
    },
    {
      id: '5',
      stockCode: '10135',
      productName: 'BLUE COAT RACK PARIS FASHION',
      targetCluster: 'VIP',
      discount: 18,
      stockSurplus: 15.11,
      emailSubject: 'VIP Exclusive: Paris Fashion Coat Rack - 18% Off',
      emailBody: 'Dear VIP Member,\n\nElevate your home with our exclusive Paris Fashion Blue Coat Rack. As a valued VIP customer, you get 18% off this elegant piece that combines functionality with style.\n\nLimited stock - shop now!',
      pushNotification: '✨ VIP: 18% off Paris Fashion Coat Rack - Elegant & Functional!',
      generatedAt: '2021-12-05T10:45:00Z'
    }
  ];
};

export const getCampaignsByCluster = async (cluster) => {
  const campaigns = await getCampaigns();
  if (!cluster || cluster === 'ALL') return campaigns;
  return campaigns.filter(campaign => campaign.targetCluster === cluster);
};
