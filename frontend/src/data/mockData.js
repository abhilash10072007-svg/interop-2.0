// Comprehensive mock data for InterOp Platform matching user mockup

export const INITIAL_SERVICES = [
  {
    id: 'srv-001',
    title: 'Driving License',
    dept: 'Transport Department',
    category: 'Transport & Vehicles',
    icon: 'Car',
    description: 'Apply for a new driving license or renew your existing one. This service helps you get a valid driving license as per the Motor Vehicles Act.',
    processingTime: '3 - 7 days',
    fee: '₹ 200 (approx)',
    reqDocs: ['Aadhaar Card', 'Address Proof', 'Physical Fitness Declaration', 'Passport Size Photograph'],
    badge: 'Popular',
    tagline: 'Apply • Renew • Track',
    eligibility: 'Age 18+ for 4-wheelers / 16+ for gearless 2-wheelers. Citizen of India.'
  },
  {
    id: 'srv-002',
    title: 'Income Certificate',
    dept: 'Revenue & Land Administration',
    category: 'Identity & Documents',
    icon: 'Landmark',
    description: 'Official state-certified certificate proving individual/family income for education subsidies, scholarships, and fee waivers.',
    processingTime: '2 - 5 days',
    fee: '₹ 50',
    reqDocs: ['Salary Slip or IT Returns', 'Ration Card / Family Card', 'Self Declaration'],
    badge: 'Instant Sync',
    tagline: 'Apply • Track',
    eligibility: 'All resident citizens residing in state with valid address proof.'
  },
  {
    id: 'srv-003',
    title: 'Caste Certificate',
    dept: 'Backward Classes & Community Welfare',
    category: 'Identity & Documents',
    icon: 'Award',
    description: 'Community verification certificate for affirmative action benefits, educational admissions, and quota provisions.',
    processingTime: '4 - 7 days',
    fee: '₹ 60',
    reqDocs: ['Father/Ancestor Community Cert', 'School Transfer Certificate', 'Aadhaar Card'],
    badge: 'Digital Signature',
    tagline: 'Apply • Track',
    eligibility: 'Resident citizens belonging to notified communities.'
  },
  {
    id: 'srv-004',
    title: 'Vehicle Registration',
    dept: 'Transport Department',
    category: 'Transport & Vehicles',
    icon: 'Truck',
    description: 'Issue of new permanent Registration Certificate (RC), ownership transfer, hypothecation endorsement, and fitness certificate.',
    processingTime: '3 - 6 days',
    fee: '₹ 450 (approx)',
    reqDocs: ['Vehicle Sale Invoice', 'Valid Motor Insurance', 'PUC Certificate', 'Aadhaar Card'],
    badge: 'Fast-Track',
    tagline: 'New • Transfer • Update',
    eligibility: 'Vehicle owners possessing valid tax and insurance clearance.'
  },
  {
    id: 'srv-005',
    title: 'Personal Loan',
    dept: 'Public Financial Institutions Network',
    category: 'Finance & Loans',
    icon: 'Coins',
    description: 'Low-interest institutional personal loan schemes backed by state credit-guarantee funds for self-employed and salaried citizens.',
    processingTime: '1 - 3 days',
    fee: '₹ 0 Processing Fee',
    reqDocs: ['Bank Statements (6 months)', 'PAN Card', 'Aadhaar Card', 'Income Certificate'],
    badge: 'Direct Disbursal',
    tagline: 'Apply • Verify',
    eligibility: 'Citizens aged 21-58 with stable verifiable income source.'
  },
  {
    id: 'srv-006',
    title: 'More Services',
    dept: 'InterOp Digital Exchange',
    category: 'Social Welfare',
    icon: 'Grid',
    description: 'Explore over 120+ integrated central and state digital citizen services under a single unified sign-on.',
    processingTime: 'Instant',
    fee: 'Varies',
    reqDocs: ['Aadhaar Number'],
    badge: '120+ Services',
    tagline: 'View all services >',
    eligibility: 'All Indian citizens with DigiLocker or Aadhaar credentials.'
  }
];

export const SERVICE_CATEGORIES = [
  { id: 'cat-1', name: 'Identity & Documents', count: 12, icon: 'FileText' },
  { id: 'cat-2', name: 'Transport & Vehicles', count: 8, icon: 'Car' },
  { id: 'cat-3', name: 'Finance & Loans', count: 6, icon: 'Banknote' },
  { id: 'cat-4', name: 'Education', count: 9, icon: 'GraduationCap' },
  { id: 'cat-5', name: 'Social Welfare', count: 14, icon: 'HeartHandshake' },
  { id: 'cat-6', name: 'Property & Land', count: 5, icon: 'Building' },
  { id: 'cat-7', name: 'Health & Others', count: 11, icon: 'ShieldPlus' }
];

