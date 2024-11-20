import { usersCollection } from '@/DB';
import { IBaseResponse } from '@/types/base-response';
import { IUser } from '@/types/users/user';
import { blogObjMapper } from '@/util/blogObjMapper';
import { buildQuery } from '@/util/buildQuery';
import { userObjMapper } from '@/util/userObjMapper';
import { ObjectId} from 'mongodb';

// const getAllBlogs = async ({ pageNumber, pageSize, searchNameTerm, sortBy, sortDirection }: Required<GetAllBlogsQuery>): Promise<IBaseResponse<IBlog>> => {
//   const { sortOptions, skip, limit } = buildQuery<IBlog>({ pageNumber, pageSize, sortBy, sortDirection });

//   const query = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};

//   const blogs = await blogsCollection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray();

//   const totalCount = await blogsCollection.countDocuments(query);
//   const pagesCount = Math.ceil(totalCount / pageSize);

//   return {
//     pagesCount,
//     page: pageNumber,
//     pageSize,
//     totalCount,
//     items: blogs.map(blogObjMapper),
//   };
// };

const createUser = async (newUser: IUser): Promise<IUser> => {
  const res = await usersCollection.insertOne(newUser);
  return userObjMapper({ ...newUser, _id: res.insertedId });
};

// const deleteBlog = async (blogId: ObjectId): Promise<void> => {
//   await blogsCollection.deleteOne({ _id: new ObjectId(blogId) });
// };

export default {
  // getAllBlogs,
  createUser,
  // deleteBlog,
};
