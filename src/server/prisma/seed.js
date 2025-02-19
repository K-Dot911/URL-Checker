import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function seed() {
    console.log('Seeding database...');
    await prisma.request.createMany({
        data: [
            {
                url: 'https://jsonplaceholder.typicode.com/posts',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://jsonplaceholder.typicode.com/comments',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://jsonplaceholder.typicode.com/users',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://reqres.in/api/users/1',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://reqres.in/api/users/2',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://dog.ceo/api/breeds/image/random',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://api.publicapis.org/entries',
                status: 'NEW',
                httpCode: null,
            },
            {
                url: 'https://api.github.com/users/octocat',
                status: 'NEW',
                httpCode: null,
            }
        ],
    });
    console.log('Data seeded!');
}
seed()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