export const INITIAL_APPLICATIONS = [
  {
    id: 'DL-2025-00123',
    serviceName: 'Driving License',
    serviceCategory: 'Transport & Vehicles',
    appliedOn: '12 Apr 2025',
    currentStep: 'Document Upload',
    status: 'In Progress',
    department: 'Transport Department',
    updatedAt: '12 Apr 2025',
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '12 Apr 2025 09:30 AM' },
      { name: 'Aadhaar eKYC Verified', status: 'completed', date: '12 Apr 2025 09:32 AM' },
      { name: 'Document Upload & Medical Form', status: 'current', date: 'Awaiting User Upload' },
      { name: 'RTO Officer Approval & Slot Booking', status: 'pending', date: '--' },
      { name: 'Digital Smart Card Dispatched', status: 'pending', date: '--' }
    ]
  },
  {
    id: 'PL-2025-00456',
    serviceName: 'Personal Loan',
    serviceCategory: 'Finance & Loans',
    appliedOn: '28 Mar 2025',
    currentStep: 'Verification',
    status: 'Approved',
    department: 'Public Financial Institutions Network',
    updatedAt: '28 Mar 2025',
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '28 Mar 2025 11:10 AM' },
      { name: 'Credit Score Assessment', status: 'completed', date: '28 Mar 2025 11:15 AM' },
      { name: 'Income & Document Verification', status: 'completed', date: '28 Mar 2025 02:00 PM' },
      { name: 'Loan Sanctioned & Disbursed', status: 'completed', date: '28 Mar 2025 04:30 PM' }
    ]
  },
  {
    id: 'IC-2025-00879',
    serviceName: 'Income Certificate',
    serviceCategory: 'Identity & Documents',
    appliedOn: '20 Mar 2025',
    currentStep: 'Application Submitted',
    status: 'In Progress',
    department: 'Revenue & Land Administration',
    updatedAt: '20 Mar 2025',
    steps: [
      { name: 'Application Submitted', status: 'completed', date: '20 Mar 2025 03:20 PM' },
      { name: 'Revenue Inspector Verification', status: 'current', date: 'In Review' },
      { name: 'Tahsildar Digital Sign-off', status: 'pending', date: '--' },
      { name: 'Certificate Download Available', status: 'pending', date: '--' }
    ]
  },
  {
    id: 'VR-2025-00021',
    serviceName: 'Vehicle Registration',
    serviceCategory: 'Transport & Vehicles',
    appliedOn: '15 Mar 2025',
    currentStep: 'Payment',
    status: 'Approved',
    department: 'Transport Department',
    updatedAt: '15 Mar 2025',
    steps: [
      { name: 'Application & Chassis Info', status: 'completed', date: '15 Mar 2025 10:00 AM' },
      { name: 'RTO Vehicle Inspection', status: 'completed', date: '15 Mar 2025 01:15 PM' },
      { name: 'Fee & Road Tax Payment', status: 'completed', date: '15 Mar 2025 02:30 PM' },
      { name: 'RC Smart Card Issued', status: 'completed', date: '15 Mar 2025 04:00 PM' }
    ]
  },
  {
    id: 'CC-2025-00567',
    serviceName: 'Caste Certificate',
    serviceCategory: 'Identity & Documents',
    appliedOn: '10 Mar 2025',
    currentStep: 'Documents Required',
    status: 'Pending',
    department: 'Backward Classes Welfare Dept',
    updatedAt: '10 Mar 2025',
    steps: [
      { name: 'Application Received', status: 'completed', date: '10 Mar 2025 04:10 PM' },
      { name: 'Document Verification', status: 'current', date: 'Pending Family Tree Proof' },
      { name: 'Field Inquiry by VAO', status: 'pending', date: '--' },
      { name: 'Certificate Generation', status: 'pending', date: '--' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    category: 'Application Updates',
    type: 'success',
    title: 'Application Approved',
    message: 'Your Driving License application has been approved.',
    time: '2h ago',
    read: false
  },
  {
    id: 'notif-2',
    category: 'Application Updates',
    type: 'warning',
    title: 'Action Required',
    message: 'Please upload the required documents for Driving License application.',
    time: '4h ago',
    read: false
  },
  {
    id: 'notif-3',
    category: 'General',
    type: 'info',
    title: 'New Service Available',
    message: 'Income Certificate service is now available.',
    time: '1d ago',
    read: false
  },
  {
    id: 'notif-4',
    category: 'System Updates',
    type: 'auth',
    title: 'OTP Verification',
    message: 'Your OTP for login is 456721. It expires in 5 minutes.',
    time: '1d ago',
    read: true
  },
  {
    id: 'notif-5',
    category: 'System Updates',
    type: 'system',
    title: 'System Update',
    message: 'Maintenance scheduled on 15 Apr 2025, 2:00 AM.',
    time: '2d ago',
    read: true
  }
];

export const INITIAL_CONSENTS = [
  {
    id: 'cns-1',
    name: 'Aadhaar Data Sharing',
    purpose: 'For identity verification and KYC purposes.',
    validTill: '12 Dec 2025',
    department: 'UIDAI & Central Services Gateway',
    enabled: true,
    lastAccessed: '12 Apr 2025, 10:14 AM'
  },
  {
    id: 'cns-2',
    name: 'Income Data Sharing',
    purpose: 'For loan and financial services.',
    validTill: '28 Nov 2025',
    department: 'Income Tax Dept & State Revenue',
    enabled: true,
    lastAccessed: '28 Mar 2025, 11:15 AM'
  },
  {
    id: 'cns-3',
    name: 'Education Records',
    purpose: 'For scholarship and education services.',
    validTill: '15 Jan 2026',
    department: 'DigiLocker & National Academic Depository',
    enabled: true,
    lastAccessed: '20 Mar 2025, 03:20 PM'
  }
];

export const CONSENT_HISTORY = [
  {
    id: 'ch-1',
    service: 'Aadhaar Verification',
    department: 'UIDAI',
    date: '12 Apr 2025',
    status: 'Approved'
  },
  {
    id: 'ch-2',
    service: 'Financial Statement Check',
    department: 'Public Financial Network',
    date: '28 Mar 2025',
    status: 'Approved'
  },
  {
    id: 'ch-3',
    service: 'Income Certificate eKYC',
    department: 'State Revenue Portal',
    date: '20 Mar 2025',
    status: 'Approved'
  }
];
