// import { APP_ROUTES } from '../../src/settings/routing';
// import { req } from '../helper';
// const createBlogHelper = async () => {
//     const response = await req
//       .post(APP_ROUTES.BLOGS)
//       .send({ title: 'Test Blog', content: 'Content for testing' });
    
//     testBlogId = response.body.id;
//     expect(response.status).toBe(201);
//   afterAll(async () => {
//     // Clean up by deleting the test data
//     if (testBlogId) {
//       await request(app).delete(`/blogs/${testBlogId}`);
//     }
//   });
// }