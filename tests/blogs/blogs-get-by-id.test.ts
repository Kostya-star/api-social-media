// import { APP_ROUTES } from '../../src/settings/routing';
// import { req } from '../helper';
// import { HTTP_STATUS_CODES } from '../../src/settings/http-status-codes';

// describe('BLOGS GET POST BY ID request', () => {
//   let testBlogId;

//   beforeAll(async () => {
//     // Set up the test data with a POST request
//     const response = await request(app)
//       .post('/blogs')
//       .send({ title: 'Test Blog', content: 'Content for testing' });
    
//     testBlogId = response.body.id;
//     expect(response.status).toBe(201);
//   });

//   afterAll(async () => {
//     // Clean up by deleting the test data
//     if (testBlogId) {
//       await request(app).delete(`/blogs/${testBlogId}`);
//     }
//   });
//   test('status check', async () => {
//     const res = await req.get(APP_ROUTES.BLOGS).expect(HTTP_STATUS_CODES.SUCCESS_200);

//     expect(Array.isArray(res.body)).toBe(true);
//   });
// });
