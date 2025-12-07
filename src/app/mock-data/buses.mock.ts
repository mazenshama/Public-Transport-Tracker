import { Bus } from '../../service/api.service-admin';

export const MOCK_BUSES: Bus[] = [
  {
    id: '1',
    number: '12',
    capacity: 50,
    routeName: 'المعادي-Maadi',
    status: 'active'
  },
  {
    id: '2',
    number: '23',
    capacity: 40,
    routeName: 'المظلات - El‑Mozallat',
    status: 'inactive'
  },
  {
    id: '3',
    number: '7',
    capacity: 60,
    routeName: 'السيدة زينب - Sayedah Zeinab',
    status: 'available'
  }
];
