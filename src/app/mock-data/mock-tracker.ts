import { Bus } from '../../service/bus.model';

export const MOCK_BUSES: Bus[] = [
  {
    id: '1',
    number: '12',
    status: 'active',
    routeName: 'ramses-رمسيس',
    currentLatitude: 30.060,
    currentLongitude: 31.233
  },
  {
    id: '2',
    number: '23',
    status: 'active',
    routeName: 'العجوزه-Agouza',
    currentLatitude: 30.050,
    currentLongitude: 31.235
  },
  {
    id: '3',
    number: '7',
    status: 'active',
    routeName: 'التحرير-Tahrir',
    currentLatitude: 30.040,
    currentLongitude: 31.240
  }
];
