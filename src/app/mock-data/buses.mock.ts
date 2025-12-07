import { Bus } from '../../service/api.service-admin';

export const MOCK_BUSES: Bus[] = [
  {
    id: '1',
    number: '12A',
    capacity: 50,
    routeName: 'El Haram - Dokki',
    status: 'active'
  },
  {
    id: '2',
    number: '33B',
    capacity: 40,
    routeName: 'Nasr City - Maadi',
    status: 'inactive'
  },
  {
    id: '3',
    number: '77X',
    capacity: 60,
    routeName: 'Giza - Downtown',
    status: 'available'
  }
];
