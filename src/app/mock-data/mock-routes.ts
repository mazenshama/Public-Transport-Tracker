import { RouteModel } from '../../service/api.service-admin';

export const MOCK_ROUTES: RouteModel[] = [
  {
    id: '1',
    busNumber: '12',
    routeName: 'المعادي-Maadi',
    startTime: '06:00 AM',
    endTime: '10:00 AM',
    stops: [
      'إمبابة -Imbaba',
      'الكيت كات-Kit Kat',
      'شارع النيل-Nile Street',
      'المعادي-Maadi',
    ],
    frequency: 'Daily',
  },
  {
    id: '3',
    busNumber: '7',
    routeName: 'السيدة زينب - Sayedah Zeinab',
    startTime: '08:00 AM',
    endTime: '12:00 PM',
    stops: [
      'السيدة زينب - Sayedah Zeinab',
      'شارع بورسعيد - Boursaid Street',
      'شارع الأزهر - Al‑Azhar Street',
      'عتبة (جراج) - Ataba (Garage)',
    ],
    frequency: 'Weekends',
  },
  {
    id: '2',
    busNumber: '23',
    routeName: 'المظلات - El‑Mozallat',
    startTime: '07:00 AM',
    endTime: '11:00 AM',
    stops: [
      'كوبري عرابي - Araby Bridge',
      'المظلات - El‑Mozallat',
      'شارع شبرا - Shubra Street',
    ],
    frequency: 'Weekdays',
  },
];
