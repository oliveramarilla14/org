import { prisma } from './database.js';

await prisma.club.createMany({
  data: [
    { name: 'Interpod' },
    { name: 'Inter de Miami' },
    { name: 'Roma' },
    { name: 'Perros' },
    { name: 'Wolves' },
    { name: 'Partners' },
    { name: 'San Marino' },
    { name: 'Japon' },
    { name: 'Manchester City' }
  ]
});

await prisma.player.createMany({
  data: [
    { name: 'Oliver Amarilla', teamId: 1, documentNumber: 5460698, promYear: 2020 },
    { name: 'Martín González', teamId: 2, documentNumber: 7265493, promYear: 2023 },
    { name: 'Lucía Fernández', teamId: 3, documentNumber: 3476925, promYear: 2025 },
    { name: 'Javier Pérez', teamId: 1, documentNumber: 6354728, promYear: 2024 },
    { name: 'Ana Rodríguez', teamId: 2, documentNumber: 8745920, promYear: 2023 },
    { name: 'Luis Martínez', teamId: 3, documentNumber: 9584732, promYear: 2025 },
    { name: 'María Gómez', teamId: 1, documentNumber: 5293746, promYear: 2024 },
    { name: 'Carlos Ramírez', teamId: 2, documentNumber: 1829374, promYear: 2023 },
    { name: 'Sofía López', teamId: 3, documentNumber: 4938275, promYear: 2025 },
    { name: 'Diego Sánchez', teamId: 1, documentNumber: 3758293, promYear: 2024 }
  ]
});
